import { pb } from './pocketbase';
import type { ImmersiveKitApp } from '../types';

export interface LaunchUrlOptions {
  token?: string;
  userId?: string;
  source?: string;
}

export function buildLaunchUrl(appUrl: string, options: LaunchUrlOptions = {}): string {
  const url = new URL(appUrl);

  const token = options.token ?? pb.authStore.token;
  const userId = options.userId ?? (pb.authStore.model as Record<string, unknown> | null)?.['id'];
  const source = options.source ?? 'mjw-apps-dash';

  if (token) url.searchParams.set('token', String(token));
  if (userId) url.searchParams.set('uid', String(userId));
  url.searchParams.set('source', source);

  return url.toString();
}

export function redirectWithToken(appUrl: string): void {
  if (!appUrl) return;

  let target: string;
  try {
    target = buildLaunchUrl(appUrl);
  } catch {
    console.error(`[sso] Invalid app URL: ${appUrl}`);
    return;
  }

  window.location.href = target;
}

/**
 * Launch a tool, appending SSO params only when the tool declares
 * supportsSsoLaunch = true. Falls back to a plain redirect otherwise.
 */
export function launchTool(app: ImmersiveKitApp): void {
  if (!app.url) return;

  if (app.supportsSsoLaunch) {
    redirectWithToken(app.url);
  } else {
    try {
      new URL(app.url); // validate
      window.location.href = app.url;
    } catch {
      console.error(`[sso] Invalid app URL: ${app.url}`);
    }
  }
}

export function isValidUrl(url: string | undefined): boolean {
  if (!url) return false;
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}
