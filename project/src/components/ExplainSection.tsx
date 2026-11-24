import { useState } from 'react';
import { Sparkles } from 'lucide-react';
import type { Decision } from '@/lib/types';
import {
  buildExplainInput,
  explainAvailability,
  type ExplainResult,
} from '@/lib/explainAvailability';

const SOURCE_TAG_CLASS: Record<ExplainResult['source'], string> = {
  mock: 'bg-slate-100 text-slate-600 border-slate-200',
  llm: 'bg-sky-50 text-sky-700 border-sky-200',
  fallback: 'bg-amber-50 text-amber-700 border-amber-200',
};

type ExplainOutcome = ExplainResult | { error: string };

export function ExplainSection({
  roomName,
  start,
  end,
  decision,
}: {
  roomName: string;
  start: number;
  end: number;
  decision: Decision;
}) {
  const [loading, setLoading] = useState(false);
  const [outcome, setOutcome] = useState<ExplainOutcome | null>(null);

  const handleExplain = async () => {
    setLoading(true);
    setOutcome(null);
    const input = buildExplainInput(roomName, start, end, decision);
    const result = await explainAvailability(input);
    setOutcome(result);
    setLoading(false);
  };

  return (
    <div className="mt-4">
      <button
        onClick={handleExplain}
        disabled={loading}
        className="inline-flex items-center justify-center gap-2 rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 focus:ring-2 focus:ring-slate-200 focus:outline-none transition active:scale-[0.98] disabled:text-slate-400 disabled:cursor-wait disabled:hover:bg-white"
      >
        <Sparkles className="w-4 h-4" />
        {loading ? 'Explaining…' : 'Explain availability'}
      </button>

      {outcome && (
        <div className="mt-3 rounded-xl border border-slate-200 bg-white shadow-sm p-4" role="note">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="text-sm font-semibold text-slate-900">
              AI-generated explanation — not a booking confirmation
            </h3>
            {'error' in outcome ? null : (
              <span
                className={`rounded-full border px-2 py-0.5 text-[11px] font-medium ${SOURCE_TAG_CLASS[outcome.source]}`}
              >
                {outcome.source}
              </span>
            )}
          </div>
          {'error' in outcome ? (
            <p className="mt-2 text-sm text-slate-600">
              Sorry, the explanation could not be generated right now. Please try again.
            </p>
          ) : (
            <p className="mt-2 text-sm text-slate-600 leading-relaxed">{outcome.explanation}</p>
          )}
        </div>
      )}
    </div>
  );
}
