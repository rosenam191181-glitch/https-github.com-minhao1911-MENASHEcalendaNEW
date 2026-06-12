import { Router } from "express";
import crypto from "crypto";

const router = Router();

/* ─────────────────────────────────────────────
   Lazy-load SDKs so the server starts even when
   keys are not yet configured.
───────────────────────────────────────────── */
function getRazorpay() {
  const keyId = process.env.RAZORPAY_KEY_ID;
  const keySecret = process.env.RAZORPAY_KEY_SECRET;
  if (!keyId || !keySecret) return null;
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const Razorpay = require("razorpay");
  return new Razorpay({ key_id: keyId, key_secret: keySecret });
}

function getStripe() {
  const secret = process.env.STRIPE_SECRET_KEY;
  if (!secret) return null;
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const Stripe = require("stripe");
  return new Stripe(secret, { apiVersion: "2024-11-20.acacia" });
}

/* ─────────────────────────────────────────────
   GET /api/payment/config
   Returns public keys + which gateways are live.
───────────────────────────────────────────── */
router.get("/payment/config", (_req, res) => {
  res.json({
    razorpay: {
      enabled: !!(process.env.RAZORPAY_KEY_ID && process.env.RAZORPAY_KEY_SECRET),
      keyId: process.env.RAZORPAY_KEY_ID ?? null,
    },
    stripe: {
      enabled: !!(process.env.STRIPE_SECRET_KEY && process.env.STRIPE_PUBLISHABLE_KEY),
      publishableKey: process.env.STRIPE_PUBLISHABLE_KEY ?? null,
    },
  });
});

/* ─────────────────────────────────────────────
   RAZORPAY — Create Order
   POST /api/payment/razorpay/order
   Body: { plan: "monthly" | "annual" }
───────────────────────────────────────────── */
router.post("/payment/razorpay/order", async (req, res) => {
  const rz = getRazorpay();
  if (!rz) {
    return res.status(503).json({ error: "Razorpay not configured" });
  }

  const { plan } = req.body as { plan: string };
  const amountPaise = plan === "annual" ? 99900 : 19900; // ₹999 or ₹199 in paise

  try {
    const order = await rz.orders.create({
      amount: amountPaise,
      currency: "INR",
      receipt: `receipt_${Date.now()}`,
      notes: {
        plan,
        product: "Menashe Calendar Premium",
      },
    });
    return res.json({
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      keyId: process.env.RAZORPAY_KEY_ID,
    });
  } catch (err: any) {
    return res.status(500).json({ error: err.message ?? "Order creation failed" });
  }
});

/* ─────────────────────────────────────────────
   RAZORPAY — Verify Payment Signature
   POST /api/payment/razorpay/verify
   Body: { orderId, paymentId, signature }
───────────────────────────────────────────── */
router.post("/payment/razorpay/verify", (req, res) => {
  const keySecret = process.env.RAZORPAY_KEY_SECRET;
  if (!keySecret) {
    return res.status(503).json({ error: "Razorpay not configured" });
  }

  const { orderId, paymentId, signature } = req.body as {
    orderId: string;
    paymentId: string;
    signature: string;
  };

  if (!orderId || !paymentId || !signature) {
    return res.status(400).json({ error: "Missing fields" });
  }

  const expected = crypto
    .createHmac("sha256", keySecret)
    .update(`${orderId}|${paymentId}`)
    .digest("hex");

  if (expected !== signature) {
    return res.status(400).json({ verified: false, error: "Signature mismatch" });
  }

  // TODO: persist subscription status to DB here
  return res.json({ verified: true, paymentId });
});

/* ─────────────────────────────────────────────
   STRIPE — Create Payment Intent
   POST /api/payment/stripe/intent
   Body: { plan: "monthly" | "annual" }
───────────────────────────────────────────── */
router.post("/payment/stripe/intent", async (req, res) => {
  const stripe = getStripe();
  if (!stripe) {
    return res.status(503).json({ error: "Stripe not configured" });
  }

  const { plan } = req.body as { plan: string };
  // USD prices: $2.99/month or $11.99/year
  const amountCents = plan === "annual" ? 1199 : 299;

  try {
    const intent = await stripe.paymentIntents.create({
      amount: amountCents,
      currency: "usd",
      automatic_payment_methods: { enabled: true },
      metadata: {
        plan,
        product: "Menashe Calendar Premium",
      },
    });
    return res.json({
      clientSecret: intent.client_secret,
      publishableKey: process.env.STRIPE_PUBLISHABLE_KEY,
    });
  } catch (err: any) {
    return res.status(500).json({ error: err.message ?? "Intent creation failed" });
  }
});

/* ─────────────────────────────────────────────
   STRIPE — Webhook (payment confirmation)
   POST /api/payment/stripe/webhook
───────────────────────────────────────────── */
router.post(
  "/payment/stripe/webhook",
  // raw body needed for signature verification
  (req, res, next) => {
    // express.json() already parsed — re-parse raw only if needed
    next();
  },
  async (req, res) => {
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
    const stripe = getStripe();

    if (!stripe || !webhookSecret) {
      return res.status(503).json({ error: "Stripe webhook not configured" });
    }

    const sig = req.headers["stripe-signature"] as string;
    let event;
    try {
      event = stripe.webhooks.constructEvent(req.body, sig, webhookSecret);
    } catch (err: any) {
      return res.status(400).json({ error: `Webhook Error: ${err.message}` });
    }

    if (event.type === "payment_intent.succeeded") {
      const intent = event.data.object as any;
      // TODO: activate subscription in DB for intent.metadata.userId
      console.log("Stripe payment succeeded:", intent.id);
    }

    return res.json({ received: true });
  }
);

export default router;
