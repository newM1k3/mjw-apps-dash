export type UserTier = 'free' | 'pro' | 'enterprise';

export type AppSuite = 'design' | 'operations' | 'marketing';

export type AppStatus = 'live_or_ready' | 'planned' | 'coming_soon';

export interface ImmersiveKitApp {
  id: string;
  name: string;
  shortName?: string;
  suite: AppSuite;
  description: string;
  role: string;
  icon: string;
  url?: string;
  requiredTier: UserTier;
  status: AppStatus;
  tags: string[];
}

export interface PocketBaseUser {
  id: string;
  email: string;
  tier?: string;
  stripe_customer_id?: string;
  stripe_subscription_id?: string;
}
