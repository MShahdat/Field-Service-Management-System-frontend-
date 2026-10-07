export const maskNid = (_nid?: string | null) => "•••••••••••••";

export const formatAddress = (
  a?: { street?: string; city?: string; postalCode?: string } | null,
) => {
  if (!a) return null;
  return [a.street, a.city, a.postalCode].filter(Boolean).join(", ") || null;
};

export const formatMemberSince = (iso?: string) => {
  if (!iso) return "Oct 7, 2026";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "Oct 7, 2026";
  return d.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
};

export const DAY_NAMES = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

/** Parse "08:00", "08:00:00", ISO date, or "8 AM" into minutes since midnight in Asia/Dhaka */
export const parseTimeToMinutes = (raw?: string | null): number | null => {
  if (!raw || typeof raw !== "string") return null;
  const s = raw.trim();
  if (!s) return null;

  // ISO datetime -> convert to Asia/Dhaka wall time
  if (s.includes("T")) {
    const d = new Date(s);
    if (Number.isNaN(d.getTime())) return null;
    const parts = new Intl.DateTimeFormat("en-US", {
      timeZone: "Asia/Dhaka",
      hour: "numeric",
      minute: "numeric",
      hour12: false,
    })
      .formatToParts(d)
      .reduce<Record<string, string>>((acc, p) => {
        acc[p.type] = p.value;
        return acc;
      }, {});
    const h = Number(parts.hour ?? 0);
    const m = Number(parts.minute ?? 0);
    return h * 60 + m;
  }

  // "08:00" / "08:00:00" / "8:30 PM" / "8 AM"
  const ampm = /([ap])\.?\s?m\.?$/i.exec(s);
  const nums = s.replace(/[^0-9:]/g, "").split(":");
  if (!nums[0]) return null;
  let h = Number(nums[0]);
  const m = Number(nums[1] ?? 0);
  if (Number.isNaN(h) || Number.isNaN(m)) return null;
  if (ampm) {
    const isPM = ampm[1].toLowerCase() === "p";
    if (h === 12) h = isPM ? 12 : 0;
    else if (isPM) h += 12;
  }
  if (h < 0 || h > 23 || m < 0 || m > 59) return null;
  return h * 60 + m;
};

/** 480 -> "8 AM" in Asia/Dhaka style (no timezone shift needed, already wall time) */
export const formatMinutesToDhaka = (mins: number): string => {
  const norm = ((mins % 1440) + 1440) % 1440;
  const h24 = Math.floor(norm / 60);
  const m = norm % 60;
  const suffix = h24 >= 12 ? "PM" : "AM";
  const h12 = h24 % 12 === 0 ? 12 : h24 % 12;
  return m === 0
    ? `${h12} ${suffix}`
    : `${h12}:${String(m).padStart(2, "0")} ${suffix}`;
};

/** "08:00" -> "8 AM", ISO -> Asia/Dhaka "8 AM" */
export const formatTimeDhaka = (raw?: string | null): string => {
  if (!raw) return "-";
  const mins = parseTimeToMinutes(raw);
  if (mins === null) return String(raw);
  return formatMinutesToDhaka(mins);
};

export const formatTimeRangeDhaka = (
  start?: string | null,
  end?: string | null,
): string => {
  if (!start && !end) return "-";
  return `${formatTimeDhaka(start)} - ${formatTimeDhaka(end)}`;
};

/** Bar length: working hours / 12h day, clamped 15–100 */
export const availabilityPct = (
  start?: string | null,
  end?: string | null,
): number => {
  const s = parseTimeToMinutes(start);
  const e = parseTimeToMinutes(end);
  if (s === null || e === null) return 82;
  let dur = e - s;
  if (dur <= 0) dur += 1440;
  return Math.max(15, Math.min(100, Math.round((dur / (12 * 60)) * 100)));
};

export interface NormalizedAvailability {
  key: string;
  dayIndex: number;
  day: string;
  label: string;
  pct: number;
}

const FALLBACK_ORDER = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

/** Normalize raw API availability into sorted, responsive-ready rows */
export const normalizeAvailability = (
  raw: unknown,
): NormalizedAvailability[] => {
  if (!Array.isArray(raw) || raw.length === 0) return [];
  const rows: NormalizedAvailability[] = [];

  for (const item of raw) {
    if (typeof item !== "object" || item === null) continue;
    const a = item as {
      dayOfWeek?: number | string;
      day?: string;
      startTime?: string;
      start?: string;
      endTime?: string;
      end?: string;
      id?: string;
    };
    const start = a.startTime ?? a.start ?? null;
    const end = a.endTime ?? a.end ?? null;

    let dayIndex = -1;
    let day = "";
    if (typeof a.dayOfWeek === "number") {
      dayIndex = a.dayOfWeek;
      day = DAY_NAMES[dayIndex] ?? String(a.dayOfWeek);
    } else if (typeof a.dayOfWeek === "string") {
      const dow: string = a.dayOfWeek;
      const idx = DAY_NAMES.findIndex(
        (d) => d.toLowerCase() === dow.toLowerCase(),
      );
      dayIndex = idx >= 0 ? idx : -1;
      day = idx >= 0 ? DAY_NAMES[idx] : String(a.dayOfWeek);
    } else if (typeof a.day === "string") {
      const idx = DAY_NAMES.findIndex(
        (d) => d.toLowerCase() === (a.day as string).toLowerCase(),
      );
      dayIndex = idx >= 0 ? idx : -1;
      day = idx >= 0 ? DAY_NAMES[idx] : a.day;
    }
    if (!day) continue;

    rows.push({
      key: String(a.id ?? `${day}-${start}-${end}`),
      dayIndex,
      day,
      label: formatTimeRangeDhaka(start, end),
      pct: availabilityPct(start, end),
    });
  }

  // Monday-first sort, unknown days last
  const order = (i: number) => (i <= 0 ? i + 7 : i);
  rows.sort((x, y) => {
    if (x.dayIndex >= 0 && y.dayIndex >= 0)
      return order(x.dayIndex) - order(y.dayIndex);
    if (x.dayIndex >= 0) return -1;
    if (y.dayIndex >= 0) return 1;
    return FALLBACK_ORDER.indexOf(x.day) - FALLBACK_ORDER.indexOf(y.day);
  });
  return rows;
};
