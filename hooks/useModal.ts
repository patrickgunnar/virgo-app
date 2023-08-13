import { create } from "zustand";


interface ModalStore {
    open: boolean
    onOpen: () => void
    onClose: () => void
}

// open close modal
const useModal = create<ModalStore>((set) => ({
    open: false,
    onOpen: () => set({ open: true }),
    onClose: () => set({ open: false })
}))

export default useModal
