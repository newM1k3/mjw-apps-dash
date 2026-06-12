import { useEffect, useState } from 'react';
import { pb } from '../lib/pocketbase';

// ─────────────────────────────────────────────────────────────────────────────
// useHasVenue — does the signed-in user belong to any venue (organization) yet?
//
// Drives the first-run onboarding CTA. A user with zero memberships hasn't been
// through the Venue Intelligence Wizard, so we prompt them to.
//
// Returns:
//   hasVenue: true   — user has at least one membership
//             false  — user has none (show onboarding)
//             null   — unknown (no user, still loading, or query failed)
//
// On query failure we deliberately return null (not false) so a transient
// PocketBase error never nags an existing operator with the onboarding prompt.
// ─────────────────────────────────────────────────────────────────────────────

interface HasVenueState {
  hasVenue: boolean | null;
  loading: boolean;
}

export function useHasVenue(userId: string | undefined): HasVenueState {
  const [state, setState] = useState<HasVenueState>({ hasVenue: null, loading: false });

  useEffect(() => {
    if (!userId) {
      setState({ hasVenue: null, loading: false });
      return;
    }

    let cancelled = false;
    setState({ hasVenue: null, loading: true });

    pb.collection('memberships')
      .getList(1, 1, { filter: `user = "${userId}"` })
      .then((res) => {
        if (!cancelled) setState({ hasVenue: res.totalItems > 0, loading: false });
      })
      .catch(() => {
        if (!cancelled) setState({ hasVenue: null, loading: false });
      });

    return () => {
      cancelled = true;
    };
  }, [userId]);

  return state;
}
