import { describe, it, expect } from 'vitest';
import { checkAvailability } from './availability';
import { sampleRooms } from './sampleData';
import type { Booking, Room } from './types';

const DEFAULT_NOW = 540;
const DEFAULT_BOOKINGS: Booking[] = [
  { id: 'b1', start: 600, end: 660, title: 'Sample', bookedBy: 'Test' },
];

function makeRoom(opts?: { blocked?: boolean; bookings?: Booking[] }): Room {
  return {
    id: 'room-test',
    name: 'Test Room',
    building: 'Test Block',
    capacity: 30,
    equipment: [],
    blocked: opts?.blocked ?? false,
    bookings: (opts?.bookings ?? DEFAULT_BOOKINGS).map((b) => ({ ...b })),
  };
}

function canBook(args: {
  start: number;
  end: number;
  now?: number;
  blocked?: boolean;
  bookings?: Booking[];
}): boolean {
  const room = makeRoom({ blocked: args.blocked, bookings: args.bookings });
  const now = args.now ?? DEFAULT_NOW;
  return checkAvailability(room, args.start, args.end, now).available;
}
function reasonsOf(args: {
  start: number;
  end: number;
  now?: number;
  blocked?: boolean;
  bookings?: Booking[];
}): string[] {
  const room = makeRoom({ blocked: args.blocked, bookings: args.bookings });
  const decision = checkAvailability(room, args.start, args.end, args.now ?? DEFAULT_NOW);
  return decision.available ? [] : decision.reasons;
}

describe('checkAvailability — AC table', () => {
  it('T01 AC4: touching after is available', () => {
    expect(canBook({ start: 660, end: 720 })).toBe(true);
  });

  it('T02 AC1: starts now is rejected', () => {
    expect(canBook({ start: 540, end: 570 })).toBe(false);
  });

  it('T03 AC1: zero duration is rejected', () => {
    expect(canBook({ start: 720, end: 720 })).toBe(false);
  });

  it('T04 AC1: reversed interval is rejected', () => {
    expect(canBook({ start: 750, end: 720 })).toBe(false);
  });

  it('T05 AC1: past day end is rejected', () => {
    expect(canBook({ start: 1380, end: 1441 })).toBe(false);
  });

  it('T06 AC2: exactly 120 minutes is available', () => {
    expect(canBook({ start: 720, end: 840 })).toBe(true);
  });

  it('T07 AC2: 121 minutes is rejected', () => {
    expect(canBook({ start: 720, end: 841 })).toBe(false);
  });

  it('T08 AC4: touching before is available', () => {
    expect(canBook({ start: 570, end: 600 })).toBe(true);
  });

  it('T09 AC4: partial overlap is rejected', () => {
    expect(canBook({ start: 630, end: 690 })).toBe(false);
  });

  it('T10 AC4: contains booking is rejected', () => {
    expect(canBook({ start: 570, end: 690 })).toBe(false);
  });

  it('T11 AC4: inside booking is rejected', () => {
    expect(canBook({ start: 615, end: 645 })).toBe(false);
  });

  it('T12 AC4: identical interval is rejected', () => {
    expect(canBook({ start: 600, end: 660 })).toBe(false);
  });

  it('T13 AC3: blocked room is rejected', () => {
    expect(canBook({ start: 660, end: 720, blocked: true })).toBe(false);
  });

  it('T14 AC4: no bookings allows booking', () => {
    expect(canBook({ start: 630, end: 690, bookings: [] })).toBe(true);
  });

  it('T15 AC1: one minute after now is available', () => {
    expect(canBook({ start: 541, end: 600 })).toBe(true);
  });

  it('T16 AC1: ends exactly at end of day is available', () => {
    expect(canBook({ start: 1380, end: 1440 })).toBe(true);
  });

  
    it('T17 AC5: rejected and accepted calls do not change bookings', () => {
    const room = makeRoom();
    const before = JSON.stringify(room.bookings);
    expect(checkAvailability(room, 630, 690, DEFAULT_NOW).available).toBe(false);
    expect(checkAvailability(room, 660, 720, DEFAULT_NOW).available).toBe(true);
    expect(JSON.stringify(room.bookings)).toBe(before);
  });

  it('T18 AC4: overlap with the second booking is rejected', () => {
    const two: Booking[] = [
      { id: 'b1', start: 600, end: 660, title: 'A', bookedBy: 'Test' },
      { id: 'b2', start: 800, end: 900, title: 'B', bookedBy: 'Test' },
    ];
    expect(canBook({ start: 850, end: 880, bookings: two })).toBe(false);
  });

  it('T19 AC4: gap between two bookings is available', () => {
    const two: Booking[] = [
      { id: 'b1', start: 600, end: 660, title: 'A', bookedBy: 'Test' },
      { id: 'b2', start: 800, end: 900, title: 'B', bookedBy: 'Test' },
    ];
    expect(canBook({ start: 680, end: 780, bookings: two })).toBe(true);
  });

  it('T20 AC1: start equal to now gives only the current-time reason', () => {
    const reasons = reasonsOf({ start: 540, end: 570 });
    expect(reasons).toHaveLength(1);
    expect(reasons[0]).toMatch(/after the current time/);
  });

  it('T21 AC1: reversed interval gives only the range reason', () => {
    const reasons = reasonsOf({ start: 750, end: 720 });
    expect(reasons).toHaveLength(1);
    expect(reasons[0]).toMatch(/earlier than the end time/);
  });

  it('T22 AC2: 121 minutes gives only the duration reason', () => {
    const reasons = reasonsOf({ start: 720, end: 841 });
    expect(reasons).toHaveLength(1);
    expect(reasons[0]).toMatch(/longer than 120/);
  });

  it('T23 AC3: blocked room gives only the blocked reason', () => {
    const reasons = reasonsOf({ start: 660, end: 720, blocked: true });
    expect(reasons).toHaveLength(1);
    expect(reasons[0]).toMatch(/blocked/);
  });

  it('T24 AC4: partial overlap gives only the overlap reason', () => {
    const reasons = reasonsOf({ start: 630, end: 690 });
    expect(reasons).toHaveLength(1);
    expect(reasons[0]).toMatch(/overlaps/);
  });
});

