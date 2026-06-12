import { useState, useEffect, useRef, useCallback } from "react";
import { HebrewCalendar, flags } from "@hebcal/core";
import { calculateZmanim } from "../lib/zmanim";
import { Location } from "../lib/locations";
import { getUpcomingParashiyot } from "../lib/parasha";

export type NotificationPrefs = {
  shabbat: boolean;
  havdalah: boolean;
  holiday: boolean;
  omer: boolean;
  prayers: boolean;
  parasha: boolean;
  shema: boolean;
};

export type LeadTime = 5 | 10 | 15 | 30;
export const LEAD_TIME_OPTIONS: LeadTime[] = [5, 10, 15, 30];

const PREFS_KEY = "menashe-notif-prefs";
const LEAD_KEY = "menashe-remind-lead";
const REMIND_MINUTES_BEFORE_CANDLES = 18;
const HOLIDAY_REMIND_HOUR = 8;
const HOLIDAY_LOOKAHEAD_DAYS = 30;
const OMER_LOOKAHEAD_DAYS = 50;

const OMER_SEFIROT = [
  "Chesed (Lovingkindness)",
  "Gevurah (Strength)",
  "Tiferet (Beauty)",
  "Netzach (Eternity)",
  "Hod (Splendor)",
  "Yesod (Foundation)",
  "Malchut (Sovereignty)",
];

function getOmerDayForDate(date: Date): number | null {
  const events = HebrewCalendar.calendar({
    start: date,
    end: date,
    il: true,
    isHebrewYear: false,
    mask: flags.OMER_COUNT,
  });
  if (events.length === 0) return null;
  const ev = events[0] as any;
  return typeof ev.getOmer === "function" ? ev.getOmer() : null;
}

function getOmerSefirahLabel(day: number): string {
  const weekIdx = ((Math.ceil(day / 7)) - 1) % 7;
  const dayIdx = ((day - 1) % 7);
  return `${OMER_SEFIROT[dayIdx]} within ${OMER_SEFIROT[weekIdx].split(" ")[0]}`;
}

function getNextWeekday(targetDay: number, from: Date = new Date()): Date {
  const d = new Date(from);
  const current = d.getDay();
  let diff = (targetDay - current + 7) % 7;
  if (diff === 0) diff = 7;
  d.setDate(d.getDate() + diff);
  d.setHours(0, 0, 0, 0);
  return d;
}

export function isNotifSupported(): boolean {
  return typeof Notification !== "undefined" && typeof window !== "undefined";
}

function getPermission(): NotificationPermission {
  return isNotifSupported() ? Notification.permission : "denied";
}

export function sendNotification(title: string, body: string, tag: string) {
  if (!isNotifSupported() || Notification.permission !== "granted") return;
  try {
    new Notification(title, {
      body,
      tag,
      icon: "/favicon.ico",
      badge: "/favicon.ico",
    });
  } catch {}
}

function getUpcomingHolidays(): Array<{ name: string; date: Date }> {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const end = new Date(today);
  end.setDate(end.getDate() + HOLIDAY_LOOKAHEAD_DAYS);

  const events = HebrewCalendar.calendar({
    start: today,
    end,
    il: true,
    isHebrewYear: false,
    mask: flags.CHAG | flags.MODERN_HOLIDAY,
  });

  const seen = new Set<string>();
  const results: Array<{ name: string; date: Date }> = [];

  for (const ev of events) {
    const date = ev.getDate().greg();
    date.setHours(0, 0, 0, 0);
    const key = ev.render("en");
    if (!seen.has(key)) {
      seen.add(key);
      results.push({ name: ev.render("en"), date });
    }
  }

  return results;
}

export function getLeadTime(): LeadTime {
  try {
    const raw = localStorage.getItem(LEAD_KEY);
    const n = Number(raw);
    if (LEAD_TIME_OPTIONS.includes(n as LeadTime)) return n as LeadTime;
  } catch {}
  return 15;
}

export function saveLeadTime(mins: LeadTime) {
  try { localStorage.setItem(LEAD_KEY, String(mins)); } catch {}
}

