import type { Room } from './types';

export interface RoomFilter {
  attendees: number; // 0 or NaN means no capacity requirement
  equipment: string[]; // room must contain ALL of these
}

/** F1 + F2. Pure: returns a new array, never mutates input. */
export function filterRooms(rooms: readonly Room[], filter: RoomFilter): Room[] {
  const attendees = Number.isFinite(filter.attendees) ? filter.attendees : 0;
  return rooms.filter(
    (room) =>
      room.capacity >= attendees &&
      filter.equipment.every((item) => room.equipment.includes(item)),
  );
}

/** Sorted unique equipment names, used to build filter checkboxes. */
export function listEquipment(rooms: readonly Room[]): string[] {
  return Array.from(new Set(rooms.flatMap((r) => r.equipment))).sort();
}
