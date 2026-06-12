import { useState } from "react";

interface Props { onClose: () => void; }

type Step = "plans" | "payment" | "upi" | "success";
type Plan = "monthly" | "annual";

const FEATURES = [
  { emoji: "⏰", title: "Full Zmanim", desc: "All 15+ daily prayer times for any location" },
  { emoji: "📖", title: "Torah Library", desc: "Complete Daf Yomi, Mishna Yomit & Halacha Yomit" },
  { emoji: "🗓", title: "Multi-year Calendar", desc: "Plan events years ahead with all holidays" },
  { emoji: "💧", title: "Tahara Tools", desc: "Advanced mikveh & purity calculator" },
  { emoji: "🕯", title: "Shabbat Alerts", desc: "Candle lighting reminders every Friday" },
  { emoji: "📊", title: "Community Census", desc: "Full Bnei Menashe community data & insights" },
];

const UPI_APPS = [
  { name: "GPay", color: "#4285F4", icon: "G" },
  { name: "PhonePe", color: "#5f259f", icon: "P" },
  { name: "Paytm", color: "#002970", icon: "₹" },
  { name: "BHIM", color: "#00539C", icon: "B" },
];

const UPI_ID = "menashecalendar@upi";

function QRCode() {
  const grid = [
    [1,1,1,1,1,1,1,0,1,0,1,0,1,0,1,1,1,1,1,1,1],
    [1,0,0,0,0,0,1,0,0,1,0,1,0,0,1,0,0,0,0,0,1],
    [1,0,1,1,1,0,1,0,1,0,1,0,1,0,1,0,1,1,1,0,1],
    [1,0,1,1,1,0,1,0,0,1,0,0,0,0,1,0,1,1,1,0,1],
    [1,0,1,1,1,0,1,0,1,0,0,1,1,0,1,0,1,1,1,0,1],
    [1,0,0,0,0,0,1,0,0,0,1,0,0,0,1,0,0,0,0,0,1],
    [1,1,1,1,1,1,1,0,1,0,1,0,1,0,1,1,1,1,1,1,1],
    [0,0,0,0,0,0,0,0,1,1,0,1,0,1,0,0,0,0,0,0,0],
    [1,0,1,1,0,1,1,1,0,0,1,0,1,1,1,0,1,0,1,1,0],
    [0,1,0,0,1,0,0,1,1,0,0,1,0,0,0,1,0,1,0,0,1],
    [1,0,1,0,1,0,1,0,1,1,0,0,1,0,1,1,0,1,1,0,1],
    [0,1,0,1,0,1,0,0,0,1,1,0,0,1,0,0,1,0,0,1,0],
    [1,0,1,0,1,0,1,1,0,0,1,1,0,0,1,1,0,1,0,0,1],
    [0,0,0,0,0,0,0,0,1,0,0,1,1,0,0,1,0,0,1,0,1],
    [1,1,1,1,1,1,1,0,0,1,0,0,1,0,1,0,1,0,0,1,0],
    [1,0,0,0,0,0,1,0,1,0,1,0,0,1,0,1,0,1,0,0,1],
    [1,0,1,1,1,0,1,1,0,1,0,1,1,0,1,0,1,0,1,1,0],
    [1,0,1,1,1,0,1,0,1,0,1,0,0,1,0,1,0,1,0,0,1],
    [1,0,1,1,1,0,1,0,0,1,0,1,1,0,1,0,1,0,1,1,0],
    [1,0,0,0,0,0,1,0,1,0,0,1,0,1,0,1,0,0,0,0,1],
    [1,1,1,1,1,1,1,0,0,1,1,0,1,0,1,0,1,1,1,1,1],
  ];

  return (
    <svg viewBox="0 0 21 21" width="160" height="160" style={{ display: "block" }}>
      <rect width="21" height="21" fill="white" />
      {grid.map((row, y) =>
        row.map((cell, x) =>
          cell ? <rect key={`${x}-${y}`} x={x} y={y} width={1} height={1} fill="#0f1a2e" /> : null
        )
      )}
    </svg>
  );
}

