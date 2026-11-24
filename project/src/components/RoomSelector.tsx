import type { Room } from '@/lib/types';
import { SELECT_CLASS } from './styles';

interface Props {
  rooms: Room[];
  value: string;
  onChange: (roomId: string) => void;
}

export function RoomSelector({ rooms, value, onChange }: Props) {
  return (
    <div className="mb-5">
      <label htmlFor="room" className="block text-sm font-medium text-slate-700 mb-1.5">
        Select a room
      </label>
      <div className="relative">
        <select
          id="room"
          value={value}
          disabled={rooms.length === 0}
          onChange={(e) => onChange(e.target.value)}
          className={SELECT_CLASS}
        >
          {rooms.length === 0 ? (
            <option value="" disabled>
              No matching rooms
            </option>
          ) : (
            rooms.map((r) => (
              <option key={r.id} value={r.id}>
                {r.name} — {r.building}
                {r.blocked ? ' (Blocked)' : ''}
              </option>
            ))
          )}
        </select>
        <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400">
          ▾
        </span>
      </div>
    </div>
  );
}