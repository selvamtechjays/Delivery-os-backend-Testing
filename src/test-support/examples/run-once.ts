import type { Clock, Mailer } from '../../ports';

// Harness example only: shows the run-once job pattern the dev agent copies.
// Not a product job.
export type JobState = 'done' | 'failed';

export interface JobRecord {
  state: JobState;
  attempts: number;
  finishedAt: Date;
}

export interface RunOnceDeps {
  clock: Clock;
  mailer: Mailer;
  ledger: Map<string, JobRecord>;
  maxAttempts: number;
}

/** Idempotent per jobId: a second invocation is a no-op returning the record. */
export async function runOnce(
  deps: RunOnceDeps,
  job: { id: string; to: string },
): Promise<JobRecord> {
  const existing = deps.ledger.get(job.id);
  if (existing) return existing;

  let attempts = 0;
  let state: JobState = 'failed';
  while (attempts < deps.maxAttempts && state === 'failed') {
    attempts += 1;
    try {
      await deps.mailer.send({ to: job.to, subject: 'job', body: job.id });
      state = 'done';
    } catch {
      state = 'failed';
    }
  }
  const record = { state, attempts, finishedAt: deps.clock.now() };
  deps.ledger.set(job.id, record);
  return record;
}