export default function PremiumModal({ onClose }: Props) {
  const [step, setStep] = useState<Step>("plans");
  const [plan, setPlan] = useState<Plan>("annual");
  const [copied, setCopied] = useState(false);
  const [selectedApp, setSelectedApp] = useState<string | null>(null);

  const monthlyPrice = "₹199";
  const annualPrice = "₹999";
  const annualPerMonth = "₹83";

  function copyUPI() {
    navigator.clipboard.writeText(UPI_ID).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  function handleAppPay(appName: string) {
    setSelectedApp(appName);
    setTimeout(() => {
      setStep("success");
    }, 1200);
  }

  const gradientGold = "linear-gradient(135deg, #b8860b 0%, #d4a843 50%, #f0c96a 100%)";

  return (
    <div className="modal-overlay" onClick={step === "success" ? onClose : undefined}>
      <div
        className="modal-sheet"
        onClick={e => e.stopPropagation()}
        style={{ maxHeight: "92vh", overflowY: "auto", padding: 0 }}
      >
        {/* Header gradient bar */}
        <div style={{
          background: "linear-gradient(180deg, rgba(212,168,67,0.18) 0%, transparent 100%)",
          padding: "20px 20px 0",
          borderRadius: "20px 20px 0 0",
        }}>
          <div className="modal-handle" />

          {/* Close */}
          <button
            onClick={onClose}
            style={{
              position: "absolute", top: 16, right: 16,
              background: "rgba(255,255,255,0.08)", border: "none",
              color: "var(--text-muted)", width: 30, height: 30,
              borderRadius: "50%", cursor: "pointer", fontSize: 16,
              display: "flex", alignItems: "center", justifyContent: "center",
            }}
          >✕</button>

          {/* Step indicator */}
          <div style={{ display: "flex", justifyContent: "center", gap: 6, marginBottom: 16 }}>
            {(["plans","payment","upi","success"] as Step[]).map((s, i) => (
              <div key={s} style={{
                height: 3, width: step === s ? 24 : 8, borderRadius: 99,
                background: step === s ? "#d4a843" : "rgba(212,168,67,0.25)",
                transition: "all 0.3s",
              }} />
            ))}
          </div>
        </div>

        <div style={{ padding: "0 20px 24px" }}>

          {/* ── STEP 1: PLANS ── */}
          {step === "plans" && (
            <>
              <div style={{ textAlign: "center", marginBottom: 20 }}>
                <div style={{
                  width: 56, height: 56, borderRadius: 18,
                  background: gradientGold,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 26, margin: "0 auto 10px",
                  boxShadow: "0 4px 20px rgba(212,168,67,0.4)",
                }}>⭐</div>
                <div style={{ fontSize: 22, fontWeight: 800, color: "var(--foreground)" }}>
                  Upgrade to Premium
                </div>
                <div style={{ fontSize: 13, color: "var(--muted-foreground)", marginTop: 4 }}>
                  Unlock the full Sacred Calendar experience
                </div>
              </div>

              {/* Feature list */}
              <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 20 }}>
                {FEATURES.map((f, i) => (
                  <div key={i} style={{
                    display: "flex", alignItems: "center", gap: 12,
                    padding: "11px 14px",
                    background: "var(--card)", borderRadius: 12,
                    border: "1px solid var(--border)",
                  }}>
                    <div style={{
                      width: 36, height: 36, borderRadius: 10,
                      background: "rgba(212,168,67,0.12)",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      fontSize: 18, flexShrink: 0,
                    }}>{f.emoji}</div>
                    <div>
                      <div style={{ fontSize: 13, fontWeight: 700, color: "var(--foreground)" }}>{f.title}</div>
                      <div style={{ fontSize: 11, color: "var(--muted-foreground)", marginTop: 1 }}>{f.desc}</div>
                    </div>
                    <div style={{ marginLeft: "auto", color: "#4ade80", fontSize: 16 }}>✓</div>
                  </div>
                ))}
              </div>

              {/* Plan selector */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 16 }}>
                {/* Monthly */}
                <button
                  onClick={() => setPlan("monthly")}
                  style={{
                    padding: "16px 12px", borderRadius: 14, cursor: "pointer", textAlign: "center",
                    border: plan === "monthly" ? "2px solid #d4a843" : "2px solid var(--border)",
                    background: plan === "monthly" ? "rgba(212,168,67,0.08)" : "var(--card)",
                    transition: "all 0.2s", position: "relative",
                  }}
                >
                  <div style={{ fontSize: 11, color: "var(--muted-foreground)", marginBottom: 4 }}>MONTHLY</div>
                  <div style={{ fontSize: 24, fontWeight: 800, color: plan === "monthly" ? "#d4a843" : "var(--foreground)" }}>
                    {monthlyPrice}
                  </div>
                  <div style={{ fontSize: 11, color: "var(--muted-foreground)" }}>per month</div>
                </button>

                {/* Annual */}
                <button
                  onClick={() => setPlan("annual")}
                  style={{
                    padding: "16px 12px", borderRadius: 14, cursor: "pointer", textAlign: "center",
                    border: plan === "annual" ? "2px solid #d4a843" : "2px solid var(--border)",
                    background: plan === "annual" ? "rgba(212,168,67,0.1)" : "var(--card)",
                    transition: "all 0.2s", position: "relative",
                  }}
                >
                  <div style={{
                    position: "absolute", top: -11, left: "50%", transform: "translateX(-50%)",
                    background: gradientGold, color: "#0a0f1e",
                    fontSize: 9, fontWeight: 800, padding: "3px 10px",
                    borderRadius: 99, whiteSpace: "nowrap", letterSpacing: "0.06em",
                  }}>SAVE 58%</div>
                  <div style={{ fontSize: 11, color: "var(--muted-foreground)", marginBottom: 4 }}>ANNUAL</div>
                  <div style={{ fontSize: 24, fontWeight: 800, color: plan === "annual" ? "#d4a843" : "var(--foreground)" }}>
                    {annualPrice}
                  </div>
                  <div style={{ fontSize: 11, color: "var(--muted-foreground)" }}>{annualPerMonth}/month</div>
                </button>
              </div>

              <div style={{
                textAlign: "center", fontSize: 12, color: "var(--muted-foreground)",
                marginBottom: 14, padding: "8px 0",
                borderTop: "1px solid var(--border)", borderBottom: "1px solid var(--border)",
              }}>
                🔒 Secure payment · Cancel anytime · 7-day free trial
              </div>

              <button
                className="btn-gold"
                onClick={() => setStep("payment")}
                style={{ width: "100%", padding: "15px", fontSize: 15, fontWeight: 800, borderRadius: 14 }}
              >
                Start 7-Day Free Trial →
              </button>
              <button onClick={onClose} className="btn-close-full" style={{ marginTop: 10 }}>
                Maybe Later
              </button>
            </>
          )}

          {/* ── STEP 2: PAYMENT METHOD ── */}
          {step === "payment" && (
            <>
              <button
                onClick={() => setStep("plans")}
                style={{ background: "none", border: "none", color: "var(--muted-foreground)", cursor: "pointer", fontSize: 13, marginBottom: 14, padding: 0 }}
              >
                ← Back
              </button>

              <div style={{ textAlign: "center", marginBottom: 20 }}>
                <div style={{ fontSize: 20, fontWeight: 800, color: "var(--foreground)" }}>Choose Payment</div>
                <div style={{ fontSize: 13, color: "var(--muted-foreground)", marginTop: 4 }}>
                  {plan === "annual" ? `${annualPrice}/year` : `${monthlyPrice}/month`} · 7-day free trial
                </div>
              </div>

              {/* UPI — primary */}
              <button
                onClick={() => setStep("upi")}
                style={{
                  width: "100%", padding: "18px 16px", borderRadius: 14, cursor: "pointer",
                  border: "2px solid #d4a843", background: "rgba(212,168,67,0.08)",
                  display: "flex", alignItems: "center", gap: 14, marginBottom: 10,
                  transition: "all 0.2s",
                }}
              >
                <div style={{
                  width: 44, height: 44, borderRadius: 12,
                  background: gradientGold,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 20, flexShrink: 0,
                }}>₹</div>
                <div style={{ textAlign: "left", flex: 1 }}>
                  <div style={{ fontSize: 15, fontWeight: 700, color: "#d4a843" }}>UPI Payment</div>
                  <div style={{ fontSize: 12, color: "var(--muted-foreground)" }}>GPay · PhonePe · Paytm · BHIM · any UPI</div>
                </div>
                <div style={{
                  background: gradientGold, color: "#0a0f1e",
                  fontSize: 9, fontWeight: 800, padding: "3px 8px",
                  borderRadius: 99, letterSpacing: "0.05em",
                }}>INDIA</div>
                <span style={{ color: "#d4a843", fontSize: 18 }}>›</span>
              </button>

              {/* Divider */}
              <div style={{ display: "flex", alignItems: "center", gap: 10, margin: "4px 0 10px" }}>
                <div style={{ flex: 1, height: 1, background: "var(--border)" }} />
                <span style={{ fontSize: 11, color: "var(--muted-foreground)" }}>or</span>
                <div style={{ flex: 1, height: 1, background: "var(--border)" }} />
              </div>

              {/* Card */}
              <button
                onClick={() => setStep("upi")}
                style={{
                  width: "100%", padding: "16px", borderRadius: 14, cursor: "pointer",
                  border: "1px solid var(--border)", background: "var(--card)",
                  display: "flex", alignItems: "center", gap: 14, marginBottom: 10,
                }}
              >
                <div style={{
                  width: 44, height: 44, borderRadius: 12,
                  background: "rgba(99,102,241,0.15)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 20, flexShrink: 0,
                }}>💳</div>
                <div style={{ textAlign: "left", flex: 1 }}>
                  <div style={{ fontSize: 15, fontWeight: 700, color: "var(--foreground)" }}>Credit / Debit Card</div>
                  <div style={{ fontSize: 12, color: "var(--muted-foreground)" }}>Visa · Mastercard · RuPay</div>
                </div>
                <span style={{ color: "var(--muted-foreground)", fontSize: 18 }}>›</span>
              </button>

              <div style={{
                display: "flex", alignItems: "center", justifyContent: "center",
                gap: 6, marginTop: 14, fontSize: 11, color: "var(--muted-foreground)",
              }}>
                <span>🔒</span>
                <span>256-bit SSL encryption · PCI DSS compliant</span>
              </div>
            </>
          )}

          {/* ── STEP 3: UPI PAYMENT ── */}
          {step === "upi" && (
            <>
              <button
                onClick={() => setStep("payment")}
                style={{ background: "none", border: "none", color: "var(--muted-foreground)", cursor: "pointer", fontSize: 13, marginBottom: 14, padding: 0 }}
              >
                ← Back
              </button>

              <div style={{ textAlign: "center", marginBottom: 18 }}>
                <div style={{ fontSize: 20, fontWeight: 800, color: "var(--foreground)" }}>Pay via UPI</div>
                <div style={{ fontSize: 13, color: "var(--muted-foreground)", marginTop: 4 }}>
                  Scan QR or choose your UPI app
                </div>
              </div>

              {/* Amount badge */}
              <div style={{
                textAlign: "center", marginBottom: 16,
                padding: "10px", borderRadius: 12,
                background: "rgba(212,168,67,0.1)", border: "1px solid rgba(212,168,67,0.3)",
              }}>
                <span style={{ fontSize: 13, color: "var(--muted-foreground)" }}>Amount to pay: </span>
                <span style={{ fontSize: 18, fontWeight: 800, color: "#d4a843" }}>
                  {plan === "annual" ? annualPrice : monthlyPrice}
                </span>
                <span style={{ fontSize: 12, color: "var(--muted-foreground)" }}>
                  {plan === "annual" ? " / year" : " / month"}
                </span>
              </div>

              {/* QR Code */}
              <div style={{
                display: "flex", flexDirection: "column", alignItems: "center",
                gap: 10, marginBottom: 18,
              }}>
                <div style={{
                  padding: 12, borderRadius: 16, background: "white",
                  boxShadow: "0 4px 24px rgba(0,0,0,0.5)",
                }}>
                  <QRCode />
                </div>
                <div style={{ fontSize: 11, color: "var(--muted-foreground)" }}>
                  Scan with any UPI app
                </div>
              </div>

              {/* Divider */}
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
                <div style={{ flex: 1, height: 1, background: "var(--border)" }} />
                <span style={{ fontSize: 11, color: "var(--muted-foreground)" }}>or open UPI app directly</span>
                <div style={{ flex: 1, height: 1, background: "var(--border)" }} />
              </div>

              {/* UPI App buttons */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 16 }}>
                {UPI_APPS.map(app => (
                  <button
                    key={app.name}
                    onClick={() => handleAppPay(app.name)}
                    style={{
                      padding: "14px 12px", borderRadius: 12, cursor: "pointer",
                      border: selectedApp === app.name ? `2px solid ${app.color}` : "1px solid var(--border)",
                      background: selectedApp === app.name ? `${app.color}22` : "var(--card)",
                      display: "flex", alignItems: "center", gap: 10,
                      transition: "all 0.2s",
                    }}
                  >
                    <div style={{
                      width: 34, height: 34, borderRadius: 10,
                      background: app.color,
                      display: "flex", alignItems: "center", justifyContent: "center",
                      fontSize: 15, fontWeight: 800, color: "white", flexShrink: 0,
                    }}>{app.icon}</div>
                    <span style={{ fontSize: 14, fontWeight: 600, color: "var(--foreground)" }}>{app.name}</span>
                  </button>
                ))}
              </div>

              {/* UPI ID copy */}
              <div style={{
                padding: "12px 14px", borderRadius: 12,
                background: "var(--card)", border: "1px solid var(--border)",
                display: "flex", alignItems: "center", justifyContent: "space-between",
                marginBottom: 8,
              }}>
                <div>
                  <div style={{ fontSize: 10, color: "var(--muted-foreground)", marginBottom: 2 }}>UPI ID</div>
                  <div style={{ fontSize: 14, fontWeight: 600, color: "var(--foreground)", fontFamily: "monospace" }}>
                    {UPI_ID}
                  </div>
                </div>
                <button
                  onClick={copyUPI}
                  style={{
                    padding: "6px 12px", borderRadius: 8, cursor: "pointer",
                    border: "none",
                    background: copied ? "rgba(74,222,128,0.2)" : "rgba(212,168,67,0.15)",
                    color: copied ? "#4ade80" : "#d4a843",
                    fontSize: 12, fontWeight: 700, transition: "all 0.2s",
                  }}
                >
                  {copied ? "✓ Copied!" : "Copy"}
                </button>
              </div>

              <div style={{ fontSize: 11, color: "var(--muted-foreground)", textAlign: "center", marginTop: 6 }}>
                After payment, your trial activates instantly
              </div>
            </>
          )}

          {/* ── STEP 4: SUCCESS ── */}
          {step === "success" && (
            <>
              <div style={{ textAlign: "center", padding: "12px 0 8px" }}>
                <div style={{
                  width: 72, height: 72, borderRadius: "50%",
                  background: "rgba(74,222,128,0.15)",
                  border: "2px solid #4ade80",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 34, margin: "0 auto 14px",
                  animation: "pulse 1s ease-out",
                }}>✓</div>
                <div style={{ fontSize: 22, fontWeight: 800, color: "#4ade80" }}>
                  Payment Initiated!
                </div>
                <div style={{ fontSize: 14, color: "var(--muted-foreground)", marginTop: 6 }}>
                  {selectedApp ? `Opening ${selectedApp} to complete payment` : "Complete payment in your UPI app"}
                </div>
              </div>

              <div style={{
                margin: "20px 0",
                padding: "16px", borderRadius: 14,
                background: "rgba(74,222,128,0.06)", border: "1px solid rgba(74,222,128,0.2)",
              }}>
                <div style={{ fontSize: 13, fontWeight: 700, color: "#4ade80", marginBottom: 10 }}>
                  What happens next:
                </div>
                {[
                  "Complete payment in your UPI app",
                  "Premium activates within seconds",
                  "Your 7-day free trial begins today",
                  "Cancel anytime — no questions asked",
                ].map((step, i) => (
                  <div key={i} style={{ display: "flex", gap: 10, marginBottom: 8, alignItems: "flex-start" }}>
                    <div style={{
                      width: 20, height: 20, borderRadius: "50%",
                      background: "rgba(74,222,128,0.2)",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      fontSize: 11, color: "#4ade80", fontWeight: 700, flexShrink: 0, marginTop: 1,
                    }}>{i + 1}</div>
                    <div style={{ fontSize: 13, color: "var(--muted-foreground)" }}>{step}</div>
                  </div>
                ))}
              </div>

              <div style={{
                padding: "12px", borderRadius: 12,
                background: "var(--card)", border: "1px solid var(--border)",
                textAlign: "center", marginBottom: 16,
              }}>
                <div style={{ fontSize: 12, color: "var(--muted-foreground)" }}>Plan selected</div>
                <div style={{ fontSize: 18, fontWeight: 800, color: "#d4a843", marginTop: 2 }}>
                  {plan === "annual" ? `${annualPrice} / year` : `${monthlyPrice} / month`}
                </div>
              </div>

              <button
                className="btn-gold"
                onClick={onClose}
                style={{ width: "100%", padding: "15px", fontSize: 15, fontWeight: 800, borderRadius: 14 }}
              >
                Done — Go to Calendar
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
