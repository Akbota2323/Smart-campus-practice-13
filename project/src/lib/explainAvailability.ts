// src/lib/explainAvailability.ts — "Explain availability" feature (Practice #11)
// The deterministic checker (checkAvailability) decides. This module only EXPLAINS its Decision.
import type { Decision, RejectionCode } from './types';
import { minutesToTimeString, MAX_DURATION_MIN } from './availability';

export interface ExplainInput {
  roomName: string;
  start: number; // minutes since midnight, same as checkAvailability
  end: number;
  available: boolean;
  reasonCodes: RejectionCode[]; // empty when available
}

export interface ExplainResult {
  explanation: string;
  source: 'mock' | 'llm' | 'fallback'; // shown in the UI (labelled AI text, not a booking confirmation)
}

const CODES: RejectionCode[] = [
  'invalid_interval',
  'start_not_after_now',
  'duration_too_long',
  'room_blocked',
  'overlaps_booking',
];
const MAX_NAME = 60;
const MAX_EXPLANATION = 300;
const TIMEOUT_MS = 4000;

/** Build the input from the checker's Decision. Booking titles are NOT passed on (minimal context). */
export function buildExplainInput(roomName: string, start: number, end: number, d: Decision): ExplainInput {
  return {
    roomName,
    start,
    end,
    available: d.available,
    reasonCodes: d.available ? [] : [...d.reasonCodes],
  };
}

// EX-AC3: reject empty / malformed / too long input
export function validateInput(i: unknown): { ok: true; value: ExplainInput } | { ok: false; error: string } {
  if (!i || typeof i !== 'object') return { ok: false, error: 'Input is empty' };
  const x = i as Record<string, unknown>;
  if (typeof x.roomName !== 'string' || !x.roomName.trim() || x.roomName.length > MAX_NAME)
    return { ok: false, error: 'Invalid room name' };
  if (!Number.isInteger(x.start) || !Number.isInteger(x.end)) return { ok: false, error: 'Invalid time' };
  if (typeof x.available !== 'boolean') return { ok: false, error: 'available must be boolean' };
  if (!Array.isArray(x.reasonCodes) || x.reasonCodes.length > CODES.length || !x.reasonCodes.every((c) => CODES.includes(c as RejectionCode)))
    return { ok: false, error: 'Unknown reason code' };
  // status and reasons must agree
  if (x.available !== (x.reasonCodes.length === 0)) return { ok: false, error: 'Status and reason codes disagree' };
  return { ok: true, value: x as unknown as ExplainInput };
}

const FALLBACK_TEXT: Record<RejectionCode, string> = {
  invalid_interval: 'the start must be earlier than the end, within one day',
  start_not_after_now: 'the start time must be after the current time',
  duration_too_long: `bookings cannot be longer than ${MAX_DURATION_MIN} minutes`,
  room_blocked: 'the room is blocked',
  overlaps_booking: 'it overlaps an existing booking',
};

/** Deterministic text, also the safe fallback (EX-AC4). */
export function templateExplanation(i: ExplainInput): string {
  const t = `${minutesToTimeString(i.start)}–${minutesToTimeString(i.end)}`;
  if (i.available) return `${i.roomName} is free for ${t}, so this time is valid.`;
  const why = i.reasonCodes.map((c) => FALLBACK_TEXT[c]).join('; ');
  return `${i.roomName} is not available for ${t}: ${why}.`;
}

/** Mock adapter: no API key needed, clearly labelled "mock". */
export async function mockAdapter(i: ExplainInput): Promise<string> {
  return templateExplanation(i);
}

/** Output validation: the model text is untrusted (EX-AC2). */
/** Output validation: the model text is untrusted (EX-AC2). */
export function validateOutput(text: unknown, i: ExplainInput): string | null {
  if (typeof text !== 'string') return null;
  const t = text.trim();
  if (!t || t.length > MAX_EXPLANATION) return null;
  if ((t.match(/[.!?](\s|$)/g) ?? []).length > 2) return null; // max 2 sentences
  if (/<[^>]+>/.test(t)) return null; // no HTML
  const lower = t.toLowerCase().replace(/[\u2018\u2019]/g, "'");
  if (i.available && /(not available|n't available|unavailable|not be booked|n't be booked|is booked|is blocked|not free|n't free)/.test(lower)) return null;
  if (!i.available && /\b(is free|is available|is open|can be booked|you can book|you may book|may be booked)\b/.test(lower)) return null;
  return t;
}

export type Adapter = (i: ExplainInput) => Promise<string>;

function withTimeout<T>(p: Promise<T>, ms: number): Promise<T> {
  return new Promise((resolve, reject) => {
    const id = setTimeout(() => reject(new Error('timeout')), ms);
    p.then(
      (v) => { clearTimeout(id); resolve(v); },
      (e) => { clearTimeout(id); reject(e); },
    );
  });
}

/** Main entry. Never throws, never changes availability or bookings. */
export async function explainAvailability(
  raw: unknown,
  adapter: Adapter = mockAdapter,
  isMock = true,
  timeoutMs = TIMEOUT_MS,
): Promise<ExplainResult | { error: string }> {
  const v = validateInput(raw);
  if (!v.ok) return { error: v.error };
  try {
    const out = validateOutput(await withTimeout(adapter(v.value), timeoutMs), v.value);
    if (out) return { explanation: out, source: isMock ? 'mock' : 'llm' };
  } catch {
    /* fall through to the fallback */
  }
  return { explanation: templateExplanation(v.value), source: 'fallback' };
}