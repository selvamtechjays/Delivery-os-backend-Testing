import mongoose from 'mongoose';

// Throwaway schema: proves the DB harness and resetDb isolation. Not a product model.
const Probe = mongoose.model(
  'HarnessProbe',
  new mongoose.Schema({ label: { type: String, required: true } }),
);

describe('integration DB harness', () => {
  it('round-trips a document through the in-memory MongoDB', async () => {
    await Probe.create({ label: 'a' });
    expect(await Probe.countDocuments()).toBe(1);
  });

  it('resets between tests (isolation)', async () => {
    expect(await Probe.countDocuments()).toBe(0);
  });
});
