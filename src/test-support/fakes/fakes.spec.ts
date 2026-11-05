import {
  FakeClock,
  FakeMailer,
  FakeOAuthVerifier,
  InMemoryStorage,
} from './index';

describe('fakes', () => {
  it('FakeClock advances only when told', () => {
    const clock = new FakeClock();
    const start = clock.now().getTime();
    expect(clock.now().getTime()).toBe(start);
    clock.advance(1000);
    expect(clock.now().getTime()).toBe(start + 1000);
  });

  it('FakeMailer records and can fail', async () => {
    const mailer = new FakeMailer();
    mailer.failNext(1);
    await expect(
      mailer.send({ to: 'a@x.test', subject: 's', body: 'b' }),
    ).rejects.toThrow('simulated');
    await mailer.send({ to: 'a@x.test', subject: 's', body: 'b' });
    expect(mailer.sent).toHaveLength(1);
  });

  it('FakeOAuthVerifier only accepts scripted tokens', async () => {
    const v = new FakeOAuthVerifier();
    v.accept('good', { subject: 's1', email: 'a@x.test' });
    await expect(v.verify('good')).resolves.toMatchObject({ subject: 's1' });
    await expect(v.verify('bad')).rejects.toThrow('invalid');
  });

  it('InMemoryStorage round-trips and deletes', async () => {
    const s = new InMemoryStorage();
    await s.put('k', Buffer.from('v'));
    expect((await s.get('k'))?.toString()).toBe('v');
    await s.delete('k');
    expect(await s.get('k')).toBeUndefined();
  });
});
