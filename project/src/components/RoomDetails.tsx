import type { ReactNode } from 'react';
import { DoorClosed, MapPin, Users, Wrench, type LucideIcon } from 'lucide-react';
import type { Room } from '@/lib/types';
import { StatusBadge } from './StatusBadge';
import { CARD_CLASS } from './styles';

function Row({
  icon: Icon,
  label,
  top = false,
  children,
}: {
  icon: LucideIcon;
  label: string;
  top?: boolean;
  children: ReactNode;
}) {
  return (
    <div className={`flex ${top ? 'items-start' : 'items-center'} gap-2.5 text-sm`}>
      <Icon className={`w-4 h-4 text-slate-400 shrink-0 ${top ? 'mt-0.5' : ''}`} />
      <span className="text-slate-500">{label}</span>
      {children}
    </div>
  );
}

const VALUE_CLASS = 'ml-auto font-medium text-slate-800 text-right';

export function RoomDetails({ room }: { room: Room }) {
  return (
    <div className={CARD_CLASS}>
      <h3 className="text-sm font-semibold text-slate-900 mb-4">Room details</h3>
      <div className="space-y-3">
        <Row icon={DoorClosed} label="Room">
          <span className={VALUE_CLASS}>{room.name}</span>
        </Row>
        <Row icon={MapPin} label="Building">
          <span className={VALUE_CLASS}>{room.building}</span>
        </Row>
        <Row icon={Users} label="Capacity">
          <span className={VALUE_CLASS}>{room.capacity}</span>
        </Row>
        <Row icon={Wrench} label="Equipment" top>
          {room.equipment.length === 0 ? (
            <span className="ml-auto text-slate-400">None listed</span>
          ) : (
            <ul className="ml-auto flex flex-wrap justify-end gap-1.5">
              {room.equipment.map((item) => (
                <li
                  key={item}
                  className="rounded-md bg-slate-100 px-2 py-0.5 text-xs font-medium capitalize text-slate-700"
                >
                  {item}
                </li>
              ))}
            </ul>
          )}
        </Row>
        <div className="flex items-center gap-2.5 text-sm pt-2 border-t border-slate-100">
          <StatusBadge blocked={room.blocked} />
        </div>
      </div>
    </div>
  );
}