export interface Booking {
  id: string;
  start: number; // minutes from 00:00
  end: number; // minutes from 00:00
  title: string;
  bookedBy: string;
}

export interface Room {
  id: string;
  name: string;
  building: string;
  capacity: number;
  equipment: string[];
  blocked: boolean;
  bookings: Booking[];
}

export type RejectionCode =
  | 'invalid_interval'
  | 'start_not_after_now'
  | 'duration_too_long'
  | 'room_blocked'
  | 'overlaps_booking';

export type Decision =
  | { available: true }
  | { available: false; reasons: string[]; reasonCodes: RejectionCode[] };
