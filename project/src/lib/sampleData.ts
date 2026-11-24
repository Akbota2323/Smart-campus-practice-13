import type { Room } from './types';

export const sampleRooms: Room[] = [
  {
    id: 'room-101',
    name: 'Engineering Lab A',
    building: 'Block C',
    capacity: 40,
    equipment: ['computers', 'projector', 'whiteboard'],
    blocked: false,
    bookings: [
      { id: 'b1', start: 540, end: 600, title: 'Circuits Workshop', bookedBy: 'Prof. Hale' },
      { id: 'b2', start: 780, end: 840, title: 'Robotics Demo', bookedBy: 'Prof. Okafor' },
    ],
  },
  {
    id: 'room-102',
    name: 'Lecture Hall B',
    building: 'Block A',
    capacity: 120,
    equipment: ['projector', 'microphone'],
    blocked: false,
    bookings: [
      { id: 'b3', start: 600, end: 720, title: 'Open Lecture: AI Ethics', bookedBy: 'Dean Mora' },
    ],
  },
  {
    id: 'room-103',
    name: 'Design Studio',
    building: 'Block D',
    capacity: 25,
    equipment: ['computers', 'whiteboard'],
    blocked: true,
    bookings: [
      { id: 'b4', start: 480, end: 540, title: 'Maintenance Window', bookedBy: 'Facilities' },
    ],
  },
  {
    id: 'room-104',
    name: 'Seminar Room 4',
    building: 'Block B',
    capacity: 15,
    equipment: ['projector', 'whiteboard'],
    blocked: false,
    bookings: [],
  },
];
