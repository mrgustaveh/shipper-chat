import { BASE_URL, AUTH_ENDPOINTS } from "./config";
import type { Account } from "./entities";

export type authArgs = {
  token: string;
};

export const getAccount = async (args: authArgs): Promise<Account> => {
  const URL = BASE_URL + AUTH_ENDPOINTS.me;

  const res = await fetch(URL, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${args.token}`,
    },
  });

  const data: Account = await res.json();
  return data;
};

export const createAccount = async (
  args: {
    username: string;
    email: string;
    displayPic: string;
  } & authArgs,
): Promise<Account> => {
  const URL = BASE_URL + AUTH_ENDPOINTS.profile;

  const res = await fetch(URL, {
    method: "POST",
    body: JSON.stringify({
      username: args.username,
      email: args.email,
      displayPic: args.displayPic,
    }),
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${args.token}`,
    },
  });

  const data: Account = await res.json();
  return data;
};

export const updateAccount = async (
  args: Partial<{
    username: string;
    email: string;
    displayPic: string;
  }> &
    authArgs,
): Promise<Account> => {
  const URL = BASE_URL + AUTH_ENDPOINTS.profile;

  const res = await fetch(URL, {
    method: "PATCH",
    body: JSON.stringify({
      username: args.username,
      email: args.email,
      displayPic: args.displayPic,
    }),
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${args.token}`,
    },
  });

  const data: Account = await res.json();
  return data;
};

export const getUsers = async (args: authArgs): Promise<Account[]> => {
  const URL = BASE_URL + AUTH_ENDPOINTS.users;

  const res = await fetch(URL, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${args.token}`,
    },
  });

  const data: Account[] = await res.json();
  return data;
};
