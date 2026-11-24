import { describe, it, expect, vi } from 'vitest';
import {
  buildExplainInput,
  explainAvailability,
  templateExplanation,
  validateOutput,
  type Adapter,
  type ExplainInput,
} from './explainAvailability';
import type { Decision } from './types';

function expectExplain(r: Awaited<ReturnType<typeof explainAvailability>>): asserts r is Exclude<typeof r, { error: string }> {
  if ('error' in r) expect.fail(`expected explanation, got error: ${r.error}`);
}

const base: ExplainInput = {
  roomName: 'Room A101',
  start: 600,
  end: 660,
  available: true,
  reasonCodes: [],
};

const unavailable: ExplainInput = {
  ...base,
  available: false,
  reasonCodes: ['overlaps_booking'],
};

const overlapDecision: Decision = {
  available: false,
  reasons: ['overlaps an existing booking'],
  reasonCodes: ['overlaps_booking'],
};
const availableInput = { roomName: 'Lab', start: 660, end: 720, available: true, reasonCodes: [] as never[] };
const overlapInput = { roomName: 'Lab', start: 540, end: 600, available: false, reasonCodes: ['overlaps_booking' as const] };


describe('explainAvailability', () => {
  it("rejects a negated text for an available decision (finding 1)", () => {
  expect(validateOutput("Lab isn't available for 11:00–12:00.", availableInput)).toBeNull();
  expect(validateOutput("Lab can't be booked.", availableInput)).toBeNull();
});

// Finding 2: known gap, not fixed. it.fails passes while the gap exists.
it.fails('rejects invented booking details (finding 2, known gap)', () => {
  expect(validateOutput('It is booked by Prof. Hale at 09:00.', overlapInput)).toBeNull();
});

// Finding 4: known gap, not fixed.
it.fails('labels a custom adapter as llm (finding 4, known gap)', async () => {
  const r = await explainAvailability(availableInput, async () => 'Lab is free for 11:00–12:00, so this time is valid.');
  expect('source' in r && r.source).toBe('llm');
});
  it('explains an available decision via the mock adapter', async () => {
    const r = await explainAvailability(base);
    expectExplain(r);
    expect(r.source).toBe('mock');
    expect(r.explanation).toMatch(/Room A101 is free/);
  });

  it('explains an overlap rejection with the overlap reason', async () => {
    const r = await explainAvailability(unavailable);
    expectExplain(r);
    expect(r.source).toBe('mock');
    expect(r.explanation).toMatch(/overlaps an existing booking/);
  });

  it('explains a blocked room rejection', async () => {
    const r = await explainAvailability({ ...base, available: false, reasonCodes: ['room_blocked'] });
    expectExplain(r);
    expect(r.explanation).toMatch(/room is blocked/);
  });

  it('rejects an empty room name', async () => {
    const r = await explainAvailability({ ...base, roomName: '   ' });
    expect(r).toEqual({ error: 'Invalid room name' });
  });

  it('uses the fallback when the adapter rejects', async () => {
    const failing: Adapter = vi.fn(async () => {
      throw new Error('boom');
    });
    const r = await explainAvailability(base, failing, true);
    expectExplain(r);
    expect(r.source).toBe('fallback');
    expect(r.explanation).toBe(templateExplanation(base));
  });

  it('uses the fallback when the adapter times out', async () => {
    const never: Adapter = () => new Promise(() => {});
    const r = await explainAvailability(base, never, true, 10);
    expectExplain(r);
    expect(r.source).toBe('fallback');
  });

  it('uses the fallback when the adapter output contradicts the decision', async () => {
    const contradicting: Adapter = async () => 'This room is booked and cannot be booked.';
    const r = await explainAvailability(base, contradicting, false);
    expectExplain(r);
    expect(r.source).toBe('fallback');
    expect(r.explanation).toBe(templateExplanation(base));
  });

  it('buildExplainInput copies the decision without booking titles', () => {
    const input = buildExplainInput('Room A101', 600, 660, overlapDecision);
    expect(input).toEqual({
      roomName: 'Room A101',
      start: 600,
      end: 660,
      available: false,
      reasonCodes: ['overlaps_booking'],
    });
    expect(input).not.toHaveProperty('reasons');
  });

  it('explains a rejection with several reason codes at once', async () => {
    const r = await explainAvailability({
      ...base,
      available: false,
      reasonCodes: ['overlaps_booking', 'duration_too_long'],
    });
    expectExplain(r);
    expect(r.explanation).toMatch(/overlaps an existing booking/);
    expect(r.explanation).toMatch(/cannot be longer than 120 minutes/);
  });
  it('rejects a room name longer than 60 characters', async () => {
  const input = {
    roomName: 'A'.repeat(61),
    start: 660,
    end: 720,
    available: true,
    reasonCodes: [],
  };
  const result = await explainAvailability(input);
  expect(result).toEqual({ error: 'Invalid room name' });
});

it('rejects available=true with a reason code', async () => {
  const input = {
    roomName: 'Engineering Lab A',
    start: 660,
    end: 720,
    available: true,
    reasonCodes: ['overlaps_booking'],
  };
  const result = await explainAvailability(input);
  expect(result).toEqual({ error: 'Status and reason codes disagree' });
});
});
