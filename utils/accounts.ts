import { storage, StorageKeys } from "./storage";

export type LocalAccount = {
  name: string;
  username: string;
  email: string;
};

const normalizeUsername = (username: string) => username.trim().toLowerCase();

export async function getAccounts(): Promise<LocalAccount[]> {
  const stored = await storage.getJSON<LocalAccount[]>(StorageKeys.ACCOUNTS, []);
  if (!Array.isArray(stored)) return [];

  return stored.filter(
    (account): account is LocalAccount =>
      !!account &&
      typeof account.name === "string" &&
      typeof account.username === "string" &&
      typeof account.email === "string",
  );
}

export async function findAccount(
  username: string,
): Promise<LocalAccount | null> {
  const target = normalizeUsername(username);
  if (!target) return null;

  const accounts = await getAccounts();
  return (
    accounts.find(
      (account) => normalizeUsername(account.username) === target,
    ) ?? null
  );
}

export async function saveAccount(account: LocalAccount): Promise<boolean> {
  const accounts = await getAccounts();
  const target = normalizeUsername(account.username);
  const existingIndex = accounts.findIndex(
    (item) => normalizeUsername(item.username) === target,
  );

  const next =
    existingIndex >= 0
      ? accounts.map((item, index) =>
          index === existingIndex ? account : item,
        )
      : [...accounts, account];

  return storage.setJSON(StorageKeys.ACCOUNTS, next);
}
