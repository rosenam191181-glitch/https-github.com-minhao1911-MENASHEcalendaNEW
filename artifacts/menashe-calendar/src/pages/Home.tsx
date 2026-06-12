import { useState, useEffect } from "react";
import { HebrewCalendar, flags } from "@hebcal/core";
import { getOmerDay } from "../modals/OmerModal";
import { getHebrewDate, getDayOfWeek, getHebrewMonthName, hebrewDayNumeral } from "../lib/hebrewCalendar";
import { calculateZmanim, formatTime } from "../lib/zmanim";
import { getCurrentParasha, getUpcomingHolidays } from "../lib/parasha";
import { Location } from "../lib/locations";

const API_BASE = "/api";

const HOLIDAY_EMOJI: Record<string, string> = {
  "Rosh Hashana": "🍎", "Yom Kippur": "📖", "Sukkot": "🌿",
  "Shemini Atzeret": "✡", "Simchat Torah": "📜", "Chanukah": "🕎",
  "Tu BiShvat": "🌳", "Purim": "🎭", "Pesach": "🍷",
  "Yom HaShoah": "🕯", "Yom HaZikaron": "🪖", "Yom HaAtzmaut": "🇮🇱",
  "Lag BaOmer": "🔥", "Shavuot": "📜", "Tisha B'Av": "😢",
};

function getHolidayEmoji(name: string): string {
  for (const [key, emoji] of Object.entries(HOLIDAY_EMOJI)) {
    if (name.includes(key)) return emoji;
  }
  return "✡";
}

interface HolidayInsight {
  overview: string;
  spiritualTheme: string;
  bneiManasheConnection: string;
}

