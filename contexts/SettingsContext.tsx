'use client'

import React, { createContext, useContext, useState } from 'react'

interface SettingsContextType {
  fontSize: number
  setFontSize: (size: number) => void
  wrapLines: boolean
  toggleWrapLines: () => void
  ignoreWhitespace: boolean
  toggleIgnoreWhitespace: () => void
  ignoreCase: boolean
  toggleIgnoreCase: () => void
  isLiveEdit: boolean
  toggleLiveEdit: () => void
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined)

export function SettingsProvider({ children }: { children: React.ReactNode }) {
  const [fontSize, setFontSize] = useState(14)
  const [wrapLines, setWrapLines] = useState(false)
  const [ignoreWhitespace, setIgnoreWhitespace] = useState(false)
  const [ignoreCase, setIgnoreCase] = useState(false)
  const [isLiveEdit, setIsLiveEdit] = useState(false)

  const toggleWrapLines = () => setWrapLines(!wrapLines)
  const toggleIgnoreWhitespace = () => setIgnoreWhitespace(!ignoreWhitespace)
  const toggleIgnoreCase = () => setIgnoreCase(!ignoreCase)
  const toggleLiveEdit = () => setIsLiveEdit(!isLiveEdit)

  return (
    <SettingsContext.Provider
      value={{
        fontSize,
        setFontSize,
        wrapLines,
        toggleWrapLines,
        ignoreWhitespace,
        toggleIgnoreWhitespace,
        ignoreCase,
        toggleIgnoreCase,
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