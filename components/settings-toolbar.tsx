'use client'

import React from 'react'
import { useSettings } from '@/contexts/SettingsContext'

export function SettingsToolbar() {
  const {
    fontSize,
    setFontSize,
    ignoreWhitespace,
    toggleIgnoreWhitespace,
    ignoreCase,
    toggleIgnoreCase,
    wrapLines,
    toggleWrapLines,
    isLiveEdit,
    toggleLiveEdit,
  } = useSettings()

  const buttonClasses = `
    min-h-[44px] px-4 py-2 rounded-md text-sm font-medium
    transition-all duration-200
    bg-[#2d2d5b] text-white
    hover:bg-[#3d3d6b] hover:shadow-lg hover:scale-105
    active:bg-[#5e3fde] active:scale-100
    focus:outline-none focus:ring-2 focus:ring-[#5e3fde]/50
  `

  const activeButtonClasses = `
    min-h-[44px] px-4 py-2 rounded-md text-sm font-medium
    transition-all duration-200
    bg-[#5e3fde] text-white
    hover:bg-[#4e35b5] hover:shadow-lg hover:scale-105
    active:scale-100
    focus:outline-none focus:ring-2 focus:ring-[#5e3fde]/50
  `

  return (
    <div className="flex flex-col sm:flex-row flex-wrap gap-3 p-4 bg-[#1E1E3F] text-white border border-[#5e3fde]/30 rounded-lg mb-6 shadow-lg">
      {/* Container with center alignment on larger screens */}
      <div className="w-full flex flex-col sm:flex-row items-start sm:items-center justify-start lg:justify-center gap-3">
        {/* Font Size Control */}
        <div className="w-full sm:w-auto flex items-center gap-3 p-3 rounded-md bg-[#2d2d5b]">
          <label className="text-sm font-medium whitespace-nowrap min-w-[70px]">Font Size:</label>
          <input
            type="range"
            min="14"
            max="24"
            step="2"
            value={fontSize}
            onChange={(e) => setFontSize(Number(e.target.value))}
            className="flex-1 sm:w-24 accent-[#5e3fde] h-2 rounded-lg"
          />
          <span className="text-sm font-mono min-w-[45px] text-right">{fontSize}px</span>
        </div>

        {/* Button Group */}
        <div className="grid grid-cols-2 sm:flex gap-3 w-full sm:w-auto">
          <button
            onClick={toggleWrapLines}
            className={wrapLines ? activeButtonClasses : buttonClasses}
          >
            Wrap Lines
          </button>

          <button
            onClick={toggleIgnoreWhitespace}
            className={ignoreWhitespace ? activeButtonClasses : buttonClasses}
          >
            Ignore Whitespace
          </button>

          <button
            onClick={toggleIgnoreCase}
            className={ignoreCase ? activeButtonClasses : buttonClasses}
          >
            Ignore Case
          </button>

          <button
            onClick={toggleLiveEdit}
            className={isLiveEdit ? activeButtonClasses : buttonClasses}
          >
            Live Edit
          </button>
        </div>
      </div>
    </div>
  )
} 