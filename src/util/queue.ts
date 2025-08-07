export type PendingItem = {
  family: string;
  session: string;
  payload: string;      // JSON serialized
  createdAt: number;
};

const KEY = 'silli_pending_sessions_v1';

export function enqueue(item: PendingItem): void {
  const list = readAll();
  list.push(item);
  localStorage.setItem(KEY, JSON.stringify(list));
}

export function readAll(): PendingItem[] {
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as PendingItem[]) : [];
  } catch {
    return [];
  }
}

export function clearAll(): void {
  localStorage.removeItem(KEY);
}

export function removeFirstN(n: number): void {
  const list = readAll();
  localStorage.setItem(KEY, JSON.stringify(list.slice(n)));
} 