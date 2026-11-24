import { Clock, RefreshCw } from 'lucide-react';
import { INPUT_CLASS, INPUT_WITH_ICON_CLASS } from './styles';

const END_OF_DAY = '24:00';

interface Props {
  startTime: string;
  endTime: string;
  currentTime: string;
  defaultCurrentTime: string;
  onStartChange: (value: string) => void;
  onEndChange: (value: string) => void;
  onCurrentChange: (value: string) => void;
  onResetCurrent: () => void;
}

export function TimeForm({
  startTime,
  endTime,
  currentTime,
  defaultCurrentTime,
  onStartChange,
  onEndChange,
  onCurrentChange,
  onResetCurrent,
}: Props) {
  return (
    <>
      <div className="grid grid-cols-2 gap-4 mb-5">
        <div>
          <label htmlFor="start" className="block text-sm font-medium text-slate-700 mb-1.5">
            Start time
          </label>
          <input
            id="start"
            type="time"
            value={startTime}
            onChange={(e) => onStartChange(e.target.value)}
            className={INPUT_CLASS}
          />
        </div>
        <div>
          <label htmlFor="end" className="block text-sm font-medium text-slate-700 mb-1.5">
            End time
          </label>
          <input
            id="end"
            type="time"
            value={endTime === END_OF_DAY ? '' : endTime}
            onChange={(e) => onEndChange(e.target.value)}
            className={INPUT_CLASS}
          />
          <label className="flex items-center gap-2 mt-2 text-xs text-slate-500">
            <input
              type="checkbox"
              checked={endTime === END_OF_DAY}
              onChange={(e) => onEndChange(e.target.checked ? END_OF_DAY : '23:00')}
              className="rounded border-slate-300 text-sky-600 focus:ring-sky-200"
            />
            End at midnight (24:00)
          </label>
        </div>
      </div>

      <div className="mb-5">
        <div className="flex items-end justify-between gap-3">
          <div className="flex-1">
            <label htmlFor="current-time" className="block text-sm font-medium text-slate-700 mb-1.5">
              Current time
            </label>
            <div className="relative">
              <Clock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                id="current-time"
                type="time"
                value={currentTime}
                onChange={(e) => onCurrentChange(e.target.value)}
                className={INPUT_WITH_ICON_CLASS}
              />
            </div>
          </div>
          <button
            onClick={onResetCurrent}
            className="inline-flex items-center gap-1.5 text-xs font-medium text-sky-600 hover:text-sky-700 transition pb-2.5 whitespace-nowrap"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            Reset to {defaultCurrentTime}
          </button>
        </div>
        <p className="mt-1.5 text-xs text-slate-400">
          The demo clock is fixed at {defaultCurrentTime}. You can edit it to test other scenarios.
        </p>
      </div>
    </>
  );
}