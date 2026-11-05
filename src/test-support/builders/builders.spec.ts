import { buildList, buildTask, buildUser, resetSeq } from './index';

describe('builders', () => {
  beforeEach(() => resetSeq());

  it('produces unique, deterministic values', () => {
    const a = buildUser();
    const b = buildUser();
    expect(a.id).not.toBe(b.id);
    expect(a.email).toBe('user1@example.test');
  });

  it('applies overrides', () => {
    expect(buildTask({ done: true, title: 'x' })).toMatchObject({
      done: true,
      title: 'x',
    });
    expect(buildList({ ownerId: 'u9' }).ownerId).toBe('u9');
  });
});
