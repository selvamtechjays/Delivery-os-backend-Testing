import { FakeClock, FakeMailer } from '../fakes';
import { runOnce, type RunOnceDeps } from './run-once';

function makeDeps(): RunOnceDeps & { mailer: FakeMailer; clock: FakeClock } {
  return {
    clock: new FakeClock(),
    mailer: new FakeMailer(),
    ledger: new Map(),
    maxAttempts: 3,
  };
}

describe('run-once job pattern (harness example)', () => {
  it('double delivery yields exactly one effect', async () => {
    const deps = makeDeps();
    const job = { id: 'j1', to: 'a@x.test' };
    await runOnce(deps, job);
    await runOnce(deps, job);
    expect(deps.mailer.sent).toHaveLength(1);
  });

  it('reaches a terminal failed state after retry exhaustion', async () => {
    const deps = makeDeps();
    deps.mailer.failNext(99);
    const record = await runOnce(deps, { id: 'j2', to: 'a@x.test' });
    expect(record).toMatchObject({ state: 'failed', attempts: 3 });
    expect(deps.mailer.sent).toHaveLength(0);
  });

  it('succeeds when a retry gets through, with time from the fake clock', async () => {
    const deps = makeDeps();
    deps.mailer.failNext(2);
    deps.clock.advance(5000);
    const record = await runOnce(deps, { id: 'j3', to: 'a@x.test' });
    expect(record.state).toBe('done');
    expect(record.attempts).toBe(3);
    expect(record.finishedAt.toISOString()).toBe('2026-01-01T00:00:05.000Z');
  });

  it('works under jest fake timers', () => {
    jest.useFakeTimers();
    jest.setSystemTime(new Date('2026-06-01T00:00:00.000Z'));
    expect(new Date().toISOString()).toBe('2026-06-01T00:00:00.000Z');
    jest.useRealTimers();
  });
});
