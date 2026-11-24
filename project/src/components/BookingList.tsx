import type { Booking } from '@/lib/types';
import { minutesToTimeString } from '@/lib/availability';
import { CARD_CLASS } from './styles';

export function BookingList({ bookings }: { bookings: Booking[] }) {
  return (
    <div className={CARD_CLASS}>
      <h3 className="text-sm font-semibold text-slate-900 mb-4">
        Existing bookings ({bookings.length})
      </h3>
      {bookings.length === 0 ? (
        <p className="text-sm text-slate-400">No bookings for this room.</p>
      ) : (
        <ul className="space-y-3">
          {bookings.map((b) => (
            <li
              key={b.id}
              className="flex items-center justify-between gap-3 rounded-lg bg-slate-50 border border-slate-100 px-3.5 py-2.5"
            >
              <div className="min-w-0">
                <p className="text-sm font-medium text-slate-800 truncate">{b.title}</p>
                <p className="text-xs text-slate-500 mt-0.5">by {b.bookedBy}</p>
              </div>
              <span className="shrink-0 text-xs font-semibold text-slate-600 bg-white border border-slate-200 rounded-md px-2 py-1">
                {minutesToTimeString(b.start)}–{minutesToTimeString(b.end)}
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}