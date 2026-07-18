import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useGuestStore = create(
  persist(
    (set) => ({
      isGuest: true,
      assessmentAnswers: null,
      savedAiRoadmaps: [],
      setGuestData: (answers, roadmap) => 
        set((state) => {
          const newRoadmap = { ...roadmap, _id: `custom-ai-${Date.now()}` };
          // Ensure backwards compatibility if generatedRoadmap exists from old state
          const existing = Array.isArray(state.savedAiRoadmaps) 
            ? state.savedAiRoadmaps 
            : (state.generatedRoadmap ? [state.generatedRoadmap] : []);
          return {
            isGuest: true,
            assessmentAnswers: answers,
            savedAiRoadmaps: [...existing, newRoadmap]
          };
        }),
      clearGuestData: () => 
        set({ isGuest: false, assessmentAnswers: null, savedAiRoadmaps: [] }),
    }),
    {
      name: 'lanpya-guest-storage',
    }
  )
);
