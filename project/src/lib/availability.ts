import type { Booking, Decision, RejectionCode, Room } from './types';

export const MINUTES_PER_DAY = 1440;
export const MAX_DURATION_MIN = 120;

/** Convert "HH:MM" to minutes since midnight. Returns null on bad input. */
export function timeStringToMinutes(value: string): number | null {
  const match = /^(\d{2}):(\d{2})$/.exec(value.trim());
  if (!match) return null;
  const h = Number(match[1]);
  const m = Number(match[2]);
  if (h === 24 && m === 0) return MINUTES_PER_DAY;
  if (h < 0 || h > 23 || m < 0 || m > 59) return null;
  return h * 60 + m;
}

/** Convert minutes since midnight to "HH:MM". */
export function minutesToTimeString(min: number): string {
  const h = Math.floor(min / 60);
  const m = min % 60;
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
}

/** Two intervals overlap when each starts strictly before the other ends. */
export function intervalsOverlap(a: Booking, start: number, end: number): boolean {
  return start < a.end && a.start < end;
}

/**
 * Evaluate a candidate booking against all acceptance criteria.
 * Pure function: never mutates room or bookings.
 */
export function checkAvailability(
  room: Room,
  start: number,
  end: number,
  currentTime: number,
): Decision {
  const rejections: { code: RejectionCode; message: string }[] = [];

  // AC1: valid interval and start after current time
  if (start < 0 || end > MINUTES_PER_DAY || start >= end) {
    rejections.push({
      code: 'invalid_interval',
      message: 'The start time must be earlier than the end time, and both must be within 00:00–24:00.',
    });
  }
  if (start <= currentTime) {
    rejections.push({
      code: 'start_not_after_now',
      message: 'The start time must be after the current time.',
    });
  }

  // AC2: max duration
  if (end - start > MAX_DURATION_MIN) {
    rejections.push({
      code: 'duration_too_long',
      message: `Bookings cannot be longer than ${MAX_DURATION_MIN} minutes.`,
    });
  }

  // AC3: room blocked
  if (room.blocked) {
    rejections.push({
      code: 'room_blocked',
      message: 'This room is currently blocked and cannot be booked.',
    });
  }

  // AC4: no overlap (touching endpoints allowed)
  const overlapping = room.bookings.filter((b) => intervalsOverlap(b, start, end));
  if (overlapping.length > 0) {
    const detail = overlapping
      .map((b) => `${minutesToTimeString(b.start)}–${minutesToTimeString(b.end)} (${b.title})`)
      .join(', ');
    rejections.push({
      code: 'overlaps_booking',
      message: `The requested time overlaps an existing booking: ${detail}.`,
    });
  }

  return rejections.length === 0
    ? { available: true }
    : {
        available: false,
        reasons: rejections.map((r) => r.message),
        reasonCodes: rejections.map((r) => r.code),
      };
}
