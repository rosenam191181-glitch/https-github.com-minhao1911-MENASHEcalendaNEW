import { useState, useMemo } from "react";
import { getMonthCalendar, hebrewDayNumeral, getHebrewMonthsBetween } from "../lib/hebrewCalendar";
import { Location } from "../lib/locations";
import { calculateZmanim, formatTime } from "../lib/zmanim";
import { getUpcomingParashiyot } from "../lib/parasha";

interface CalendarPageProps {
  location: Location;
  onNavigate: (page: string) => void;
  onDayClick: (day: number, month: number, year: number) => void;
  onLocationClick: () => void;
}

const MONTHS = [
  "January","February","March","April","May","June",
  "July","August","September","October","November","December",
];

const DAY_HEADERS: { en: string; he: string }[] = [
  { en: "Sun", he: "ראשון" },
  { en: "Mon", he: "שני" },
  { en: "Tue", he: "שלישי" },
  { en: "Wed", he: "רביעי" },
  { en: "Thu", he: "חמישי" },
  { en: "Fri", he: "שישי" },
  { en: "Sat", he: "שבת" },
];

export default function CalendarPage({ location, onNavigate, onDayClick, onLocationClick }: CalendarPageProps) {
  const today = new Date();
  const [year, setYear] = useState(today.getFullYear());
  const [month, setMonth] = useState(today.getMonth());
  const [selectedDay, setSelectedDay] = useState<number | null>(null);

  const days = getMonthCalendar(year, month);
  const firstDayOfWeek = new Date(year, month, 1).getDay();
  const hebrewMonths = getHebrewMonthsBetween(new Date(year, month, 1), new Date(year, month + 1, 0));

  // Month-level summary: shabbatot, holidays, parashiyot
  const monthStats = useMemo(() => {
    const shabbatot = days.filter(d => d.isShabbat).length;
    const holidays = days.filter(d =>
      d.events.some(e => !e.toLowerCase().includes("rosh chodesh") && !e.toLowerCase().includes("parashat"))
    ).length;
    // Parashiyot that fall inside this month
    const firstOfMonth = new Date(year, month, 1);
    const upcoming = getUpcomingParashiyot(firstOfMonth, 6);
    const monthParashiyot = upcoming.filter(p => {
      const shabbat = new Date(p.date);
      return shabbat.getFullYear() === year && shabbat.getMonth() === month;
    });
    return { shabbatot, holidays, parashiyot: monthParashiyot };
  }, [year, month, days]);

  // Pre-compute candle-lighting times for every Friday in the month
  const candleLightingMap = useMemo(() => {
    const map: Record<number, string> = {};
    for (const day of days) {
      if (day.date.getDay() === 5) {
        const z = calculateZmanim(day.date, location.lat, location.lng);
        if (z.candleLighting) map[day.gregorianDay] = formatTime(z.candleLighting, location.tz);
      }
    }
    return map;
  }, [year, month, location]);

  function prevMonth() {
    if (month === 0) { setMonth(11); setYear(y => y - 1); }
    else setMonth(m => m - 1);
    setSelectedDay(null);
  }
  function nextMonth() {
    if (month === 11) { setMonth(0); setYear(y => y + 1); }
    else setMonth(m => m + 1);
    setSelectedDay(null);
  }

  function handleDayClick(gregorianDay: number) {
    if (selectedDay === gregorianDay) {
      onDayClick(gregorianDay, month, year);
    } else {
      setSelectedDay(gregorianDay);
    }
  }

  const selectedDayData = selectedDay !== null ? days.find(d => d.gregorianDay === selectedDay) : null;

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>

      {/* ── App Header ── */}
      <div className="app-header">
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div className="app-icon" style={{ color: "var(--gold)", fontSize: 18 }}>✡</div>
          <div>
            <div style={{ fontSize: 16, fontWeight: 700, color: "var(--text-primary)" }}>Menashe</div>
            <div style={{ fontSize: 9, color: "var(--gold)", letterSpacing: "0.15em", fontWeight: 700 }}>CALENDAR</div>
          </div>
        </div>
        <button
          onClick={onLocationClick}
          style={{
            display: "flex", alignItems: "center", gap: 5,
            background: "var(--elevated)", border: "1px solid var(--border)",
            borderRadius: 99, padding: "5px 12px", cursor: "pointer",
          }}
        >
          <span style={{ fontSize: 11 }}>📍</span>
          <span style={{ fontSize: 11, color: "var(--text-secondary)", fontWeight: 500 }}>{location.name}</span>
        </button>
      </div>

      {/* ── Calendar Card ── */}
      <div style={{ padding: "12px 12px 0", flex: 1, overflowY: "auto" }}>
        <div style={{
          background: "linear-gradient(160deg, #111d34 0%, #0f1a2e 100%)",
          borderRadius: 16,
          border: "1px solid var(--border)",
          overflow: "hidden",
          marginBottom: 12,
        }}>

          {/* Month Title */}
          <div style={{ padding: "14px 16px 10px", textAlign: "center", borderBottom: "1px solid #1a2844" }}>
            <div style={{ fontSize: 17, fontWeight: 800, color: "#fff", letterSpacing: "0.06em" }}>
              {MONTHS[month].toUpperCase()} {year}
            </div>
            <div style={{
              fontSize: 11, color: "var(--gold)", marginTop: 3,
              letterSpacing: "0.04em", fontWeight: 500,
              fontFamily: "'Noto Serif Hebrew', serif",
            }}>
              — {hebrewMonths} —
            </div>
          </div>

          {/* ── Month Summary Strip ── */}
          <div style={{
            display: "grid",
            gridTemplateColumns: "1fr 1px 1fr 1px 1fr",
            borderBottom: "1px solid #1a2844",
            background: "rgba(0,0,0,0.15)",
          }}>
            {/* Shabbatot */}
            <div style={{ padding: "9px 0", textAlign: "center" }}>
              <div style={{ fontSize: 18, fontWeight: 800, color: "#fca5a5", lineHeight: 1 }}>
                {monthStats.shabbatot}
              </div>
              <div style={{ fontSize: 8, color: "#475569", fontWeight: 600, letterSpacing: "0.06em", marginTop: 3, textTransform: "uppercase" }}>
                Shabbatot
              </div>
            </div>

            {/* Divider */}
            <div style={{ background: "#1a2844", margin: "8px 0" }} />

            {/* First parasha */}
            <div style={{ padding: "9px 4px", textAlign: "center" }}>
              {monthStats.parashiyot.length > 0 ? (
                <>
                  <div style={{
                    fontSize: 9, fontWeight: 800, color: "var(--gold)",
                    lineHeight: 1.1, letterSpacing: "0.01em",
                    whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis",
                  }}>
                    {monthStats.parashiyot[0].name}
                  </div>
                  {monthStats.parashiyot.length > 1 && (
                    <div style={{
                      fontSize: 7.5, color: "#d4a843", opacity: 0.7, marginTop: 1,
                      whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis",
                    }}>
                      + {monthStats.parashiyot.slice(1).map(p => p.name).join(", ")}
                    </div>
                  )}
                </>
              ) : (
                <div style={{ fontSize: 9, color: "#475569" }}>—</div>
              )}
              <div style={{ fontSize: 8, color: "#475569", fontWeight: 600, letterSpacing: "0.06em", marginTop: 3, textTransform: "uppercase" }}>
                📖 Parasha
              </div>
            </div>

            {/* Divider */}
            <div style={{ background: "#1a2844", margin: "8px 0" }} />

            {/* Holidays */}
            <div style={{ padding: "9px 0", textAlign: "center" }}>
              <div style={{
                fontSize: 18, fontWeight: 800, lineHeight: 1,
                color: monthStats.holidays > 0 ? "#f87171" : "#334155",
              }}>
                {monthStats.holidays}
              </div>
              <div style={{ fontSize: 8, color: "#475569", fontWeight: 600, letterSpacing: "0.06em", marginTop: 3, textTransform: "uppercase" }}>
                Holidays
              </div>
            </div>
          </div>

          {/* Day Headers */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)" }}>
            {DAY_HEADERS.map((h, idx) => {
              const isSat = idx === 6;
              return (
                <div
                  key={h.en}
                  style={{
                    textAlign: "center",
                    padding: "8px 2px 6px",
                    background: isSat ? "rgba(127, 29, 29, 0.35)" : "transparent",
                    borderBottom: "1px solid #1a2844",
                  }}
                >
                  <div style={{
                    fontSize: 11, fontWeight: 700,
                    color: isSat ? "#fca5a5" : "#e2e8f0",
                    letterSpacing: "0.03em",
                  }}>
                    {h.en}
                  </div>
                  <div style={{
                    fontSize: 8,
                    color: isSat ? "#f87171" : "#475569",
                    fontFamily: "'Noto Serif Hebrew', serif",
                    marginTop: 1,
                    lineHeight: 1,
                  }}>
                    {h.he}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Calendar Grid */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)" }}>
            {/* Empty leading cells */}
            {Array.from({ length: firstDayOfWeek }).map((_, i) => {
              const isSatCol = i === 6;
              return (
                <div
                  key={`empty-${i}`}
                  style={{
                    minHeight: 58,
                    borderRight: i < 6 ? "1px solid #1a2844" : "none",
                    borderBottom: "1px solid #1a2844",
                    background: isSatCol ? "rgba(127,29,29,0.08)" : "transparent",
                  }}
                />
              );
            })}

            {/* Day cells */}
            {days.map((day, i) => {
              const colIndex = (firstDayOfWeek + i) % 7;
              const isSatCol = colIndex === 6;
              const isFriCol = colIndex === 5;
              const isLastInRow = colIndex === 6;
              const isSelected = selectedDay === day.gregorianDay;

              const nonRoshEvents = day.events.filter(e => !e.toLowerCase().includes("rosh chodesh"));
              const eventLabel = nonRoshEvents[0]
                ? nonRoshEvents[0].replace(/^Parashat\s+/, "").split(" ")[0].toUpperCase()
                : null;

              let cellBg = "transparent";
              if (day.isToday) cellBg = "var(--gold)";
              else if (isSelected) cellBg = "rgba(212,168,67,0.14)";
              else if (isSatCol) cellBg = "rgba(127,29,29,0.12)";

              const dayNumColor = day.isToday ? "#0f1a2e" : day.isShabbat ? "#fca5a5" : "#f1f5f9";
              const hebrewColor = day.isToday ? "rgba(15,26,46,0.7)" : "#475569";
              const todayRing = isSelected && !day.isToday
                ? "1px solid rgba(212,168,67,0.4)" : "none";

              return (
                <div
                  key={i}
                  onClick={() => handleDayClick(day.gregorianDay)}
                  style={{
                    minHeight: 58,
                    padding: "4px 3px 3px",
                    borderRight: !isLastInRow ? "1px solid #1a2844" : "none",
                    borderBottom: "1px solid #1a2844",
                    background: cellBg,
                    cursor: "pointer",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    position: "relative",
                    outline: todayRing,
                    transition: "background 0.12s",
                  }}
                >
                  {/* Candle icon + lighting time for Fridays */}
                  {isFriCol && (
                    <div style={{
                      position: "absolute", top: 2, right: 2,
                      display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 1,
                    }}>
                      <span style={{ fontSize: 8, lineHeight: 1, opacity: 0.8 }}>🕯️</span>
                      {candleLightingMap[day.gregorianDay] && (
                        <span style={{
                          fontSize: 6, lineHeight: 1,
                          color: day.isToday ? "rgba(15,26,46,0.65)" : "#d4a843",
                          fontWeight: 700, letterSpacing: "0.01em",
                          whiteSpace: "nowrap",
                        }}>
                          {candleLightingMap[day.gregorianDay]}
                        </span>
                      )}
                    </div>
                  )}

                  {/* Gregorian day number */}
                  <div style={{
                    fontSize: 14, fontWeight: day.isToday ? 800 : 500,
                    color: dayNumColor,
                    lineHeight: 1,
                    marginTop: 2,
                    width: 26, height: 26,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    borderRadius: "50%",
                    background: isSelected && !day.isToday ? "rgba(212,168,67,0.15)" : "transparent",
                  }}>
                    {day.gregorianDay}
                  </div>

                  {/* Hebrew date */}
                  <div style={{
                    fontSize: 8,
                    color: hebrewColor,
                    fontFamily: "'Noto Serif Hebrew', serif",
                    lineHeight: 1,
                    marginTop: 2,
                  }}>
                    {hebrewDayNumeral(day.hebrewDay)}
                  </div>

                  {/* Rosh Chodesh pill */}
                  {day.roshChodesh && (
                    <div style={{
                      fontSize: 6.5, color: "#f87171",
                      background: "rgba(239,68,68,0.15)",
                      padding: "1px 3px", borderRadius: 3,
                      marginTop: 2, fontWeight: 700,
                      letterSpacing: "0.02em", lineHeight: 1.3,
                    }}>
                      R.CH
                    </div>
                  )}

                  {/* Holiday label */}
                  {eventLabel && !day.roshChodesh && (
                    <div style={{
                      fontSize: 6.5, color: "#f87171",
                      background: "rgba(239,68,68,0.12)",
                      padding: "1px 3px", borderRadius: 3,
                      marginTop: "auto", fontWeight: 700,
                      letterSpacing: "0.02em", lineHeight: 1.3,
                      maxWidth: "100%", overflow: "hidden",
                      textOverflow: "ellipsis", whiteSpace: "nowrap",
                    }}>
                      {eventLabel}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Legend + Navigation */}
          <div style={{
            display: "flex", alignItems: "center",
            justifyContent: "space-between",
            padding: "10px 14px",
            borderTop: "1px solid #1a2844",
          }}>
            {/* Legend */}
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              {[
                { color: "#334155", label: "Weekday" },
                { color: "rgba(127,29,29,0.5)", label: "Shabbat", border: "1px solid rgba(239,68,68,0.25)" },
                { color: "var(--gold)", label: "Today" },
              ].map(({ color, label, border }) => (
                <div key={label} style={{ display: "flex", alignItems: "center", gap: 4 }}>
                  <div style={{
                    width: 10, height: 10, borderRadius: 3,
                    background: color, border: border ?? "none",
                    flexShrink: 0,
                  }} />
                  <span style={{ fontSize: 9, color: "#475569", fontWeight: 500 }}>{label}</span>
                </div>
              ))}
            </div>

            {/* Nav arrows */}
            <div style={{ display: "flex", gap: 6 }}>
              <button
                onClick={prevMonth}
                style={{
                  width: 28, height: 28, borderRadius: "50%",
                  background: "rgba(255,255,255,0.06)",
                  border: "1px solid #1a2844",
                  cursor: "pointer", color: "#94a3b8",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 13, lineHeight: 1,
                }}
              >‹</button>
              <button
                onClick={nextMonth}
                style={{
                  width: 28, height: 28, borderRadius: "50%",
                  background: "rgba(255,255,255,0.06)",
                  border: "1px solid #1a2844",
                  cursor: "pointer", color: "#94a3b8",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 13, lineHeight: 1,
                }}
              >›</button>
            </div>
          </div>
        </div>

        {/* ── Selected day detail ── */}
        {selectedDayData && (
          <div
            className="card fade-in"
            style={{ padding: "14px 16px", marginBottom: 8 }}
          >
            <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between" }}>
              <div>
                <div style={{ fontSize: 11, color: "var(--text-muted)", fontWeight: 700, letterSpacing: "0.08em", marginBottom: 3 }}>
                  {selectedDayData.date.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })}
                </div>
                <div style={{
                  fontSize: 15, fontWeight: 700, color: "var(--gold)",
                  fontFamily: "'Noto Serif Hebrew', serif",
                  marginBottom: selectedDayData.events.length ? 8 : 0,
                }}>
                  {hebrewDayNumeral(selectedDayData.hebrewDay)}{" "}{selectedDayData.hebrewMonth}{" "}{selectedDayData.hebrewYear}
                </div>
              </div>
              <button
                onClick={() => onDayClick(selectedDayData.gregorianDay, month, year)}
                style={{
                  padding: "6px 12px",
                  background: "var(--elevated)", border: "1px solid var(--border)",
                  borderRadius: 8, color: "var(--text-secondary)",
                  fontSize: 11, cursor: "pointer", fontWeight: 600,
                  whiteSpace: "nowrap",
                }}
              >
                Details →
              </button>
            </div>
            {/* Candle lighting banner for Fridays */}
            {candleLightingMap[selectedDayData.gregorianDay] && (
              <div style={{
                display: "flex", alignItems: "center", gap: 10,
                background: "rgba(212,168,67,0.08)",
                border: "1px solid rgba(212,168,67,0.22)",
                borderRadius: 10, padding: "9px 13px",
                marginTop: 10,
              }}>
                <span style={{ fontSize: 18 }}>🕯️</span>
                <div>
                  <div style={{ fontSize: 10, color: "var(--text-muted)", fontWeight: 700, letterSpacing: "0.08em" }}>
                    CANDLE LIGHTING
                  </div>
                  <div style={{ fontSize: 20, fontWeight: 800, color: "var(--gold)", lineHeight: 1.1, marginTop: 1 }}>
                    {candleLightingMap[selectedDayData.gregorianDay]}
                  </div>
                  <div style={{ fontSize: 10, color: "var(--text-muted)", marginTop: 2 }}>
                    {location.candleLightingMinutes} min before sunset · {location.name}
                  </div>
                </div>
              </div>
            )}

            {selectedDayData.events.length > 0 && (
              <div style={{ display: "flex", flexDirection: "column", gap: 4, marginTop: candleLightingMap[selectedDayData.gregorianDay] ? 8 : 0 }}>
                {selectedDayData.events.map((ev, i) => (
                  <div key={i} style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <span style={{ fontSize: 12, color: "var(--gold)" }}>✦</span>
                    <span style={{ fontSize: 12, color: "var(--text-secondary)" }}>{ev}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
