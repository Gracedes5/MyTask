export type ParsedTask = {
  title: string;
  time: string;
};

const TIME_PATTERN =
  /\b(?:at|by|before|around)\s+(\d{1,2})(?::(\d{2}))?\s*(a\.?m\.?|p\.?m\.?|am|pm)?\b/i;

const PREFIXES =
  /\b(?:i\s+(?:need|have|want|gotta|got to|would like)\s+to|i'?m\s+(?:going to|gonna))\s+/gi;

function normalizeTime(h: number, m: number, meridiem: string | undefined): string {
  const mm = m !== undefined && !isNaN(m) ? String(m).padStart(2, "0") : "00";

  if (meridiem) {
    const isPM = /p/i.test(meridiem);
    const hh = String(h).padStart(2, "0");
    return `${hh}:${mm} ${isPM ? "PM" : "AM"}`;
  }

  if (h >= 12) {
    const hour12 = h > 12 ? h - 12 : 12;
    return `${String(hour12).padStart(2, "0")}:${mm} PM`;
  }
  return `${String(h === 0 ? 12 : h).padStart(2, "0")}:${mm} AM`;
}

function extractTaskSingle(segment: string): ParsedTask | null {
  const trimmed = segment.trim();
  if (!trimmed) return null;

  const match = trimmed.match(TIME_PATTERN);

  if (match) {
    const h = parseInt(match[1], 10);
    const m = match[2] !== undefined ? parseInt(match[2], 10) : 0;
    const meridiem = match[3];
    const time = normalizeTime(h, m, meridiem);

    const title = trimmed
      .replace(match[0], "")
      .replace(/\b(?:to|and|then)\s*$/i, "")
      .replace(/^(?:to|and|then)\s*/i, "")
      .trim()
      .replace(/^[-\s,]+/, "")
      .replace(/[-\s,]+$/, "")
      .replace(/\s+/g, " ")
      .trim();

    if (title) return { title, time };
    return null;
  }

  const noTimeTitle = trimmed
    .replace(/^(?:to|and|then)\s*/i, "")
    .replace(/\b(?:to|and|then)\s*$/i, "")
    .trim()
    .replace(/^[-\s,]+/, "")
    .replace(/[-\s,]+$/, "")
    .replace(/\s+/g, " ")
    .trim();

  if (noTimeTitle) return { title: noTimeTitle, time: "" };
  return null;
}

export function parseVoiceTasks(text: string): ParsedTask[] {
  if (!text || !text.trim()) return [];

  const cleaned = text
    .replace(PREFIXES, "")
    .replace(/\bplease\b/gi, "")
    .trim();

  const segments = cleaned
    .split(/\s+(?:and|then|also)\s+|\.(?:\s|$)|,(?:\s|$)/i)
    .map((s) => s.trim())
    .filter(Boolean);

  const tasks: ParsedTask[] = [];
  for (const seg of segments) {
    const parsed = extractTaskSingle(seg);
    if (parsed && parsed.title) tasks.push(parsed);
  }

  return tasks;
}
