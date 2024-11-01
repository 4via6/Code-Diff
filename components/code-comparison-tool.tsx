'use client'

import React, { useState, useMemo, useEffect } from 'react'
import hljs from 'highlight.js'
import 'highlight.js/styles/github-dark.css'
import * as diff from 'diff'
import { toast } from 'sonner'
import { useSettings } from '@/contexts/SettingsContext'
import { SettingsToolbar } from './settings-toolbar'

export function CodeComparisonToolComponent() {
  useEffect(() => {
    console.log('Component mounted')
  }, [])

  const [leftContent, setLeftContent] = useState('')
  const [rightContent, setRightContent] = useState('')
  const [copyStatus, setCopyStatus] = useState<{ [key: string]: boolean }>({})
  const { fontSize, wrapLines, ignoreWhitespace, ignoreCase } = useSettings()

  const handleLeftChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setLeftContent(e.target.value)
  }

  const handleRightChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setRightContent(e.target.value)
  }

  const handleCopyDiff = async (content: string, side: 'left' | 'right') => {
    try {
      await navigator.clipboard.writeText(content)
      setCopyStatus({ ...copyStatus, [side]: true })
      toast.success('Content copied to clipboard')
      setTimeout(() => {
        setCopyStatus({ ...copyStatus, [side]: false })
      }, 2000)
    } catch {
      toast.error('Failed to copy. Please try manually')
    }
  }

  const handlePaste = async (side: 'left' | 'right') => {
    try {
      const text = await navigator.clipboard.readText()
      if (side === 'left') {
        setLeftContent(text)
      } else {
        setRightContent(text)
      }
      toast.success('Content pasted successfully')
    } catch {
      toast.error('Failed to paste. Please try manually')
    }
  }

  const differences = useMemo(() => {
    try {
      if (!leftContent || !rightContent) return []

      let leftText = leftContent.replace(/\r\n/g, '\n')
      let rightText = rightContent.replace(/\r\n/g, '\n')

      if (ignoreWhitespace) {
        leftText = leftText.split('\n').map(line => line.trim()).join('\n')
        rightText = rightText.split('\n').map(line => line.trim()).join('\n')
      }

      if (ignoreCase) {
        leftText = leftText.toLowerCase()
        rightText = rightText.toLowerCase()
      }

      return diff.diffLines(leftText, rightText, {
        ignoreWhitespace,
        ignoreCase,
        newlineIsToken: true,
      })
    } catch (error) {
      console.error('Diff error:', error)
      return []
    }
  }, [leftContent, rightContent, ignoreWhitespace, ignoreCase])

  const getLineCount = (content: string): number => {
    return content.split('\n').length
  }

  return (
    <div className="min-h-screen bg-[#0B0B1E] text-white">
      <div className="relative overflow-hidden py-24 px-6 mb-12 bg-gradient-to-b from-[#0B0B1E] to-[#1a1a2e]">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-[url('/stars.jpg')] opacity-20"></div>
          <div className="absolute inset-0 bg-gradient-to-r from-[#5e3fde]/20 to-transparent"></div>
        </div>
        <div className="relative max-w-7xl mx-auto">
          <div className="text-center">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-4 sm:mb-6 bg-gradient-to-r from-[#5e3fde] to-[#a890fe] text-transparent bg-clip-text">
              Code Diff Tool
            </h1>
            <p className="text-lg sm:text-xl text-gray-300 max-w-2xl mx-auto px-4">
              Compare code changes, detect differences, and analyze modifications with ease
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-[90rem] mx-auto px-4 sm:px-6 lg:px-8 pb-8 sm:pb-12 lg:pb-16">
        <SettingsToolbar />
        
        {/* Input sections */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8 mb-8">
          {/* Left input */}
          <div className="flex flex-col">
            <label className="mb-2 flex justify-between backdrop-blur-lg bg-[#1a1a2e]/50 p-3 rounded-t-lg border border-[#5e3fde]/20">
              <span>Original Code</span>
              {leftContent && <span>Lines: {getLineCount(leftContent)}</span>}
            </label>
            <div className="relative">
              <textarea
                value={leftContent}
                onChange={handleLeftChange}
                className="w-full h-[32rem] p-4 bg-[#1E1E3F] text-white border-[#5e3fde]/20 rounded-b-lg border focus:outline-none focus:ring-2 focus:ring-[#5e3fde]/50 resize-none font-mono"
                placeholder="Paste your code here..."
                style={{ fontSize: `${fontSize}px` }}
              />
              <button
                onClick={() => handlePaste('left')}
                className="absolute bottom-4 right-4 px-4 py-2 bg-[#5e3fde] text-white rounded-md hover:bg-[#4e35b5]"
              >
                Paste
              </button>
            </div>
          </div>

          {/* Right input */}
          <div className="flex flex-col">
            <label className="mb-2 flex justify-between backdrop-blur-lg bg-[#1a1a2e]/50 p-3 rounded-t-lg border border-[#5e3fde]/20">
              <span>Modified Code</span>
              {rightContent && <span>Lines: {getLineCount(rightContent)}</span>}
            </label>
            <div className="relative">
              <textarea
                value={rightContent}
                onChange={handleRightChange}
                className="w-full h-[32rem] p-4 bg-[#1E1E3F] text-white border-[#5e3fde]/20 rounded-b-lg border focus:outline-none focus:ring-2 focus:ring-[#5e3fde]/50 resize-none font-mono"
                placeholder="Paste your code here..."
                style={{ fontSize: `${fontSize}px` }}
              />
              <button
                onClick={() => handlePaste('right')}
                className="absolute bottom-4 right-4 px-4 py-2 bg-[#5e3fde] text-white rounded-md hover:bg-[#4e35b5]"
              >
                Paste
              </button>
            </div>
          </div>
        </div>

        {/* Differences section */}
        {differences.length > 0 && (
          <div className="bg-[#1a1a2e]/80 rounded-lg overflow-hidden border border-[#5e3fde]/20 shadow-xl">
            {/* ... your diff display code ... */}
          </div>
        )}
      </div>

      {/* Footer */}
      <footer className="mt-auto py-6 px-4 border-t border-[#5e3fde]/20">
        <div className="max-w-[90rem] mx-auto flex justify-center items-center text-sm text-gray-400">
          <span>Built with ❤️ by{' '}</span>
          <a 
            href="https://anuragvishwakarma.webflow.io/" 
            target="_blank" 
            rel="noopener noreferrer"
            className="ml-1 text-[#5e3fde] hover:text-[#7e63fe] transition-colors duration-200 no-underline"
          >
            Anurag Vishwakarma
          </a>
        </div>
      </footer>
    </div>
  )
}