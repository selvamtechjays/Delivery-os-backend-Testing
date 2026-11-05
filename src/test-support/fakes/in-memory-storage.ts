import type { Storage } from '../../ports';

export class InMemoryStorage implements Storage {
  private readonly objects = new Map<string, Buffer>();

  put(key: string, data: Buffer): Promise<void> {
    this.objects.set(key, data);
    return Promise.resolve();
  }

  get(key: string): Promise<Buffer | undefined> {
    return Promise.resolve(this.objects.get(key));
  }

  delete(key: string): Promise<void> {
    this.objects.delete(key);
    return Promise.resolve();
  }
}
