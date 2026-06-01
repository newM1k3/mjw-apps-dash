import { pb } from './pocketbase';

export const redirectWithToken = (appUrl: string): void => {
  const token = pb.authStore.token;
  const user = pb.authStore.model;

  if (!appUrl) return;

  const url = new URL(appUrl);

  if (token) {
    url.searchParams.set('token', token);
  }

  if (user?.id) {
    url.searchParams.set('uid', user.id);
  }

  window.location.href = url.toString();
};
