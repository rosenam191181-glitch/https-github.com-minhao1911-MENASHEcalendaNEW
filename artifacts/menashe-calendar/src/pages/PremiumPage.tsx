interface PremiumPageProps {
  onUpgrade: () => void;
  onBack?: () => void;
  isPremium?: boolean;
}

const GOLD = "#d4a843";
const GOLD_GRAD = "linear-gradient(135deg, #b8860b 0%, #d4a843 50%, #f0c96a 100%)";
const DARK_CARD = "rgba(212,168,67,0.06)";
const BORDER_GOLD = "rgba(212,168,67,0.25)";

const PREMIUM_FEATURES = [
  {
    icon: "📖",
    title: "Daily Torah Study",
    subtitle: "Daf Yomi · Halacha Yomit · Mishna",
    desc: "Complete daily learning tracks with Bnei Menashe commentary and connections. Full Talmud, Mishna, and Halacha deep-dives.",
    preview: [
      { label: "Today's Daf", value: "Bava Kamma 47b" },
      { label: "Halacha", value: "Hilchot Shabbat §302" },
      { label: "Mishna", value: "Avot 3:14" },
    ],
    color: "#4ade80",
    badge: "Daily",
  },
  {
    icon: "✨",
    title: "AI Holiday Insights",
    subtitle: "Powered by advanced AI",
    desc: "Deep spiritual themes, historical context, and special Bnei Menashe traditions for every Yom Tov and fast day.",
    preview: [
      { label: "Upcoming", value: "Shavuot — 14 days" },
      { label: "Theme", value: "Revelation & Acceptance" },
      { label: "BM Connection", value: "The Lost Tribe's Return" },
    ],
    color: "#a78bfa",
    badge: "AI",
  },
  {
    icon: "⏰",
    title: "Advanced Zmanim Alerts",
    subtitle: "Personalised push notifications",
    desc: "Custom alerts for all 15+ Zmanim: Alot HaShachar, Misheyakir, Chatzot, and more. Set per-day preferences.",
    preview: [
      { label: "Candle Lighting", value: "Fri 6:42 PM" },
      { label: "Havdalah", value: "Sat 7:48 PM" },
      { label: "Chatzot", value: "12:38 PM daily" },
    ],
    color: "#fbbf24",
    badge: "Alerts",
  },
  {
    icon: "📊",
    title: "Community Census Tools",
    subtitle: "Bnei Menashe demographics",
    desc: "Full population data, family trees, aliyah statistics, and settlement maps for the entire Bnei Menashe community.",
    preview: [
      { label: "Total Families", value: "~9,200 registered" },
      { label: "Aliyah Waves", value: "12 waves since 1994" },
      { label: "Cities", value: "Jerusalem, Haifa, Modi'in" },
    ],
    color: "#34d399",
    badge: "Data",
  },
  {
    icon: "🎙",
    title: "Audio Prayer Guides",
    subtitle: "Listen & follow along",
    desc: "Full audio recordings of Shacharit, Mincha, Ma'ariv, Shabbat prayers and special holiday services in the Bnei Menashe tradition.",
    preview: [
      { label: "Shacharit", value: "45 min complete" },
      { label: "Kabbalat Shabbat", value: "30 min recording" },
      { label: "Kiddush", value: "Full Bnei Menashe nusach" },
    ],
    color: "#f472b6",
    badge: "Audio",
  },
  {
    icon: "📅",
    title: "Multi-Year Calendar",
    subtitle: "Plan years ahead",
    desc: "View and export Hebrew calendar events for any year. Plan Bar Mitzvahs, weddings, and community events with precision.",
    preview: [
      { label: "Range", value: "5780 – 5800 (20 yrs)" },
      { label: "Export", value: "PDF, iCal, Google" },
      { label: "Events", value: "All Yomim Tovim + custom" },
    ],
    color: GOLD,
    badge: "Export",
  },
];