export function useNotifications(location: Location) {
  const [permission, setPermission] = useState<NotificationPermission>(getPermission);
  const [leadTime, setLeadTimeState] = useState<LeadTime>(getLeadTime);
  const [prefs, setPrefs] = useState<NotificationPrefs>(() => {
    try {
      const raw = localStorage.getItem(PREFS_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as NotificationPrefs;
        return { shema: false, ...parsed };
      }
    } catch {}
    return { shabbat: false, havdalah: false, holiday: false, omer: false, prayers: false, parasha: false, shema: false };
  });

  const timersRef = useRef<ReturnType<typeof setTimeout>[]>([]);

  const clearTimers = useCallback(() => {
    timersRef.current.forEach(clearTimeout);
    timersRef.current = [];
  }, []);

  const scheduleFor = useCallback((atTime: Date, fn: () => void) => {
    const ms = atTime.getTime() - Date.now();
    if (ms <= 0) return;
    timersRef.current.push(setTimeout(fn, ms));
  }, []);

  const scheduleAll = useCallback(
    (p: NotificationPrefs, loc: Location, lead: LeadTime) => {
      clearTimers();
      if (!isNotifSupported() || Notification.permission !== "granted") return;

      if (p.shabbat) {
        const friday = getNextWeekday(5);
        const zmanim = calculateZmanim(friday, loc.lat, loc.lng, loc.candleLightingMinutes);
        if (zmanim.candleLighting) {
          const remindAt = new Date(zmanim.candleLighting.getTime() - REMIND_MINUTES_BEFORE_CANDLES * 60 * 1000);
          const candleStr = zmanim.candleLighting.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
          scheduleFor(remindAt, () =>
            sendNotification(
              "🕯️ Shabbat Candle Lighting",
              `Light candles in ${REMIND_MINUTES_BEFORE_CANDLES} minutes at ${candleStr}. Shabbat Shalom!`,
              "candle-lighting"
            )
          );
        }
      }

      if (p.havdalah) {
        const saturday = getNextWeekday(6);
        const zmanim = calculateZmanim(saturday, loc.lat, loc.lng);
        if (zmanim.havdalah) {
          const havdalahStr = zmanim.havdalah.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
          scheduleFor(zmanim.havdalah, () =>
            sendNotification(
              "✨ Havdalah Time",
              `Shabbat has ended at ${havdalahStr}. Shavua Tov — have a wonderful week!`,
              "havdalah"
            )
          );
        }
      }

      if (p.holiday) {
        const holidays = getUpcomingHolidays();
        for (const { name, date } of holidays) {
          const dayBefore = new Date(date);
          dayBefore.setDate(dayBefore.getDate() - 1);
          dayBefore.setHours(HOLIDAY_REMIND_HOUR, 0, 0, 0);
          const dateStr = date.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" });
          const tag = `holiday-${name.toLowerCase().replace(/\s+/g, "-")}`;
          scheduleFor(dayBefore, () =>
            sendNotification(
              `✡ ${name} Begins Tomorrow`,
              `${name} starts tomorrow, ${dateStr}. Chag Sameach to the Bnei Menashe community!`,
              tag
            )
          );
        }
      }

      if (p.prayers || p.shema) {
        const prayerDate = new Date();
        prayerDate.setHours(0, 0, 0, 0);
        for (let i = 0; i <= 7; i++) {
          const d = new Date(prayerDate);
          d.setDate(d.getDate() + i);
          const pz = calculateZmanim(d, loc.lat, loc.lng);
          const dateStr = d.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" });

          if (p.shema && pz.latestShema) {
            const remindAt = new Date(pz.latestShema.getTime() - lead * 60 * 1000);
            const shemaStr = pz.latestShema.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
            scheduleFor(remindAt, () =>
              sendNotification(
                `📖 Latest Shema in ${lead} min`,
                `The deadline to recite Shema is at ${shemaStr} today (${dateStr}). Don't miss it!`,
                `shema-${i}`
              )
            );
          }

          if (p.prayers) {
            if (pz.sunrise) {
              const remindAt = new Date(pz.sunrise.getTime() - lead * 60 * 1000);
              const str = pz.sunrise.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
              scheduleFor(remindAt, () =>
                sendNotification(
                  `🌅 Shacharit in ${lead} min`,
                  `Morning prayer begins at ${str} in ${loc.name}. ${dateStr}.`,
                  `shacharit-${i}`
                )
              );
            }
            if (pz.minchaKetana) {
              const remindAt = new Date(pz.minchaKetana.getTime() - lead * 60 * 1000);
              const str = pz.minchaKetana.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
              scheduleFor(remindAt, () =>
                sendNotification(
                  `🌤 Mincha in ${lead} min`,
                  `Ideal Mincha time at ${str} in ${loc.name}. ${dateStr}.`,
                  `mincha-${i}`
                )
              );
            }
            if (pz.tzais) {
              const remindAt = new Date(pz.tzais.getTime() - lead * 60 * 1000);
              const str = pz.tzais.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
              scheduleFor(remindAt, () =>
                sendNotification(
                  `🌙 Maariv in ${lead} min`,
                  `Nightfall and Maariv at ${str} in ${loc.name}. ${dateStr}.`,
                  `maariv-${i}`
                )
              );
            }
          }
        }
      }

      if (p.parasha) {
        const upcoming = getUpcomingParashiyot(new Date(), 8);
        for (const { name, date, hebrewName } of upcoming) {
          const friday = new Date(date);
          friday.setDate(friday.getDate() - 1);
          friday.setHours(8, 0, 0, 0);
          const tag = `parasha-${name.toLowerCase().replace(/\s+/g, "-")}`;
          const hebrewPart = hebrewName ? ` (${hebrewName})` : "";
          scheduleFor(friday, () =>
            sendNotification(
              `📖 Parashat ${name}${hebrewPart}`,
              `This Shabbat's Torah portion is Parashat ${name}. Shabbat Shalom to the Bnei Menashe community!`,
              tag
            )
          );
        }
      }

      if (p.omer) {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        for (let i = 0; i <= OMER_LOOKAHEAD_DAYS; i++) {
          const checkDate = new Date(today);
          checkDate.setDate(checkDate.getDate() + i);
          const omerDay = getOmerDayForDate(checkDate);
          if (omerDay === null) continue;
          const zmanim = calculateZmanim(checkDate, loc.lat, loc.lng);
          const nightfall = zmanim.tzais ?? zmanim.havdalah;
          if (!nightfall) continue;
          const fireAt = new Date(nightfall);
          const sefirahLabel = getOmerSefirahLabel(omerDay);
          const tag = `omer-day-${omerDay}`;
          scheduleFor(fireAt, () =>
            sendNotification(
              `🌾 Count the Omer — Day ${omerDay}`,
              `Tonight is day ${omerDay} of 49. ${sefirahLabel}. Time to count!`,
              tag
            )
          );
        }
      }
    },
    [clearTimers, scheduleFor]
  );

  useEffect(() => {
    scheduleAll(prefs, location, leadTime);
    return clearTimers;
  }, [prefs, location, leadTime, scheduleAll, clearTimers]);

  const requestPermission = useCallback(async (): Promise<NotificationPermission> => {
    if (!isNotifSupported()) return "denied";
    const result = await Notification.requestPermission();
    setPermission(result);
    return result;
  }, []);

  const updatePref = useCallback(
    async (key: keyof NotificationPrefs, value: boolean): Promise<boolean> => {
      if (value) {
        const current = getPermission();
        if (current === "denied") return false;
        if (current !== "granted") {
          const result = await Notification.requestPermission();
          setPermission(result);
          if (result !== "granted") return false;
        }
        setPermission("granted");
      }
      const next: NotificationPrefs = { ...prefs, [key]: value };
      setPrefs(next);
      try { localStorage.setItem(PREFS_KEY, JSON.stringify(next)); } catch {}
      return true;
    },
    [prefs]
  );

  const updateLeadTime = useCallback((mins: LeadTime) => {
    setLeadTimeState(mins);
    saveLeadTime(mins);
  }, []);

  return { permission, prefs, leadTime, updatePref, updateLeadTime, requestPermission };
}
