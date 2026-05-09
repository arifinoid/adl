import { Elysia } from "elysia";

// Simple in-memory cache store
export const cache = new Map<string, { data: any; expiry: number }>();

export const cachePlugin = new Elysia({ name: "cache-plugin" })
  .derive(() => {
    return {
      getCache: (key: string) => {
        const item = cache.get(key);
        if (!item) return null;
        if (Date.now() > item.expiry) {
          cache.delete(key);
          return null;
        }
        return item.data;
      },
      setCache: (key: string, data: any, ttlSeconds: number = 60) => {
        cache.set(key, {
          data,
          expiry: Date.now() + ttlSeconds * 1000,
        });
      },
      invalidateCache: (keyPrefix: string) => {
        for (const key of cache.keys()) {
          if (key.startsWith(keyPrefix)) {
            cache.delete(key);
          }
        }
      },
    };
  });
