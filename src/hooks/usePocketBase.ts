import { useState, useEffect, useCallback } from 'react';
import { pb } from '../lib/pocketbase';
import { normalizeTier } from '../lib/user';
import type { PocketBaseUser } from '../types';

function toPocketBaseUser(model: unknown): PocketBaseUser | null {
  if (!model || typeof model !== 'object') return null;
  const m = model as Record<string, unknown>;
  return {
    id: typeof m['id'] === 'string' ? m['id'] : '',
    email: typeof m['email'] === 'string' ? m['email'] : '',
    tier: typeof m['tier'] === 'string' ? m['tier'] : undefined,
    stripe_customer_id: typeof m['stripe_customer_id'] === 'string' ? m['stripe_customer_id'] : undefined,
    stripe_subscription_id: typeof m['stripe_subscription_id'] === 'string' ? m['stripe_subscription_id'] : undefined,
  };
}

export function usePocketBase() {
  const [user, setUser] = useState<PocketBaseUser | null>(
    pb.authStore.isValid ? toPocketBaseUser(pb.authStore.model) : null
  );
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(false);
    const unsub = pb.authStore.onChange((_token, model) => {
      setUser(model ? toPocketBaseUser(model) : null);
    });
    return () => unsub();
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    const authData = await pb.collection('users').authWithPassword(email, password);
    setUser(toPocketBaseUser(authData.record));
    return authData;
  }, []);

  const logout = useCallback(() => {
    pb.authStore.clear();
    setUser(null);
  }, []);

  const tier = normalizeTier(user?.tier);

  return { user, loading, tier, login, logout };
}
