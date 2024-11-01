'use client'

import React from 'react'
import { useSettings } from '@/contexts/SettingsContext'

export function SettingsToolbar() {
  const {
    fontSize,
    setFontSize,
    wrapLines,
    toggleWrapLines,
    ignoreWhitespace,
    toggleIgnoreWhitespace,
    ignoreCase,
    toggleIgnoreCase,
    isLiveEdit,
    toggleLiveEdit
  } = useSettings()

  return (
    <div className="flex flex-wrap gap-3 p-4 bg-[#1E1E3F] text-white border border-[#5e3fde]/30 rounded-lg mb-6 shadow-lg">
      <div className="flex items-center gap-3 px-4 py-2 rounded-md bg-[#2d2d5b] min-w-[200px]">
        <label className="text-sm font-medium whitespace-nowrap">Font Size:</label>
        <input
          type="range"
          min="14"
          max="24"
          step="2"
          value={fontSize}
          onChange={(e) => setFontSize(Number(e.target.value))}
          className="w-24 accent-[#5e3fde]"
        />
        <span className="text-sm font-mono min-w-[45px]">{fontSize}px</span>
      </div>

      <button
        onClick={toggleWrapLines}
        className={`px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
          wrapLines ? 'bg-[#5e3fde]' : 'bg-[#2d2d5b] hover:bg-[#3d3d6b]'
        }`}
      >
        Wrap Lines
      </button>

      <button
        onClick={toggleIgnoreWhitespace}
        className={`px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
          ignoreWhitespace ? 'bg-[#5e3fde]' : 'bg-[#2d2d5b] hover:bg-[#3d3d6b]'
        }`}
      >
        Ignore Whitespace
      </button>

      <button
        onClick={toggleIgnoreCase}
        className={`px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
          ignoreCase ? 'bg-[#5e3fde]' : 'bg-[#2d2d5b] hover:bg-[#3d3d6b]'
        }`}
      >
        Ignore Case
      </button>

      <button
        onClick={toggleLiveEdit}
        className={`px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
          isLiveEdit ? 'bg-[#5e3fde]' : 'bg-[#2d2d5b] hover:bg-[#3d3d6b]'
        }`}
      >
        Live Edit
      </button>
    </div>
  )
} 