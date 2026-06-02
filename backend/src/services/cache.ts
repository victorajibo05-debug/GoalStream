import NodeCache from "node-cache";

export const TTL = {
  LIVE: 30,
}

class CacheService {
  private store: NodeCache;

  constructor() {
    this.store = new NodeCache({ stdTTL: TTL.LIVE, checkperiod: 60 });
  }

  get<T>(key: string): T | undefined {
    return this.store.get<T>(key);
  }

  set<T>(key: string, value: T, ttl: number): void {
    this.store.set(key, value, ttl);
  }

  del(key: string): void {
    this.store.del(key);
  }

  flush(): void {
    this.store.flushAll();
  }

  stats() {
    return this.store.getStats();
  }

  keys(): string[] {
    return this.store.keys();
  }
}

export const cache = new CacheService();