function sampleRoom(id: string): Room {
  const room = sampleRooms.find((r) => r.id === id);
  if (!room) throw new Error(`missing fixture ${id}`);
  return room;
}

function codesOf(room: Room, start: number, end: number, now = DEFAULT_NOW): string[] {
  const decision = checkAvailability(room, start, end, now);
  return decision.available ? [] : decision.reasonCodes;
}

describe('regression — acceptance criteria and reason codes', () => {
  it('R01 AC1: past start time is rejected with start_not_after_now', () => {
    expect(codesOf(sampleRoom('room-101'), 500, 530)).toEqual(['start_not_after_now']);
  });

  it('R02 AC1: reversed interval is rejected with invalid_interval', () => {
    expect(codesOf(sampleRoom('room-104'), 750, 720)).toEqual(['invalid_interval']);
  });

  it('R03 AC2: 121 minutes is rejected with duration_too_long', () => {
    expect(codesOf(sampleRoom('room-104'), 720, 841)).toEqual(['duration_too_long']);
  });

  it('R04 AC2: exactly 120 minutes is available with no reason codes', () => {
    const decision = checkAvailability(sampleRoom('room-104'), 720, 840, DEFAULT_NOW);
    expect(decision).toEqual({ available: true });
  });

  it('R05 AC3: blocked room is rejected with room_blocked', () => {
    expect(codesOf(sampleRoom('room-103'), 660, 720)).toEqual(['room_blocked']);
  });

  it('R06 AC4: overlap with an existing booking is rejected with overlaps_booking', () => {
    expect(codesOf(sampleRoom('room-101'), 800, 860)).toEqual(['overlaps_booking']);
  });

  it('R07 AC4: bookings touching existing endpoints are available', () => {
    expect(checkAvailability(sampleRoom('room-101'), 600, 720, DEFAULT_NOW)).toEqual({
      available: true,
    });
    expect(checkAvailability(sampleRoom('room-101'), 720, 780, DEFAULT_NOW)).toEqual({
      available: true,
    });
    expect(checkAvailability(sampleRoom('room-101'), 840, 900, DEFAULT_NOW)).toEqual({
      available: true,
    });
  });

  it('R08 AC5: sample fixtures are unchanged after accepted and rejected checks', () => {
    const before = JSON.stringify(sampleRooms);
    for (const room of sampleRooms) {
      checkAvailability(room, 500, 700, DEFAULT_NOW);
      checkAvailability(room, 600, 780, DEFAULT_NOW);
      checkAvailability(room, 800, 860, DEFAULT_NOW);
    }
    expect(JSON.stringify(sampleRooms)).toBe(before);
  });

  it('R09 reason codes and messages stay aligned, in rule order', () => {
    const decision = checkAvailability(sampleRoom('room-103'), 500, 700, DEFAULT_NOW);
    expect(decision.available).toBe(false);
    if (decision.available) return;
    expect(decision.reasonCodes).toEqual([
      'start_not_after_now',
      'duration_too_long',
      'room_blocked',
      'overlaps_booking',
    ]);
    expect(decision.reasons).toHaveLength(decision.reasonCodes.length);
  });
});
