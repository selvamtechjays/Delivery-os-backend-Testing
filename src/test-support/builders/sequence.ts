let counter = 0;

/** Counter-based unique values: deterministic, no randomness. */
export function nextSeq(): number {
  counter += 1;
  return counter;
}

export function resetSeq(): void {
  counter = 0;
}
