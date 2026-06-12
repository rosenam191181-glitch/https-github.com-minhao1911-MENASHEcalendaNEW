import { useState, useEffect } from "react";
import { HDate, HebrewCalendar, flags } from "@hebcal/core";
import { calculateZmanim, formatTime } from "../lib/zmanim";
import { Location } from "../lib/locations";
import { hebrewDayNumeral } from "../lib/hebrewCalendar";

const API_BASE = "/api";

interface Props {
  day: number;
  month: number;
  year: number;
  location: Location;
  onClose: () => void;
}

interface HolidayInsight {
  overview: string;
  observances: string;
  spiritualTheme: string;
  bneiManasheConnection: string;
}

const HOLIDAY_HEBREW: Record<string, string> = {
  "Rosh Hashana": "רֹאשׁ הַשָּׁנָה",
  "Yom Kippur": "יוֹם כִּפּוּר",
  "Sukkot": "סֻכּוֹת",
  "Shemini Atzeret": "שְׁמִינִי עֲצֶרֶת",
  "Simchat Torah": "שִׂמְחַת תּוֹרָה",
  "Chanukah": "חֲנֻכָּה",
  "Tu BiShvat": "ט\"וּ בִּשְׁבָט",
  "Purim": "פּוּרִים",
  "Pesach": "פֶּסַח",
  "Yom HaShoah": "יוֹם הַשּׁוֹאָה",
  "Yom HaZikaron": "יוֹם הַזִּכָּרוֹן",
  "Yom HaAtzmaut": "יוֹם הָעַצְמָאוּת",
  "Lag BaOmer": "לַ\"ג בָּעֹמֶר",
  "Shavuot": "שָׁבוּעוֹת",
  "Tisha B'Av": "תִּשְׁעָה בְּאָב",
  "Rosh Chodesh": "רֹאשׁ חֹדֶשׁ",
};

function getHebrewName(name: string): string {
  for (const [key, hebrew] of Object.entries(HOLIDAY_HEBREW)) {
    if (name.includes(key)) return hebrew;
  }
  return "";
}

function isHoliday(name: string): boolean {
  return !name.toLowerCase().includes("parashat") && !name.toLowerCase().includes("parshat");
}

function InsightRow({ icon, title, text, accent }: { icon: string; title: string; text: string; accent?: boolean }) {
  const [open, setOpen] = useState(false);
  return (
    <div style={{
      borderRadius: 10, background: "var(--card)",
      border: `1px solid ${accent ? "rgba(212,168,67,0.2)" : "var(--border)"}`,
      marginBottom: 6, overflow: "hidden",
    }}>
      <button
        onClick={() => setOpen(o => !o)}
        style={{
          width: "100%", display: "flex", alignItems: "center", gap: 8,
          padding: "10px 12px", background: "none", border: "none", cursor: "pointer", textAlign: "left",
        }}
      >
        <span style={{ fontSize: 13, width: 20, flexShrink: 0 }}>{icon}</span>
        <span style={{ flex: 1, fontSize: 13, fontWeight: 700, color: "var(--text-primary)" }}>{title}</span>
        <svg width="9" height="9" viewBox="0 0 12 12" fill="none">
          <path
            d={open ? "M2 8 L6 4 L10 8" : "M2 4 L6 8 L10 4"}
            stroke={open ? "#d4a843" : "#64748b"}
            strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"
          />
        </svg>
      </button>
      {open && (
        <div style={{ padding: "0 12px 12px", borderTop: "1px solid var(--border)" }}>
          <p style={{ fontSize: 13, color: "var(--text-secondary)", lineHeight: 1.75, marginTop: 10, marginBottom: 0 }}>
            {text}
          </p>
        </div>
      )}
    </div>
  );
}

