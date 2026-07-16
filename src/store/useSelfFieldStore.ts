import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Feedback, MirrorInsight, SelfFieldArchive, Snapshot } from '../types'

interface SelfFieldState {
  snapshots: Snapshot[]
  addSnapshot: (snapshot: Snapshot) => void
  setFeedback: (snapshotId: string, insightId: MirrorInsight['id'], feedback: Feedback) => void
  removeSnapshot: (snapshotId: string) => void
  replaceSnapshots: (snapshots: Snapshot[]) => void
  clearAll: () => void
}

export const useSelfFieldStore = create<SelfFieldState>()(
  persist(
    (set) => ({
      snapshots: [],
      addSnapshot: (snapshot) => set((state) => ({ snapshots: [snapshot, ...state.snapshots] })),
      setFeedback: (snapshotId, insightId, feedback) =>
        set((state) => ({
          snapshots: state.snapshots.map((snapshot) =>
            snapshot.id === snapshotId
              ? { ...snapshot, feedback: { ...snapshot.feedback, [insightId]: feedback } }
              : snapshot,
          ),
        })),
      removeSnapshot: (snapshotId) =>
        set((state) => ({ snapshots: state.snapshots.filter((snapshot) => snapshot.id !== snapshotId) })),
      replaceSnapshots: (snapshots) => set({ snapshots }),
      clearAll: () => set({ snapshots: [] }),
    }),
    {
      name: 'selffield.archive.v1',
      version: 1,
      partialize: (state) => ({ snapshots: state.snapshots }),
    },
  ),
)

export function createArchive(snapshots: Snapshot[]): SelfFieldArchive {
  return {
    product: 'SelfField',
    version: 1,
    exportedAt: new Date().toISOString(),
    snapshots,
  }
}
