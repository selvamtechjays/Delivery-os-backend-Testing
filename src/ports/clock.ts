/** Source of the current time, injected so tests control it. */
export interface Clock {
  now(): Date;
}