const PLANS = [
  {
    id: "monthly",
    title: "Monthly",
    priceINR: "₹199",
    priceUSD: "$2.99",
    period: "/month",
    perks: ["Cancel anytime", "All features included"],
    popular: false,
  },
  {
    id: "annual",
    title: "Annual",
    priceINR: "₹999",
    priceUSD: "$11.99",
    period: "/year",
    perks: ["Save 58%", "Priority support", "All features included"],
    popular: true,
  },
];

function LockIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="11" width="18" height="11" rx="2" ry="2" fill="rgba(212,168,67,0.15)" stroke="rgba(212,168,67,0.7)" />
      <path d="M7 11V7a5 5 0 0 1 10 0v4" stroke="rgba(212,168,67,0.7)" />
    </svg>
  );
}

function StarIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="#d4a843" stroke="none">
      <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26" />
    </svg>
  );
}

function CheckIcon({ color = "#4ade80" }: { color?: string }) {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}

function FeatureCard({ feature, index, onUpgrade }: { feature: typeof PREMIUM_FEATURES[0]; index: number; onUpgrade: () => void }) {
  return (
    <div
      style={{
        borderRadius: 16,
        background: DARK_CARD,
        border: `1px solid ${BORDER_GOLD}`,
        overflow: "hidden",
        marginBottom: 14,
        boxShadow: "0 2px 16px rgba(0,0,0,0.35)",
        animation: `fadeSlideUp 0.4s ease ${index * 0.07}s both`,
      }}
    >
      <div style={{ padding: "16px 16px 12px" }}>
        <div style={{ display: "flex", alignItems: "flex-start", gap: 12 }}>
          <div style={{
            width: 44, height: 44, borderRadius: 12, flexShrink: 0,
            background: `${feature.color}18`,
            border: `1px solid ${feature.color}40`,
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 20,
          }}>
            {feature.icon}
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 2 }}>
              <span style={{ fontSize: 15, fontWeight: 700, color: "var(--foreground)" }}>{feature.title}</span>
              <span style={{
                fontSize: 10, fontWeight: 700, letterSpacing: "0.05em",
                background: `${feature.color}22`, color: feature.color,
                border: `1px solid ${feature.color}44`,
                borderRadius: 6, padding: "1px 6px",
              }}>{feature.badge}</span>
            </div>
            <div style={{ fontSize: 12, color: "var(--muted-foreground)", marginBottom: 6 }}>{feature.subtitle}</div>
            <div style={{ fontSize: 13, color: "var(--muted-foreground)", lineHeight: 1.5 }}>{feature.desc}</div>
          </div>
        </div>

        <div style={{
          marginTop: 12, borderRadius: 10,
          background: "rgba(0,0,0,0.25)",
          border: "1px solid rgba(255,255,255,0.06)",
          overflow: "hidden",
          position: "relative",
        }}>
          {feature.preview.map((row, i) => (
            <div key={i} style={{
              display: "flex", justifyContent: "space-between", alignItems: "center",
              padding: "8px 12px",
              borderBottom: i < feature.preview.length - 1 ? "1px solid rgba(255,255,255,0.04)" : "none",
            }}>
              <span style={{ fontSize: 12, color: "var(--muted-foreground)" }}>{row.label}</span>
              <span style={{ fontSize: 12, color: "var(--foreground)", fontWeight: 600, filter: "blur(3.5px)", userSelect: "none" }}>{row.value}</span>
            </div>
          ))}
          <div style={{
            position: "absolute", inset: 0,
            display: "flex", alignItems: "center", justifyContent: "center",
            background: "rgba(8,14,26,0.55)", backdropFilter: "blur(1px)",
            borderRadius: 10,
          }}>
            <button
              onClick={onUpgrade}
              style={{
                display: "flex", alignItems: "center", gap: 6,
                background: GOLD_GRAD, color: "#1a0f00",
                border: "none", borderRadius: 8, padding: "6px 14px",
                fontWeight: 700, fontSize: 12, cursor: "pointer",
              }}
            >
              <LockIcon />
              Unlock with Premium
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function PremiumPage({ onUpgrade, onBack, isPremium = false }: PremiumPageProps) {
  return (
    <div style={{
      minHeight: "100%", overflowY: "auto",
      background: "var(--background)",
      paddingBottom: 100,
    }}>
      <style>{`
        @keyframes fadeSlideUp {
          from { opacity: 0; transform: translateY(18px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes shimmer {
          0% { background-position: -200% center; }
          100% { background-position: 200% center; }
        }
        @keyframes pulse-gold {
          0%, 100% { box-shadow: 0 0 0 0 rgba(212,168,67,0.4); }
          50% { box-shadow: 0 0 0 8px rgba(212,168,67,0); }
        }
      `}</style>

      {/* Header */}
      {onBack && (
        <div style={{
          display: "flex", alignItems: "center", gap: 12,
          padding: "14px 16px 10px",
          borderBottom: "1px solid rgba(212,168,67,0.1)",
          background: "var(--background)",
          position: "sticky", top: 0, zIndex: 10,
        }}>
          <button
            onClick={onBack}
            style={{
              background: "rgba(212,168,67,0.1)", border: "1px solid rgba(212,168,67,0.25)",
              borderRadius: 10, width: 36, height: 36,
              display: "flex", alignItems: "center", justifyContent: "center",
              cursor: "pointer", color: GOLD, flexShrink: 0,
            }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="15 18 9 12 15 6" />
            </svg>
          </button>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 15, fontWeight: 800, color: "var(--foreground)" }}>Menashe Premium</div>
            <div style={{ fontSize: 11, color: "var(--muted-foreground)" }}>All features unlocked</div>
          </div>
          <div style={{ fontSize: 20 }}>👑</div>
        </div>
      )}

      {/* Hero Banner */}
      <div style={{
        padding: "28px 20px 24px",
        background: "linear-gradient(180deg, rgba(212,168,67,0.12) 0%, transparent 100%)",
        borderBottom: "1px solid rgba(212,168,67,0.15)",
        textAlign: "center",
        animation: "fadeSlideUp 0.3s ease both",
      }}>
        <div style={{
          width: 64, height: 64, borderRadius: 20,
          background: "linear-gradient(135deg, rgba(212,168,67,0.2) 0%, rgba(212,168,67,0.08) 100%)",
          border: "1.5px solid rgba(212,168,67,0.4)",
          display: "flex", alignItems: "center", justifyContent: "center",
          margin: "0 auto 14px", fontSize: 28,
          boxShadow: "0 4px 20px rgba(212,168,67,0.2)",
        }}>
          👑
        </div>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 6, marginBottom: 6 }}>
          <StarIcon />
          <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.12em", color: GOLD, textTransform: "uppercase" }}>
            Menashe Premium
          </span>
          <StarIcon />
        </div>
        <h1 style={{
          fontSize: 22, fontWeight: 800, margin: "0 0 8px",
          background: GOLD_GRAD,
          WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
          lineHeight: 1.2,
        }}>
          The Complete Sacred<br />Calendar Experience
        </h1>
        <p style={{ fontSize: 14, color: "var(--muted-foreground)", margin: "0 0 18px", lineHeight: 1.5 }}>
          Unlock everything built for the Bnei Menashe community — daily Torah, AI insights, advanced Zmanim, and more.
        </p>

        {/* Plans */}
        <div style={{ display: "flex", gap: 10 }}>
          {PLANS.map((plan) => (
            <div key={plan.id} style={{
              flex: 1, borderRadius: 14, padding: "14px 10px",
              background: plan.popular ? "rgba(212,168,67,0.1)" : "rgba(255,255,255,0.04)",
              border: plan.popular ? "1.5px solid rgba(212,168,67,0.5)" : "1px solid rgba(255,255,255,0.08)",
              position: "relative",
              animation: plan.popular ? "pulse-gold 2.5s ease-in-out infinite" : "none",
            }}>
              {plan.popular && (
                <div style={{
                  position: "absolute", top: -11, left: "50%", transform: "translateX(-50%)",
                  background: GOLD_GRAD, color: "#1a0f00",
                  fontSize: 10, fontWeight: 800, letterSpacing: "0.06em",
                  padding: "3px 10px", borderRadius: 8, whiteSpace: "nowrap",
                }}>
                  BEST VALUE
                </div>
              )}
              <div style={{ fontSize: 11, color: "var(--muted-foreground)", marginBottom: 4, fontWeight: 600 }}>{plan.title}</div>
              <div style={{ display: "flex", alignItems: "baseline", gap: 2, justifyContent: "center", marginBottom: 2 }}>
                <span style={{ fontSize: 22, fontWeight: 800, color: plan.popular ? GOLD : "var(--foreground)" }}>{plan.priceINR}</span>
                <span style={{ fontSize: 11, color: "var(--muted-foreground)" }}>{plan.period}</span>
              </div>
              <div style={{ fontSize: 11, color: "var(--muted-foreground)", marginBottom: 8 }}>{plan.priceUSD}{plan.period} intl.</div>
              {plan.perks.map((p, i) => (
                <div key={i} style={{ display: "flex", alignItems: "center", gap: 4, marginBottom: 3, justifyContent: "center" }}>
                  <CheckIcon color={plan.popular ? GOLD : "#4ade80"} />
                  <span style={{ fontSize: 11, color: "var(--muted-foreground)" }}>{p}</span>
                </div>
              ))}
            </div>
          ))}
        </div>

        <button
          onClick={onUpgrade}
          style={{
            width: "100%", marginTop: 14, padding: "15px 24px",
            background: GOLD_GRAD, color: "#1a0f00",
            border: "none", borderRadius: 14, cursor: "pointer",
            fontWeight: 800, fontSize: 16, letterSpacing: "0.02em",
            boxShadow: "0 4px 20px rgba(212,168,67,0.35)",
          }}
        >
          ✦ Upgrade to Premium
        </button>
        <p style={{ fontSize: 11, color: "var(--muted-foreground)", marginTop: 8 }}>
          7-day free trial · Cancel anytime · Secure payment
        </p>
      </div>

      {/* Feature Cards */}
      <div style={{ padding: "18px 16px 0" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14 }}>
          <div style={{ flex: 1, height: 1, background: "rgba(212,168,67,0.2)" }} />
          <span style={{ fontSize: 11, fontWeight: 700, color: GOLD, letterSpacing: "0.1em", textTransform: "uppercase" }}>
            Premium Features
          </span>
          <div style={{ flex: 1, height: 1, background: "rgba(212,168,67,0.2)" }} />
        </div>

        {PREMIUM_FEATURES.map((f, i) => (
          <FeatureCard key={f.title} feature={f} index={i} onUpgrade={onUpgrade} />
        ))}
      </div>

      {/* Testimonial */}
      <div style={{ margin: "6px 16px 0", padding: 16, borderRadius: 14, background: DARK_CARD, border: `1px solid ${BORDER_GOLD}` }}>
        <div style={{ fontSize: 20, marginBottom: 8, textAlign: "center" }}>✡</div>
        <p style={{
          fontSize: 13, color: "var(--muted-foreground)", lineHeight: 1.6,
          textAlign: "center", fontStyle: "italic", margin: 0,
        }}>
          "This app has transformed how our community observes the Jewish calendar. The Bnei Menashe connections make every holiday feel deeply personal."
        </p>
        <p style={{ fontSize: 12, color: GOLD, textAlign: "center", marginTop: 8, fontWeight: 600 }}>
          — Shalom Haokip, Manipur
        </p>
      </div>

      {/* Bottom CTA */}
      <div style={{ padding: "18px 16px 0" }}>
        <button
          onClick={onUpgrade}
          style={{
            width: "100%", padding: "15px 24px",
            background: GOLD_GRAD, color: "#1a0f00",
            border: "none", borderRadius: 14, cursor: "pointer",
            fontWeight: 800, fontSize: 16,
            boxShadow: "0 4px 20px rgba(212,168,67,0.35)",
          }}
        >
          ✦ Start My 7-Day Free Trial
        </button>
        <p style={{ fontSize: 11, color: "var(--muted-foreground)", textAlign: "center", marginTop: 8 }}>
          UPI · Credit/Debit Card · International cards accepted
        </p>
      </div>
    </div>
  );
}
