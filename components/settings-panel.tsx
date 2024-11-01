import React from 'react'
import { useSettings } from '@/store/settings'

export function SettingsPanel() {
  const settings = useSettings()

  return (
    <div className="p-4 bg-[#1a1a2e]/80 rounded-lg border border-[#5e3fde]/20">
      <h3 className="text-lg font-semibold mb-4">Settings</h3>
      
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <span>Theme</span>
          <select
            value={settings.theme}
            onChange={(e) => settings.setTheme(e.target.value as 'dark' | 'light')}
            className="bg-[#0B0B1E] border border-[#5e3fde]/20 rounded px-2 py-1"
          >
            <option value="dark">Dark</option>
            <option value="light">Light</option>
          </select>
        </div>

        <div className="flex items-center justify-between">
          <span>Font Size</span>
          <input
            type="range"
            min="12"
            max="20"
            value={settings.fontSize}
            onChange={(e) => settings.setFontSize(Number(e.target.value))}
            className="w-32"
          />
        </div>

        <div className="flex items-center justify-between">
          <span>Ignore Whitespace</span>
          <input
            type="checkbox"
            checked={settings.ignoreWhitespace}
            onChange={(e) => settings.setIgnoreWhitespace(e.target.checked)}
          />
        </div>

        <div className="flex items-center justify-between">
          <span>Ignore Case</span>
          <input
            type="checkbox"
            checked={settings.ignoreCase}
            onChange={(e) => settings.setIgnoreCase(e.target.checked)}
          />
        </div>

        <div className="flex items-center justify-between">
          <span>Wrap Lines</span>
          <input
            type="checkbox"
            checked={settings.wrapLines}
            onChange={(e) => settings.setWrapLines(e.target.checked)}
          />
        </div>

        <div className="flex items-center justify-between">
          <span>Show Unchanged Sections</span>
          <input
            type="checkbox"
            checked={settings.showUnchanged}
            onChange={(e) => settings.setShowUnchanged(e.target.checked)}
          />
        </div>
      </div>
    </div>
  )
} 