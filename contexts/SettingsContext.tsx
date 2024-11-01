'use client'

import React, { createContext, useContext, useState } from 'react'

interface SettingsContextType {
  fontSize: number
  setFontSize: (size: number) => void
  ignoreWhitespace: boolean
  toggleIgnoreWhitespace: () => void
  ignoreCase: boolean
  toggleIgnoreCase: () => void
  wrapLines: boolean
  toggleWrapLines: () => void
  splitView: number
  setSplitView: (ratio: number) => void
  isLiveEdit: boolean
  toggleLiveEdit: () => void
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined)

export function SettingsProvider({ children }: { children: React.ReactNode }) {
  const [fontSize, setFontSize] = useState(14)
  const [ignoreWhitespace, setIgnoreWhitespace] = useState(false)
  const [ignoreCase, setIgnoreCase] = useState(false)
  const [wrapLines, setWrapLines] = useState(false)
  const [splitView, setSplitView] = useState(50)
  const [isLiveEdit, setIsLiveEdit] = useState(false)

  const toggleIgnoreWhitespace = () => setIgnoreWhitespace(!ignoreWhitespace)
  const toggleIgnoreCase = () => setIgnoreCase(!ignoreCase)
  const toggleWrapLines = () => setWrapLines(!wrapLines)
  const toggleLiveEdit = () => setIsLiveEdit(!isLiveEdit)

  return (
    <SettingsContext.Provider
      value={{
        fontSize,
        setFontSize,
        ignoreWhitespace,
        toggleIgnoreWhitespace,
        ignoreCase,
        toggleIgnoreCase,
        wrapLines,
        toggleWrapLines,
        splitView,
        setSplitView,
        isLiveEdit,
        toggleLiveEdit,
      }}
    >
      {children}
    </SettingsContext.Provider>
  )
}

export const useSettings = () => {
  const context = useContext(SettingsContext)
  if (context === undefined) {
    throw new Error('useSettings must be used within a SettingsProvider')
  }
  return context
} 