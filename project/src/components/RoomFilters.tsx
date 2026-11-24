import { INPUT_CLASS } from './styles';

interface Props {
  attendees: string;
  allEquipment: string[];
  selectedEquipment: string[];
  matchCount: number;
  onAttendeesChange: (value: string) => void;
  onToggleEquipment: (item: string, checked: boolean) => void;
}

export function RoomFilters({
  attendees,
  allEquipment,
  selectedEquipment,
  matchCount,
  onAttendeesChange,
  onToggleEquipment,
}: Props) {
  return (
    <>
      <div className="mb-5 rounded-xl border border-slate-200 bg-slate-50 p-4 sm:p-5">
        <h3 className="text-sm font-semibold text-slate-900 mb-4">Find a room</h3>
        <div className="mb-4">
          <label htmlFor="attendees" className="block text-sm font-medium text-slate-700 mb-1.5">
            Attendees
          </label>
          <input
            id="attendees"
            type="number"
            min={1}
            inputMode="numeric"
            placeholder="Any"
            value={attendees}
            onChange={(e) => onAttendeesChange(e.target.value)}
            className={INPUT_CLASS}
          />
        </div>
        <fieldset>
          <legend className="block text-sm font-medium text-slate-700 mb-2">Equipment</legend>
          <div className="flex flex-wrap gap-2">
            {allEquipment.map((item) => {
              const checked = selectedEquipment.includes(item);
              return (
                <label
                  key={item}
                  className={`inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-sm cursor-pointer transition ${
                    checked
                      ? 'border-sky-500 bg-sky-50 text-sky-800'
                      : 'border-slate-300 bg-white text-slate-700 hover:border-slate-400'
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={checked}
                    onChange={(e) => onToggleEquipment(item, e.target.checked)}
                    className="rounded border-slate-300 text-sky-600 focus:ring-sky-200"
                  />
                  <span className="capitalize">{item}</span>
                </label>
              );
            })}
          </div>
        </fieldset>
      </div>
      <p className="mb-5 text-xs font-medium text-slate-500">
        {matchCount} {matchCount === 1 ? 'room matches' : 'rooms match'}
      </p>
    </>
  );
}