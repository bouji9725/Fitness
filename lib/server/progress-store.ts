import type { BodyStatsEntry } from "@/types/progress";

declare global {
  // Temporary server-side progress store.
  // This will later be replaced by database persistence.
  // eslint-disable-next-line no-var
  var __fitnessProgressStore: BodyStatsEntry[] | undefined;
}

function getStore(): BodyStatsEntry[] {
  if (!globalThis.__fitnessProgressStore) {
    globalThis.__fitnessProgressStore = [];
  }

  return globalThis.__fitnessProgressStore;
}

export const progressStore = {
  listEntries(): BodyStatsEntry[] {
    return [...getStore()].sort((a, b) => {
      return new Date(b.date).getTime() - new Date(a.date).getTime();
    });
  },

  addEntry(entry: BodyStatsEntry): BodyStatsEntry[] {
    const currentEntries = getStore();

    globalThis.__fitnessProgressStore = [entry, ...currentEntries];

    return this.listEntries();
  },
};