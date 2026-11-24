import { CheckCircle2, XCircle } from 'lucide-react';
import type { Decision } from '@/lib/types';

export function DecisionBanner({ decision }: { decision: Decision }) {
  return (
    <div
      role="status"
      className={`mt-5 rounded-xl border p-4 sm:p-5 transition ${
        decision.available ? 'bg-emerald-50 border-emerald-200' : 'bg-red-50 border-red-200'
      }`}
    >
      <div className="flex items-start gap-3">
        {decision.available ? (
          <CheckCircle2 className="w-6 h-6 text-emerald-600 shrink-0 mt-0.5" />
        ) : (
          <XCircle className="w-6 h-6 text-red-600 shrink-0 mt-0.5" />
        )}
        <div>
          <p
            className={`font-semibold text-base ${
              decision.available ? 'text-emerald-800' : 'text-red-800'
            }`}
          >
            {decision.available ? 'Available' : 'Unavailable'}
          </p>
          {decision.available ? (
            <p className="text-sm text-emerald-700 mt-1">
              This room is free for the selected time slot. The room has not been booked — existing
              bookings are unchanged.
            </p>
          ) : (
            <ul className="mt-1.5 space-y-1">
              {decision.reasons.map((reason, i) => (
                <li key={i} className="text-sm text-red-700 flex items-start gap-1.5">
                  <span className="mt-0.5">•</span>
                  <span>{reason}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}