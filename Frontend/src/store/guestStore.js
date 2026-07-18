import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useGuestStore = create(
  persist(
    (set) => ({
      isGuest: true,
      assessmentAnswers: null,
      generatedRoadmap: null,
      setGuestData: (answers, roadmap) => 
        set({ isGuest: true, assessmentAnswers: answers, generatedRoadmap: roadmap }),
      clearGuestData: () => 
        set({ isGuest: false, assessmentAnswers: null, generatedRoadmap: null }),
    }),
    {
      name: 'lanpya-guest-storage',
    }
  )
);
