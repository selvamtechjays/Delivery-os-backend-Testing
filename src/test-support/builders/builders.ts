import { nextSeq } from './sequence';

// Harness-level shapes. Replace with the real domain types when they exist.
export interface UserFixture {
  id: string;
  email: string;
  name: string;
}

export interface ListFixture {
  id: string;
  ownerId: string;
  title: string;
}

export interface TaskFixture {
  id: string;
  listId: string;
  title: string;
  done: boolean;
}

export function buildUser(overrides: Partial<UserFixture> = {}): UserFixture {
  const n = nextSeq();
  return {
    id: `user-${n}`,
    email: `user${n}@example.test`,
    name: `User ${n}`,
    ...overrides,
  };
}

export function buildList(overrides: Partial<ListFixture> = {}): ListFixture {
  const n = nextSeq();
  return {
    id: `list-${n}`,
    ownerId: `user-${n}`,
    title: `List ${n}`,
    ...overrides,
  };
}

export function buildTask(overrides: Partial<TaskFixture> = {}): TaskFixture {
  const n = nextSeq();
  return {
    id: `task-${n}`,
    listId: `list-${n}`,
    title: `Task ${n}`,
    done: false,
    ...overrides,
  };
}
