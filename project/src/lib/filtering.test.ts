import { describe, it, expect } from 'vitest';
import { filterRooms, listEquipment } from './filtering';
import { checkAvailability } from './availability';
import { sampleRooms } from './sampleData';

const ids = (rooms: { id: string }[]) => rooms.map((r) => r.id);
const NOW = 480; // 08:00

describe('room filtering and selection (F1-F5)', () => {
  it('F1: exact capacity is accepted', () => {
    expect(ids(filterRooms(sampleRooms, { attendees: 120, equipment: [] }))).toEqual(['room-102']);
  });
  it('F1: insufficient capacity is rejected', () => {
    expect(filterRooms(sampleRooms, { attendees: 121, equipment: [] })).toEqual([]);
  });
  it('F1: smaller requests keep larger rooms', () => {
    expect(ids(filterRooms(sampleRooms, { attendees: 25, equipment: [] }))).toEqual(['room-101', 'room-102', 'room-103']);
  });
  it('F2: room must contain ALL selected equipment', () => {
    const result = filterRooms(sampleRooms, { attendees: 0, equipment: ['projector', 'whiteboard'] });
    expect(ids(result)).toEqual(['room-101', 'room-104']);
  });
  it('F2: combination that no room has returns nothing', () => {
    expect(filterRooms(sampleRooms, { attendees: 0, equipment: ['microphone', 'computers'] })).toEqual([]);
  });
  it('F2: no selected equipment does not filter by equipment', () => {
    expect(filterRooms(sampleRooms, { attendees: 0, equipment: [] })).toHaveLength(sampleRooms.length);
  });
  it('F3: blocked room is never reported as available', () => {
    const blocked = sampleRooms.find((r) => r.blocked)!;
    const result = checkAvailability(blocked, 600, 660, NOW);
    expect(result.available).toBe(false);
    if (!result.available) expect(result.reasonCodes).toContain('room_blocked');
  });
  it('F4: impossible filter gives an empty list', () => {
    expect(filterRooms(sampleRooms, { attendees: 500, equipment: ['projector'] })).toHaveLength(0);
  });
  it('F5: availability uses the chosen room bookings only', () => {
    const room101 = sampleRooms.find((r) => r.id === 'room-101')!;
    const room102 = sampleRooms.find((r) => r.id === 'room-102')!;
    // 09:00-10:00: overlaps Circuits Workshop in room-101, free in room-102
    expect(checkAvailability(room101, 540, 600, NOW).available).toBe(false);
    expect(checkAvailability(room102, 540, 600, NOW).available).toBe(true);
  });
  it('filterRooms and listEquipment do not mutate fixtures', () => {
    const before = JSON.stringify(sampleRooms);
    filterRooms(sampleRooms, { attendees: 10, equipment: ['projector'] });
    listEquipment(sampleRooms);
    expect(JSON.stringify(sampleRooms)).toBe(before);
    expect(listEquipment(sampleRooms)).toEqual(['computers', 'microphone', 'projector', 'whiteboard']);
  });
});
