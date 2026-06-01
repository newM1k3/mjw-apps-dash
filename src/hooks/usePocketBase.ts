import { useState, useEffect, useCallback } from 'react';
import { pb } from '../lib/pocketbase';
import type { UserTier, PocketBaseUser } from '../types';

const normalizeTier = (tier?: string): UserTier => {
  if (tier === 'pro' || tier === 'enterprise') return tier;
  return 'free';
};

export function usePocketBase() {
  const [user, setUser] = useState<PocketBaseUser | null>(
    pb.authStore.isValid ? (pb.authStore.model as PocketBaseUser) : null
  );
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(false);
    const unsub = pb.authStore.onChange((_token, model) => {
      setUser(model ? (model as PocketBaseUser) : null);
    });
    return () => unsub();
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    const authData = await pb.collection('users').authWithPassword(email, password);
    setUser(authData.record as unknown as PocketBaseUser);
    return authData;
  }, []);

  const logout = useCallback(() => {
    pb.authStore.clear();
    setUser(null);
  }, []);

  const tier = normalizeTier(user?.tier);

  return { user, loading, tier, login, logout };
}
