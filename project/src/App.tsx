import { useEffect, useMemo, useState } from 'react';
import { CalendarClock, CheckCircle2 } from 'lucide-react';
import type { Decision } from '@/lib/types';
import { sampleRooms } from '@/lib/sampleData';
import { checkAvailability, MAX_DURATION_MIN, timeStringToMinutes } from '@/lib/availability';
import { filterRooms, listEquipment, type RoomFilter } from '@/lib/filtering';
import { RoomFilters } from '@/components/RoomFilters';
import { RoomSelector } from '@/components/RoomSelector';
import { TimeForm } from '@/components/TimeForm';
import { DecisionBanner } from '@/components/DecisionBanner';
import { ExplainSection } from '@/components/ExplainSection';
import { RoomDetails } from '@/components/RoomDetails';
import { BookingList } from '@/components/BookingList';
import { EmptyState } from '@/components/EmptyState';

const DEFAULT_CURRENT_TIME = '08:00';
const ALL_EQUIPMENT = listEquipment(sampleRooms);

function toRoomFilter(attendees: string, equipment: string[]): RoomFilter {
  return { attendees: Number(attendees) || 0, equipment };
}

function App() {
  const [roomId, setRoomId] = useState(sampleRooms[0].id);
  const [attendees, setAttendees] = useState('');
  const [requiredEquipment, setRequiredEquipment] = useState<string[]>([]);
  const [startTime, setStartTime] = useState('09:00');
  const [endTime, setEndTime] = useState('10:00');
  const [currentTimeStr, setCurrentTimeStr] = useState(DEFAULT_CURRENT_TIME);
  const [decision, setDecision] = useState<Decision | null>(null);
  const [checkedSlot, setCheckedSlot] = useState<{ start: number; end: number } | null>(null);
  const [formError, setFormError] = useState<string | null>(null);

  // F5: any input change invalidates the previous result (single place).
  useEffect(() => {
    setDecision(null);
    setCheckedSlot(null);
    setFormError(null);
  }, [roomId, startTime, endTime, currentTimeStr, attendees, requiredEquipment]);

  const visibleRooms = useMemo(
    () => filterRooms(sampleRooms, toRoomFilter(attendees, requiredEquipment)),
    [attendees, requiredEquipment],
  );
  const selectedRoom = visibleRooms.find((r) => r.id === roomId) ?? null;

  const updateFilters = (nextAttendees: string, nextEquipment: string[]) => {
    const rooms = filterRooms(sampleRooms, toRoomFilter(nextAttendees, nextEquipment));
    setAttendees(nextAttendees);
    setRequiredEquipment(nextEquipment);
    if (!rooms.some((r) => r.id === roomId)) {
      setRoomId(rooms[0]?.id ?? '');
    }
  };

  const toggleEquipment = (item: string, checked: boolean) => {
    const next = checked
      ? [...requiredEquipment, item]
      : requiredEquipment.filter((e) => e !== item);
    updateFilters(attendees, next);
  };

  const handleCheck = () => {
    if (!selectedRoom) return;
    setFormError(null);
    const start = timeStringToMinutes(startTime);
    const end = timeStringToMinutes(endTime);
    const current = timeStringToMinutes(currentTimeStr);

    if (start === null || end === null) {
      setFormError('Please enter valid times in HH:MM format.');
      setDecision(null);
      return;
    }
    if (current === null) {
      setFormError('Please enter a valid current time in HH:MM format.');
      setDecision(null);
      return;
    }
    setCheckedSlot({ start, end });
    setDecision(checkAvailability(selectedRoom, start, end, current));
  };

  const handleReset = () => {
    setDecision(null);
    setCheckedSlot(null);
    setFormError(null);
    setAttendees('');
    setRequiredEquipment([]);
    setRoomId(sampleRooms[0].id);
    setStartTime('09:00');
    setEndTime('10:00');
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800">
      <header className="bg-white border-b border-slate-200">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-sky-600 text-white shrink-0">
              <CalendarClock className="w-5 h-5 sm:w-6 sm:h-6" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-slate-900 leading-tight">
                Smart Campus Room Availability Checker
              </h1>
              <p className="text-sm text-slate-500 mt-0.5">
                Check whether a campus room is free for your chosen time slot.
              </p>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 sm:px-6 py-6 sm:py-10">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 lg:gap-8">
          <section className="lg:col-span-3 bg-white rounded-2xl border border-slate-200 shadow-sm p-5 sm:p-7">
            <h2 className="text-lg font-semibold text-slate-900 mb-5">Check a room</h2>

            <RoomFilters
              attendees={attendees}
              allEquipment={ALL_EQUIPMENT}
              selectedEquipment={requiredEquipment}
              matchCount={visibleRooms.length}
              onAttendeesChange={(value) => updateFilters(value, requiredEquipment)}
              onToggleEquipment={toggleEquipment}
            />
            <RoomSelector rooms={visibleRooms} value={roomId} onChange={setRoomId} />
            <TimeForm
              startTime={startTime}
              endTime={endTime}
              currentTime={currentTimeStr}
              defaultCurrentTime={DEFAULT_CURRENT_TIME}
              onStartChange={setStartTime}
              onEndChange={setEndTime}
              onCurrentChange={setCurrentTimeStr}
              onResetCurrent={() => setCurrentTimeStr(DEFAULT_CURRENT_TIME)}
            />

            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={handleCheck}
                disabled={!selectedRoom}
                className="flex-1 inline-flex items-center justify-center gap-2 rounded-lg bg-sky-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-sky-700 focus:ring-2 focus:ring-sky-300 focus:outline-none transition active:scale-[0.98] disabled:bg-slate-300 disabled:text-slate-500 disabled:cursor-not-allowed disabled:hover:bg-slate-300 disabled:active:scale-100"
              >
                <CheckCircle2 className="w-4.5 h-4.5" />
                Check Availability
              </button>
              <button
                onClick={handleReset}
                className="inline-flex items-center justify-center gap-2 rounded-lg border border-slate-300 bg-white px-5 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50 focus:ring-2 focus:ring-slate-200 focus:outline-none transition"
              >
                Reset
              </button>
            </div>

            {formError && (
              <div className="mt-4 rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
                {formError}
              </div>
            )}
            {decision && <DecisionBanner decision={decision} />}
            {decision && selectedRoom && checkedSlot && (
              <ExplainSection
                roomName={selectedRoom.name}
                start={checkedSlot.start}
                end={checkedSlot.end}
                decision={decision}
              />
            )}

            <p className="mt-5 text-xs text-slate-400 leading-relaxed">
              Max booking length: {MAX_DURATION_MIN} minutes. Times are within 00:00–24:00.
              Touching endpoints (e.g. 10:00–11:00 then 11:00–12:00) are allowed.
            </p>
          </section>

          <aside className="lg:col-span-2 space-y-5">
            {selectedRoom ? (
              <>
                <RoomDetails room={selectedRoom} />
                <BookingList bookings={selectedRoom.bookings} />
              </>
            ) : (
              <EmptyState />
            )}
          </aside>
        </div>
      </main>

      <footer className="border-t border-slate-200 bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-5 text-center text-xs text-slate-400">
          Smart Campus Room Availability Checker — uses fictional sample data only.
        </div>
      </footer>
    </div>
  );
}

export default App;