function HolidayInsightsSection({ holidayName }: { holidayName: string }) {
  const [insight, setInsight] = useState<HolidayInsight | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const hebrewName = getHebrewName(holidayName);

  async function loadInsights() {
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`${API_BASE}/holiday-insights`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ holidayName, hebrewName }),
      });
      if (!res.ok) throw new Error("Failed");
      const data = await res.json() as HolidayInsight;
      setInsight(data);
    } catch {
      setError("Could not load insights.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { loadInsights(); }, []);

  return (
    <div className="card" style={{ padding: 14, marginBottom: 12, border: "1px solid rgba(212,168,67,0.15)" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
        <div>
          <div style={{ fontSize: 11, fontWeight: 700, color: "var(--text-muted)", letterSpacing: "0.08em" }}>HOLIDAY INSIGHTS</div>
          <div style={{ fontSize: 15, fontWeight: 700, color: "var(--text-primary)", marginTop: 2 }}>{holidayName}</div>
          {hebrewName && (
            <div style={{ fontFamily: "'Noto Serif Hebrew',serif", fontSize: 14, color: "#d4a843", marginTop: 2 }}>{hebrewName}</div>
          )}
        </div>
        <span style={{ fontSize: 22 }}>✨</span>
      </div>

      {loading && (
        <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "6px 0" }}>
          <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
          <div style={{
            width: 14, height: 14, borderRadius: "50%",
            border: "2px solid rgba(212,168,67,0.3)", borderTopColor: "#d4a843",
            animation: "spin 0.8s linear infinite", flexShrink: 0,
          }} />
          <span style={{ fontSize: 13, color: "var(--text-muted)" }}>Generating insights…</span>
        </div>
      )}

      {error && (
        <div>
          <p style={{ fontSize: 13, color: "#ef4444", margin: "0 0 6px" }}>{error}</p>
          <button onClick={() => { setFetched(false); loadInsights(); }}
            style={{ fontSize: 12, color: "#d4a843", background: "none", border: "none", cursor: "pointer", padding: 0 }}>
            Retry
          </button>
        </div>
      )}

      {insight && (
        <div>
          <InsightRow icon="📋" title="Overview" text={insight.overview} />
          <InsightRow icon="🕍" title="Observances" text={insight.observances} />
          <InsightRow icon="🌟" title="Spiritual Theme" text={insight.spiritualTheme} />
          <InsightRow icon="✡" title="Bnei Menashe Connection" text={insight.bneiManasheConnection} accent />

          <button
            onClick={() => {
              const text = [
                `✡ ${holidayName}${hebrewName ? ` — ${hebrewName}` : ""}`,
                ``,
                `📋 Overview`,
                insight.overview,
                ``,
                `🌟 Spiritual Theme`,
                insight.spiritualTheme,
                ``,
                `✡ Bnei Menashe Connection`,
                insight.bneiManasheConnection,
                ``,
                `— Sacred Calendar of Bnei Menashe`,
              ].join("\n");
              if (navigator.share) {
                navigator.share({ title: holidayName, text }).catch(() => {});
              } else {
                navigator.clipboard?.writeText(text).catch(() => {});
              }
            }}
            style={{
              width: "100%", marginTop: 6, padding: "9px 0",
              background: "rgba(255,255,255,0.04)", border: "1px solid var(--border)",
              borderRadius: 10, color: "var(--text-secondary)", fontSize: 13, fontWeight: 700,
              cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
            }}
          >
            ↑ Share Insight
          </button>
        </div>
      )}
    </div>
  );
}

export default function DayModal({ day, month, year, location, onClose }: Props) {
  const date = new Date(year, month, day);
  const hdate = new HDate(date);
  const zmanim = calculateZmanim(date, location.lat, location.lng, location.candleLightingMinutes);

  const events = HebrewCalendar.calendar({
    start: date,
    end: date,
    il: true,
    isHebrewYear: false,
    sedrot: true,
    mask: flags.PARSHA_HASHAVUA | flags.CHAG | flags.ROSH_CHODESH | flags.SPECIAL_SHABBAT,
  }).map(ev => ev.render("en"));

  const dayName = date.toLocaleDateString("en-US", { weekday: "long" });
  const dateLong = date.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });
  const isShabbat = date.getDay() === 6;
  const isFriday = date.getDay() === 5;

  const holidayEvents = events.filter(isHoliday);

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-sheet" onClick={e => e.stopPropagation()} style={{ maxHeight: "90vh", overflowY: "auto" }}>
        <div className="modal-handle" />

        <div style={{ marginBottom: 16 }}>
          <div style={{ fontSize: 11, color: "var(--text-muted)", fontWeight: 700, letterSpacing: "0.1em", marginBottom: 4 }}>{dayName.toUpperCase()}</div>
          <div style={{ fontSize: 28, fontWeight: 800, color: "var(--text-primary)" }}>{dateLong}</div>
          <div style={{ fontFamily: "'Noto Serif Hebrew', serif", fontSize: 18, color: "#d4a843", marginTop: 6 }}>
            {hebrewDayNumeral(hdate.getDate())} {HDate.getMonthName(hdate.getMonth(), hdate.getFullYear())} {hdate.getFullYear()}
          </div>
        </div>

        {events.length > 0 && (
          <div className="card" style={{ padding: 14, marginBottom: 12 }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: "var(--text-muted)", letterSpacing: "0.08em", marginBottom: 10 }}>EVENTS</div>
            {events.map((ev, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: i < events.length - 1 ? 8 : 0 }}>
                <span style={{ color: "#d4a843" }}>✦</span>
                <span style={{ fontSize: 14, color: "var(--text-primary)" }}>{ev}</span>
              </div>
            ))}
          </div>
        )}

        {holidayEvents.map((ev, i) => (
          <HolidayInsightsSection key={i} holidayName={ev} />
        ))}

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 12 }}>
          <div className="card" style={{ padding: 14, textAlign: "center" }}>
            <div style={{ fontSize: 10, color: "var(--text-muted)", fontWeight: 700, letterSpacing: "0.08em", marginBottom: 6 }}>SUNRISE</div>
            <div style={{ fontSize: 22, fontWeight: 800, color: "var(--text-primary)" }}>{formatTime(zmanim.sunrise, location.tz)}</div>
          </div>
          <div className="card" style={{ padding: 14, textAlign: "center" }}>
            <div style={{ fontSize: 10, color: "var(--text-muted)", fontWeight: 700, letterSpacing: "0.08em", marginBottom: 6 }}>SUNSET</div>
            <div style={{ fontSize: 22, fontWeight: 800, color: "var(--text-primary)" }}>{formatTime(zmanim.sunset, location.tz)}</div>
          </div>
        </div>

        {(isFriday || isShabbat) && (
          <div className="card" style={{ padding: 14, marginBottom: 12, border: "1px solid rgba(212,168,67,0.3)", background: "rgba(212,168,67,0.05)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
              <div style={{ fontSize: 14, fontWeight: 700, color: "var(--text-primary)" }}>🕯 Candle Lighting</div>
              <div style={{ fontSize: 18, fontWeight: 800, color: "#d4a843" }}>{formatTime(zmanim.candleLighting, location.tz)}</div>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div style={{ fontSize: 14, fontWeight: 700, color: "var(--text-primary)" }}>Havdalah</div>
              <div style={{ fontSize: 18, fontWeight: 700, color: "var(--text-primary)" }}>{formatTime(zmanim.havdalah, location.tz)}</div>
            </div>
          </div>
        )}

        <button onClick={onClose} className="btn-close-full">Close</button>
      </div>
    </div>
  );
}
