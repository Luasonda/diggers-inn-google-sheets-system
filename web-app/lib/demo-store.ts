export type DemoRecord = {
  id: string;
  createdAt: string;
  payload: Record<string, unknown>;
};

const memoryStore = {
  openingCounts: [] as DemoRecord[],
  closingCounts: [] as DemoRecord[],
  stockIssues: [] as DemoRecord[],
};

export function insertDemoRecord(kind: keyof typeof memoryStore, payload: Record<string, unknown>) {
  const record = {
    id: crypto.randomUUID(),
    createdAt: new Date().toISOString(),
    payload,
  };
  memoryStore[kind].unshift(record);
  return record;
}

export function listDemoRecords(kind: keyof typeof memoryStore) {
  return memoryStore[kind].slice(0, 20);
}
