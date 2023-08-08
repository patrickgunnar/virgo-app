import { create } from "zustand";

interface StepStore {
    step: number
    setStep: (step: number) => void
}

// use step hook to set the current step
const useStep = create<StepStore>((set) => ({
    step: 0,
    setStep: (step: number) => set({ step: step })
}))

export default useStep
