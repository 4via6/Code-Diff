import { create } from 'zustand'

interface SettingsState {
  theme: 'dark' | 'light'
  fontSize: number
  ignoreWhitespace: boolean
  ignoreCase: boolean
  wrapLines: boolean
  showUnchanged: boolean
  showSettings: boolean
  setTheme: (theme: 'dark' | 'light') => void
  setFontSize: (size: number) => void
  setIgnoreWhitespace: (ignore: boolean) => void
  setIgnoreCase: (ignore: boolean) => void
  setWrapLines: (wrap: boolean) => void
  setShowUnchanged: (show: boolean) => void
  setShowSettings: (show: boolean) => void
}

export const useSettings = create<SettingsState>((set) => ({
  theme: 'dark',
  fontSize: 14,
  ignoreWhitespace: false,
  ignoreCase: false,
  wrapLines: true,
  showUnchanged: true,
  showSettings: false,
  setTheme: (theme) => set({ theme }),
  setFontSize: (fontSize) => set({ fontSize }),
  setIgnoreWhitespace: (ignoreWhitespace) => set({ ignoreWhitespace }),
  setIgnoreCase: (ignoreCase) => set({ ignoreCase }),
  setWrapLines: (wrapLines) => set({ wrapLines }),
  setShowUnchanged: (showUnchanged) => set({ showUnchanged }),
  setShowSettings: (showSettings) => set({ showSettings }),
})) 