function TodayHolidayCard({ name }: { name: string }) {
  const [insight, setInsight] = useState<HolidayInsight | null>(null);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState(false);
  const emoji = getHolidayEmoji(name);

  useEffect(() => {
    fetch(`${API_BASE}/holiday-insights`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ holidayName: name }),
    })
      .then(r => r.ok ? r.json() : null)
      .then((data: HolidayInsight | null) => { if (data) setInsight(data); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [name]);

  function share() {
    if (!insight) return;
    const text = [
      `${emoji} ${name} — Today's Holiday`,
      ``,
      insight.overview,
      ``,
      `✡ Bnei Menashe Connection`,
      insight.bneiManasheConnection,
      ``,
      `— Sacred Calendar of Bnei Menashe`,
    ].join("\n");
    if (navigator.share) {
      navigator.share({ title: name, text }).catch(() => {});
    } else {
      navigator.clipboard?.writeText(text).catch(() => {});
    }
  }

  return (
    <div style={{
      marginBottom: 12, borderRadius: 16, overflow: "hidden",
      background: "linear-gradient(135deg, #1a2e1a 0%, #0d1e0d 60%, #1a1a2e 100%)",
      border: "1px solid rgba(74,222,128,0.25)",
      boxShadow: "0 4px 20px rgba(0,0,0,0.5), inset 0 1px 0 rgba(74,222,128,0.08)",
    }}>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>

      {/* Header */}
      <div style={{ padding: "14px 16px 0", display: "flex", alignItems: "center", gap: 12 }}>
        <div style={{
          width: 48, height: 48, borderRadius: 14, flexShrink: 0,
          background: "rgba(74,222,128,0.12)", border: "1px solid rgba(74,222,128,0.2)",
          display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24,
        }}>
          {emoji}
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 3 }}>
            <span style={{
              fontSize: 9, fontWeight: 800, letterSpacing: "0.12em", color: "#4ade80",
              background: "rgba(74,222,128,0.12)", border: "1px solid rgba(74,222,128,0.2)",
              padding: "2px 7px", borderRadius: 5,
            }}>TODAY'S HOLIDAY</span>
          </div>
          <div style={{ fontSize: 18, fontWeight: 800, color: "white", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
            {name}
          </div>
          <div style={{ fontSize: 11, color: "#86efac", marginTop: 1 }}>Chag Sameach! 🎉</div>
        </div>
      </div>

      {/* Insight body */}
      <div style={{ padding: "12px 16px" }}>
        {loading && (
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <div style={{
              width: 14, height: 14, borderRadius: "50%", flexShrink: 0,
              border: "2px solid rgba(74,222,128,0.3)", borderTopColor: "#4ade80",
              animation: "spin 0.8s linear infinite",
            }} />
            <span style={{ fontSize: 12, color: "#86efac" }}>Loading holiday insight…</span>
          </div>
        )}

        {!loading && insight && (
          <>
            <p style={{
              fontSize: 13, color: "#d1fae5", lineHeight: 1.7, marginBottom: 10,
              display: "-webkit-box", WebkitLineClamp: expanded ? undefined : 3,
              WebkitBoxOrient: "vertical", overflow: expanded ? "visible" : "hidden",
            }}>
              {insight.overview}
            </p>

            {!expanded && (
              <button
                onClick={() => setExpanded(true)}
                style={{ fontSize: 12, color: "#4ade80", background: "none", border: "none", cursor: "pointer", padding: 0, fontWeight: 700, marginBottom: 10 }}
              >
                Read more ↓
              </button>
            )}

            {expanded && (
              <>
                <div style={{ marginBottom: 10, padding: "10px 12px", borderRadius: 10, background: "rgba(74,222,128,0.07)", border: "1px solid rgba(74,222,128,0.15)" }}>
                  <div style={{ fontSize: 10, fontWeight: 800, letterSpacing: "0.1em", color: "#4ade80", marginBottom: 5 }}>🌟 SPIRITUAL THEME</div>
                  <p style={{ fontSize: 13, color: "#d1fae5", lineHeight: 1.7, margin: 0 }}>{insight.spiritualTheme}</p>
                </div>
                <div style={{ marginBottom: 10, padding: "10px 12px", borderRadius: 10, background: "rgba(212,168,67,0.07)", border: "1px solid rgba(212,168,67,0.18)" }}>
                  <div style={{ fontSize: 10, fontWeight: 800, letterSpacing: "0.1em", color: "#d4a843", marginBottom: 5 }}>✡ BNEI MENASHE CONNECTION</div>
                  <p style={{ fontSize: 13, color: "#fef3c7", lineHeight: 1.7, margin: 0 }}>{insight.bneiManasheConnection}</p>
                </div>
              </>
            )}

            <div style={{ display: "flex", gap: 8 }}>
              {expanded && (
                <button
                  onClick={() => setExpanded(false)}
                  style={{
                    flex: 1, padding: "9px 0",
                    background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)",
                    borderRadius: 10, color: "#94a3b8", fontSize: 12, fontWeight: 700, cursor: "pointer",
                  }}
                >
                  Show less ↑
                </button>
              )}
              <button
                onClick={share}
                style={{
                  flex: 1, padding: "9px 0",
                  background: "rgba(74,222,128,0.1)", border: "1px solid rgba(74,222,128,0.2)",
                  borderRadius: 10, color: "#4ade80", fontSize: 12, fontWeight: 700, cursor: "pointer",
                }}
              >
                ↑ Share
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

function getTodayHolidays(): string[] {
  const today = new Date();
  const events = HebrewCalendar.calendar({
    start: today,
    end: today,
    il: true,
    isHebrewYear: false,
    mask: flags.CHAG | flags.MODERN_HOLIDAY,
  });
  return events.map(ev => ev.render("en"));
}

interface HomeProps {
  location: Location;
  theme: string;
  onNavigate: (page: string) => void;
  onMoreTools: () => void;
  onShowHolidays: () => void;
  onShowParashah: () => void;
  onShowPremium: () => void;
  onShowDafYomi: () => void;
  onShowOmer: () => void;
  onLocationClick: () => void;
  onToggleTheme: () => void;
  onOpenSiddur: () => void;
}

export default function Home({
  location, theme,
  onNavigate, onMoreTools, onShowHolidays, onShowParashah, onShowPremium, onShowDafYomi, onShowOmer,
  onLocationClick, onToggleTheme, onOpenSiddur,
}: HomeProps) {
  const today = new Date();
  const hdate = getHebrewDate(today);
  const zmanim = calculateZmanim(today, location.lat, location.lng, location.candleLightingMinutes);
  const parasha = getCurrentParasha(today);
  const holidays = getUpcomingHolidays(today, 3);

  const hebrewDay = hebrewDayNumeral(hdate.getDate());
  const hebrewMonth = getHebrewMonthName(hdate);
  const hebrewYear = hdate.getFullYear();

  const isFriday = today.getDay() === 5;
  const isShabbat = today.getDay() === 6;
  const showCandleLighting = isFriday || isShabbat;
  const isLight = theme === "light";
  const todayHolidays = getTodayHolidays();
  const omerDay = getOmerDay(today);

  const nextShabbat = new Date(today.getFullYear(), today.getMonth(), today.getDate() + (6 - today.getDay()));
  const dayName = getDayOfWeek(today);
  const monthStr = today.toLocaleDateString("en-US", { month: "long" });
  const yearStr = today.getFullYear();

  return (
    <div style={{ padding: "0 0 4px" }}>
      {/* App Header */}
      <div className="app-header">
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div className="app-icon">✡</div>
          <div>
            <div style={{ fontSize: 16, fontWeight: 700, color: "var(--text-primary)", lineHeight: 1 }}>Menashe</div>
            <div style={{ fontSize: 10, color: "var(--text-muted)", letterSpacing: "0.1em", fontWeight: 600 }}>CALENDAR</div>
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <button
            onClick={onLocationClick}
            style={{ display: "flex", alignItems: "center", gap: 4, background: "var(--elevated)", border: "1px solid var(--border)", borderRadius: 99, padding: "5px 12px", cursor: "pointer" }}
          >
            <span style={{ fontSize: 12 }}>📍</span>
            <span style={{ fontSize: 12, color: "var(--text-secondary)" }}>{location.name}</span>
          </button>
          <button
            onClick={onToggleTheme}
            style={{ width: 34, height: 34, borderRadius: "50%", background: "var(--elevated)", border: "1px solid var(--border)", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16 }}
          >
            {isLight ? "🌙" : "☀️"}
          </button>
        </div>
      </div>

      <div style={{ padding: "14px 16px 0" }}>

        {/* ── Date Card ── */}
        <div className="card" style={{
          marginBottom: 12, overflow: "hidden",
          borderTop: "2.5px solid var(--gold)",
        }}>
          <div style={{ padding: "14px 16px 16px" }}>
            {/* Eyebrow row */}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <span style={{ fontSize: 10, fontWeight: 800, letterSpacing: "0.12em", color: "var(--text-muted)", textTransform: "uppercase" }}>{dayName}</span>
                <span style={{ width: 3, height: 3, borderRadius: "50%", background: "var(--text-muted)", display: "inline-block" }} />
                <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.08em", color: "var(--gold)" }}>TODAY</span>
              </div>
              <span style={{ fontSize: 11, color: "var(--text-muted)", fontWeight: 600 }}>{yearStr}</span>
            </div>

            {/* Main date row */}
            <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between" }}>
              <div>
                <div style={{ fontSize: 64, fontWeight: 900, color: "var(--text-primary)", lineHeight: 0.9, letterSpacing: "-2px" }}>
                  {today.getDate()}
                </div>
                <div style={{ fontSize: 18, fontWeight: 600, color: "var(--text-secondary)", marginTop: 6 }}>{monthStr}</div>
              </div>

              {/* Hebrew date block */}
              <div style={{
                textAlign: "right", padding: "10px 14px", borderRadius: 12,
                background: "rgba(212,168,67,0.08)", border: "1px solid rgba(212,168,67,0.18)",
              }}>
                <div style={{ fontFamily: "'Noto Serif Hebrew', serif", fontSize: 22, color: "var(--gold)", lineHeight: 1, direction: "rtl", marginBottom: 4 }}>
                  {hebrewDay} {hebrewMonth}
                </div>
                <div style={{ fontSize: 11, color: "var(--text-muted)", fontWeight: 600, letterSpacing: "0.04em" }}>
                  {hebrewYear}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ── Today's Holiday ── */}
        {todayHolidays.map(name => (
          <TodayHolidayCard key={name} name={name} />
        ))}

        {/* ── Omer Counter (during the 49 days) ── */}
        {omerDay !== null && (
          <div
            className="card card-interactive"
            onClick={onShowOmer}
            style={{ padding: 14, marginBottom: 12, display: "flex", alignItems: "center", gap: 14 }}
          >
            {/* Mini progress ring */}
            <div style={{ position: "relative", flexShrink: 0 }}>
              <svg width="52" height="52" viewBox="0 0 52 52">
                <circle cx="26" cy="26" r="21" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="5" />
                <circle cx="26" cy="26" r="21" fill="none" stroke="#d4a843" strokeWidth="5"
                  strokeLinecap="round"
                  strokeDasharray={2 * Math.PI * 21}
                  strokeDashoffset={2 * Math.PI * 21 - (omerDay / 49) * 2 * Math.PI * 21}
                  transform="rotate(-90 26 26)"
                />
              </svg>
              <div style={{
                position: "absolute", inset: 0, display: "flex", flexDirection: "column",
                alignItems: "center", justifyContent: "center",
              }}>
                <span style={{ fontSize: 13, fontWeight: 900, color: "var(--text-primary)", lineHeight: 1 }}>{omerDay}</span>
              </div>
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 2 }}>
                <span className="tag tag-gold" style={{ fontSize: 10 }}>OMER</span>
                <span style={{ fontSize: 11, color: "var(--text-muted)" }}>Day {omerDay} of 49</span>
              </div>
              <div style={{ fontSize: 16, fontWeight: 700, color: "var(--text-primary)", marginBottom: 1 }}>Sefirat HaOmer</div>
              <div style={{ fontSize: 12, color: "var(--text-muted)" }}>{49 - omerDay} day{49 - omerDay !== 1 ? "s" : ""} until Shavuot</div>
            </div>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" strokeWidth="2"><polyline points="9 18 15 12 9 6" /></svg>
          </div>
        )}

        {/* ── Zmanim + Premium row ── */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr auto", gap: 10, marginBottom: 12 }}>
          {/* Zmanim card */}
          <div className="card card-interactive" style={{ padding: 14 }} onClick={() => onNavigate("zmanim")}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
              <span style={{ fontSize: 10, color: "var(--text-muted)", fontWeight: 800, letterSpacing: "0.1em" }}>ZMANIM</span>
              <span style={{ fontSize: 10, color: "var(--gold)", fontWeight: 700, letterSpacing: "0.06em" }}>VIEW ALL »</span>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
              {/* Sunrise */}
              <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
                  <div style={{ width: 24, height: 24, borderRadius: 7, background: "rgba(251,191,36,0.15)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13 }}>🌅</div>
                  <span style={{ fontSize: 10, color: "var(--text-muted)", fontWeight: 700 }}>SUNRISE</span>
                </div>
                <div style={{ fontSize: 22, fontWeight: 800, color: "var(--text-primary)", letterSpacing: "-0.5px" }}>{formatTime(zmanim.sunrise, location.tz)}</div>
              </div>
              {/* Sunset */}
              <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
                  <div style={{ width: 24, height: 24, borderRadius: 7, background: "rgba(249,115,22,0.15)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13 }}>🌇</div>
                  <span style={{ fontSize: 10, color: "var(--text-muted)", fontWeight: 700 }}>SUNSET</span>
                </div>
                <div style={{ fontSize: 22, fontWeight: 800, color: "var(--text-primary)", letterSpacing: "-0.5px" }}>{formatTime(zmanim.sunset, location.tz)}</div>
              </div>
            </div>
            {showCandleLighting && (
              <div style={{ marginTop: 10, padding: "7px 10px", background: "rgba(212,168,67,0.1)", borderRadius: 8, border: "1px solid rgba(212,168,67,0.22)", display: "flex", alignItems: "center", gap: 8 }}>
                <span style={{ fontSize: 14 }}>🕯</span>
                <div>
                  <div style={{ fontSize: 9, color: "var(--gold)", fontWeight: 700, letterSpacing: "0.08em" }}>CANDLE LIGHTING</div>
                  <div style={{ fontSize: 17, fontWeight: 800, color: "var(--gold)", letterSpacing: "-0.5px" }}>{formatTime(zmanim.candleLighting, location.tz)}</div>
                </div>
              </div>
            )}
          </div>

          {/* Premium card */}
          <div
            onClick={onShowPremium}
            style={{
              background: "linear-gradient(160deg, #1c2d50 0%, #0f1e38 60%, #161228 100%)",
              border: "1px solid rgba(212,168,67,0.3)",
              borderRadius: 12,
              padding: 12,
              display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "space-between",
              minWidth: 108, cursor: "pointer",
              boxShadow: "0 2px 12px rgba(0,0,0,0.4)",
              transition: "transform 0.1s, box-shadow 0.15s",
            }}
          >
            <div className="premium-badge">⭐ Premium</div>
            <div style={{ textAlign: "center", margin: "10px 0" }}>
              <div style={{ fontSize: 22, marginBottom: 4 }}>👑</div>
              <div style={{ fontSize: 10, color: "#94a3b8", lineHeight: 1.5 }}>Full Zmanim</div>
              <div style={{ fontSize: 10, color: "#94a3b8", lineHeight: 1.5 }}>Torah Library</div>
            </div>
            <button className="btn-gold" style={{ fontSize: 11, padding: "7px 10px", width: "100%", borderRadius: 8, textAlign: "center" }}>UPGRADE ↑</button>
          </div>
        </div>

        {/* ── Parasha Card ── */}
        {parasha && (
          <div className="card card-interactive" style={{ padding: 16, marginBottom: 12 }} onClick={onShowParashah}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
              <span style={{ fontSize: 10, color: "var(--text-muted)", fontWeight: 800, letterSpacing: "0.1em" }}>THIS WEEK'S PARASHA</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
              {/* Icon */}
              <div style={{
                width: 52, height: 52, borderRadius: 14, flexShrink: 0,
                background: "linear-gradient(135deg, rgba(212,168,67,0.2), rgba(212,168,67,0.08))",
                border: "1px solid rgba(212,168,67,0.25)",
                display: "flex", alignItems: "center", justifyContent: "center",
              }}>
                <span style={{ fontFamily: "'Noto Serif Hebrew', serif", fontSize: 26, color: "var(--gold)", lineHeight: 1 }}>פ</span>
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 20, fontWeight: 800, color: "var(--text-primary)", marginBottom: 2, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                  Parashat {parasha.name}
                </div>
                <div style={{ fontSize: 12, color: "var(--text-muted)", marginBottom: 4 }}>{parasha.book} · {parasha.verses}</div>
                <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  <span className="tag tag-blue" style={{ fontSize: 10 }}>SHABBAT</span>
                  <span style={{ fontSize: 11, color: "var(--text-muted)" }}>
                    {nextShabbat.toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                  </span>
                </div>
              </div>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" strokeWidth="2" style={{ flexShrink: 0 }}><polyline points="9 18 15 12 9 6" /></svg>
            </div>
          </div>
        )}

        {/* ── Upcoming Holiday ── */}
        {holidays.length > 0 && (
          <div className="card card-interactive" style={{ padding: 14, marginBottom: 12, display: "flex", alignItems: "center", gap: 14 }} onClick={onShowHolidays}>
            <div className="icon-circle" style={{ background: "rgba(99,102,241,0.15)", border: "1px solid rgba(99,102,241,0.2)", fontSize: 22 }}>
              🌙
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 2 }}>
                <span className="tag tag-green" style={{ fontSize: 10 }}>UPCOMING</span>
              </div>
              <div style={{ fontSize: 16, fontWeight: 700, color: "var(--text-primary)", marginBottom: 1 }}>{holidays[0].name}</div>
              <div style={{ fontSize: 12, color: "var(--text-muted)" }}>
                {holidays[0].date.toLocaleDateString("en-US", { weekday: "short", month: "long", day: "numeric" })}
              </div>
            </div>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" strokeWidth="2" style={{ flexShrink: 0 }}><polyline points="9 18 15 12 9 6" /></svg>
          </div>
        )}

        {/* ── Siddur Library ── */}
        <div
          onClick={onOpenSiddur}
          className="card-interactive"
          style={{
            marginBottom: 12, borderRadius: 14, overflow: "hidden", cursor: "pointer",
            background: "linear-gradient(140deg, #1a2a4a 0%, #0f1e38 55%, #1a1a30 100%)",
            border: "1px solid rgba(212,168,67,0.28)",
            boxShadow: "0 4px 20px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.04)",
          }}
        >
          <div style={{ padding: "16px 16px 12px", display: "flex", alignItems: "center", gap: 14 }}>
            <div style={{
              width: 50, height: 66, borderRadius: 8, flexShrink: 0,
              background: "linear-gradient(160deg, #203560, #0f1e38)",
              display: "flex", alignItems: "center", justifyContent: "center", fontSize: 26,
              border: "1px solid rgba(212,168,67,0.22)",
              boxShadow: "3px 4px 12px rgba(0,0,0,0.5)",
            }}>📚</div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 10, fontWeight: 800, color: "#d4a843", letterSpacing: "0.12em", marginBottom: 4 }}>SIDDUR LIBRARY</div>
              <div style={{ fontSize: 18, fontWeight: 800, color: "white", marginBottom: 3 }}>Sacred Texts & Prayers</div>
              <div style={{ fontSize: 12, color: "#7a90b0" }}>Siddurim, Tehillim, Torah & more</div>
            </div>
            <div style={{ width: 28, height: 28, borderRadius: "50%", background: "rgba(212,168,67,0.15)", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#d4a843" strokeWidth="2.5"><polyline points="9 18 15 12 9 6"/></svg>
            </div>
          </div>
          <div style={{ display: "flex", borderTop: "1px solid rgba(212,168,67,0.1)", padding: "8px 16px", gap: 0 }}>
            {["Siddur", "Tehillim", "Torah", "Kuki Books"].map((cat, i, arr) => (
              <div key={cat} style={{ flex: 1, fontSize: 10, color: "#64748b", fontWeight: 700, letterSpacing: "0.06em", textAlign: "center", borderRight: i < arr.length - 1 ? "1px solid rgba(255,255,255,0.06)" : "none" }}>{cat}</div>
            ))}
          </div>
        </div>

        {/* ── Daf Yomi ── */}
        <div className="card card-interactive" style={{ padding: 14, marginBottom: 12, display: "flex", alignItems: "center", gap: 14 }} onClick={onShowDafYomi}>
          <div className="icon-circle" style={{ background: "rgba(20,184,166,0.15)", border: "1px solid rgba(20,184,166,0.2)", fontSize: 22 }}>
            📖
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 15, fontWeight: 700, color: "var(--text-primary)", marginBottom: 2 }}>Daf Yomi</div>
            <div style={{ fontSize: 12, color: "var(--text-muted)" }}>Today's daily Talmud page</div>
          </div>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" strokeWidth="2"><polyline points="9 18 15 12 9 6" /></svg>
        </div>

        {/* ── Quick Actions ── */}
        <div className="quick-action-grid" style={{ marginBottom: 4 }}>
          <div className="quick-action" onClick={onShowHolidays}>
            <div className="quick-action-icon" style={{ background: "rgba(59,130,246,0.13)", border: "1px solid rgba(59,130,246,0.18)", borderRadius: 12 }}>📅</div>
            <div style={{ fontSize: 11, fontWeight: 600, color: "var(--text-secondary)", lineHeight: 1.3 }}>Holidays {hebrewYear}</div>
          </div>
          <div className="quick-action" onClick={onShowParashah}>
            <div className="quick-action-icon" style={{ background: "rgba(212,168,67,0.13)", border: "1px solid rgba(212,168,67,0.18)", borderRadius: 12 }}>📜</div>
            <div style={{ fontSize: 11, fontWeight: 600, color: "var(--text-secondary)", lineHeight: 1.3 }}>Parashah Schedule</div>
          </div>
          <div className="quick-action" onClick={onMoreTools}>
            <div className="quick-action-icon" style={{ background: "rgba(168,85,247,0.13)", border: "1px solid rgba(168,85,247,0.18)", borderRadius: 12 }}>🔧</div>
            <div style={{ fontSize: 11, fontWeight: 600, color: "var(--text-secondary)", lineHeight: 1.3 }}>More Tools</div>
          </div>
        </div>

      </div>
    </div>
  );
}
