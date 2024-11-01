'use client'

import React, { useState, useMemo, useEffect } from 'react'
import hljs from 'highlight.js'
import 'highlight.js/styles/github-dark.css'
import * as diff from 'diff'
import { toast } from 'sonner'
import { useSettings } from '@/contexts/SettingsContext'
import { SettingsToolbar } from './settings-toolbar'

export function CodeComparisonToolComponent() {
  const [leftContent, setLeftContent] = useState('')
  const [rightContent, setRightContent] = useState('')
  const [copyStatus, setCopyStatus] = useState<{ [key: string]: boolean }>({})
  const { 
    fontSize, 
    wrapLines, 
    ignoreWhitespace, 
    ignoreCase,
    isLiveEdit 
  } = useSettings()

  const handleLeftChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setLeftContent(e.target.value)
  }

  const handleRightChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setRightContent(e.target.value)
  }

  const differences = useMemo(() => {
    try {
      if (!leftContent || !rightContent) return []

      // Normalize line endings and handle potential null/undefined
      const normalizeText = (text: string = '') => {
        try {
          return text.replace(/\r\n/g, '\n')
        } catch (e) {
          console.error('Normalization error:', e)
          return text
        }
      }
        
      let leftText = normalizeText(leftContent)
      let rightText = normalizeText(rightContent)

      // Safe text processing
      if (ignoreWhitespace) {
        const trimLines = (text: string) => {
          try {
            return text.split('\n')
              .map(line => line?.trim() || '')
              .join('\n')
          } catch (e) {
            console.error('Trim error:', e)
            return text
          }
        }
        leftText = trimLines(leftText)
        rightText = trimLines(rightText)
      }

      if (ignoreCase) {
        leftText = leftText.toLowerCase()
        rightText = rightText.toLowerCase()
      }

      // Safe diff calculation
      try {
        const diffResult = diff.diffLines(leftText, rightText, {
          ignoreWhitespace,
          ignoreCase,
          newlineIsToken: true,
        })

        return diffResult.map(part => ({
          ...part,
          value: part.value?.replace(/\n$/, '') || '',
          lines: part.value?.split('\n') || [''],
        }))
      } catch (diffError) {
        console.error('Diff calculation error:', diffError)
        return []
      }

    } catch (error) {
      console.error('General diff error:', error)
      toast.error('Error comparing texts. Please check your input.')
      return []
    }
  }, [leftContent, rightContent, ignoreWhitespace, ignoreCase])

  // Update the diff count calculation
  const diffCount = useMemo(() => {
    return differences.reduce((count, part) => {
      if (part.added || part.removed) {
        return count + part.lines.length
      }
      return count
    }, 0)
  }, [differences])

  // Improved copy functionality
  const handleCopyDiff = async (content: string, side: 'left' | 'right') => {
    if (!content) {
      toast.error('No content to copy')
      return
    }

    try {
      // First try the modern clipboard API
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(content)
        setCopyStatus(prev => ({ ...prev, [side]: true }))
        toast.success('Content copied to clipboard')
      } else {
        // Fallback for older browsers or non-HTTPS
        const textArea = document.createElement('textarea')
        textArea.value = content
        document.body.appendChild(textArea)
        textArea.select()
        try {
          document.execCommand('copy')
          setCopyStatus(prev => ({ ...prev, [side]: true }))
          toast.success('Content copied to clipboard')
        } catch (err) {
          toast.error('Failed to copy. Please use Ctrl+C/Cmd+C')
        }
        document.body.removeChild(textArea)
      }
      
      setTimeout(() => {
        setCopyStatus(prev => ({ ...prev, [side]: false }))
      }, 2000)
    } catch (err) {
      console.error('Copy failed:', err)
      // More user-friendly error message
      toast.error('Unable to copy automatically. Please try selecting the text manually')
    }
  }

  // Improved paste functionality
  const handlePaste = async (side: 'left' | 'right') => {
    try {
      let pastedText = ''

      // First try the modern clipboard API
      if (navigator.clipboard && window.isSecureContext) {
        pastedText = await navigator.clipboard.readText()
      } else {
        // Fallback for older browsers or non-HTTPS
        const textArea = document.createElement('textarea')
        document.body.appendChild(textArea)
        textArea.focus()
        try {
          document.execCommand('paste')
          pastedText = textArea.value
        } catch (err) {
          toast.error('Please use Ctrl+V/Cmd+V to paste')
        }
        document.body.removeChild(textArea)
      }

      if (pastedText) {
        if (side === 'left') {
          setLeftContent(pastedText)
        } else {
          setRightContent(pastedText)
        }
        toast.success('Content pasted successfully')
      } else {
        toast.error('No content in clipboard')
      }
    } catch (err) {
      console.error('Paste failed:', err)
      toast.error('Please try pasting manually using Ctrl+V/Cmd+V')
    }
  }

  const baseTextStyle = {
    fontSize: `${fontSize}px`,
    lineHeight: `${fontSize * 1.5}px`,
    fontFamily: 'var(--font-geist-mono)',
  }

  // Add this function before the renderDiff function
  const getLineHighlight = (lineNumber: number) => {
    let currentLine = 0
    for (const part of differences) {
      const lineCount = part.lines.length
      if (lineNumber >= currentLine && lineNumber < currentLine + lineCount) {
        if (part.added) {
          return {
            backgroundColor: 'rgba(46, 160, 67, 0.3)',
            display: 'block',
            width: '100%',
          }
        } else if (part.removed) {
          return {
            backgroundColor: 'rgba(248, 81, 73, 0.3)',
            display: 'block',
            width: '100%',
          }
        }
      }
      currentLine += lineCount
    }
    return {}
  }

  // Update the highlight.js initialization
  useEffect(() => {
    try {
      if (leftContent || rightContent) {
        setTimeout(() => {
          hljs.highlightAll()
        }, 0)
      }
    } catch (error) {
      console.error('Highlight error:', error)
    }
  }, [leftContent, rightContent])

  // Update the renderDiff function with error boundary
  const renderDiff = (content: string, side: 'left' | 'right') => {
    try {
      const lines = (content || '').split('\n')

      if (isLiveEdit) {
        const minHeight = Math.max(300, lines.length * (fontSize * 1.5) + 32)

        return (
          <div className="relative">
            <div 
              className="absolute left-0 top-0 bottom-0 w-12 bg-[#1E1E3F] text-gray-400 select-none z-10"
              style={{
                ...baseTextStyle,
                minHeight: `${minHeight}px`,
              }}
            >
              {lines.map((_, i) => (
                <div 
                  key={i} 
                  className="text-right pr-2 leading-[1.5]"
                  style={{ height: `${fontSize * 1.5}px` }}
                >
                  {i + 1}
                </div>
              ))}
            </div>
            <div className="relative">
              <textarea
                value={content}
                onChange={(e) => {
                  if (side === 'left') {
                    handleLeftChange(e)
                  } else {
                    handleRightChange(e)
                  }
                }}
                onInput={(e) => {
                  const target = e.target as HTMLTextAreaElement
                  target.style.height = 'auto'
                  target.style.height = `${target.scrollHeight}px`
                }}
                style={{
                  ...baseTextStyle,
                  padding: '1rem 1rem 1rem 3.5rem',
                  width: '100%',
                  minHeight: `${minHeight}px`,
                  height: 'auto',
                  backgroundColor: 'transparent',
                  color: 'white',
                  border: 'none',
                  overflow: 'hidden',
                }}
                className={`focus:outline-none focus:ring-1 focus:ring-[#5e3fde]/50 
                  ${wrapLines ? 'whitespace-pre-wrap' : 'whitespace-pre'}
                  bg-gradient-to-b from-[#1E1E3F]/50 to-[#1E1E3F]/30
                  backdrop-blur-sm transition-all duration-200
                  hover:bg-[#1E1E3F]/60
                  font-mono`}
                spellCheck="false"
                autoComplete="off"
                autoCorrect="off"
                autoCapitalize="off"
              />
            </div>
          </div>
        )
      }

      return (
        <div className="relative">
          <div 
            className="absolute left-0 top-0 bottom-0 w-12 bg-[#1E1E3F] text-gray-400 select-none z-10"
            style={baseTextStyle}
          >
            {lines.map((_, i) => (
              <div 
                key={i} 
                className="text-right pr-2 leading-[1.5]"
                style={{ height: `${fontSize * 1.5}px` }}
              >
                {i + 1}
              </div>
            ))}
          </div>
          <pre className="m-0 p-0 bg-transparent">
            <code
              className="hljs"
              style={{
                ...baseTextStyle,
                margin: 0,
                padding: '1rem 1rem 1rem 3.5rem',
                backgroundColor: 'transparent',
                whiteSpace: wrapLines ? 'pre-wrap' : 'pre',
                display: 'block',
              }}
            >
              {content}
            </code>
          </pre>
          {/* Add diff highlighting overlay */}
          <div 
            className="absolute top-0 left-0 right-0 bottom-0 pointer-events-none"
            style={{
              ...baseTextStyle,
              padding: '1rem 1rem 1rem 3.5rem',
            }}
          >
            {lines.map((_, i) => (
              <div
                key={i}
                style={getLineHighlight(i)}
                className="h-[1.5em]"
              />
            ))}
          </div>
        </div>
      )
    } catch (error) {
      console.error('Render error:', error)
      return (
        <div className="p-4 text-red-400">
          Error rendering content. Please check your input.
        </div>
      )
    }
  }

  const showDiff = leftContent.trim() !== '' && rightContent.trim() !== ''

  const getLineCount = (content: string): number => {
    return content.split('\n').length;
  }

  // Common button styles
  const actionButtonClasses = `
    flex-1 sm:flex-none px-4 py-2 rounded-md text-sm font-medium
    transition-all duration-200 flex items-center justify-center gap-2
    bg-[#2d2d5b] text-white
    hover:bg-[#3d3d6b] hover:shadow-lg hover:scale-105
    active:bg-[#5e3fde] active:scale-100
    focus:outline-none focus:ring-2 focus:ring-[#5e3fde]/50
    disabled:opacity-50 disabled:hover:scale-100 disabled:hover:shadow-none
  `

  // Add error boundary for the entire component
  const [hasError, setHasError] = useState(false)

  useEffect(() => {
    const handleError = (event: ErrorEvent) => {
      console.error('Global error:', event.error)
      setHasError(true)
      toast.error('An error occurred. Please try refreshing the page.')
    }

    window.addEventListener('error', handleError)
    return () => window.removeEventListener('error', handleError)
  }, [])

  if (hasError) {
    return (
      <div className="min-h-screen bg-[#0B0B1E] text-white flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Something went wrong</h2>
          <button 
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-[#5e3fde] rounded-md hover:bg-[#4e35b5]"
          >
            Refresh Page
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#0B0B1E] text-white flex flex-col">
      {/* Hero Section */}
      <div className="relative overflow-hidden py-12 sm:py-16 md:py-20 lg:py-24 px-4 sm:px-6 lg:px-8 mb-8 sm:mb-12 bg-gradient-to-b from-[#0B0B1E] to-[#1a1a2e]">
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

      {/* Main Content */}
      <div className="flex-grow w-full max-w-[90rem] mx-auto px-4 sm:px-6 lg:px-8 pb-8 sm:pb-12 lg:pb-16">
        <SettingsToolbar />
        
        {!isLiveEdit && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8 mb-8 sm:mb-12">
            <div className="flex flex-col">
              <label 
                htmlFor="leftInput" 
                className="mb-2 flex justify-between backdrop-blur-lg bg-[#1a1a2e]/50 p-3 rounded-t-lg border border-[#5e3fde]/20"
              >
                <span>Original Code</span>
                {leftContent && <span className="ml-2">Lines: {getLineCount(leftContent)}</span>}
              </label>
              <div className="relative">
                <textarea
                  id="leftInput"
                  style={baseTextStyle}
                  className={`w-full h-[32rem] p-4 rounded-lg transition-colors duration-200 font-mono
                    bg-[#1E1E3F] text-white border-[#5e3fde]/20 
                    border focus:outline-none focus:ring-2 focus:ring-[#5e3fde]/50 resize-none
                    ${wrapLines ? 'whitespace-pre-wrap' : 'whitespace-pre'}
                    sm:text-base`}
                  value={leftContent}
                  onChange={handleLeftChange}
                  placeholder="Paste your code or text here..."
                />
                <button
                  onClick={() => handlePaste('left')}
                  className={`absolute bottom-4 right-4 px-3 sm:px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 flex items-center justify-center gap-2 bg-[#5e3fde] text-white hover:bg-[#4e35b5] active:bg-[#3d2a8f] focus:outline-none focus:ring-2 focus:ring-[#5e3fde]/50 shadow-sm`}
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                  Paste
                </button>
              </div>
            </div>
            <div className="flex flex-col">
              <label 
                htmlFor="rightInput" 
                className="mb-2 flex justify-between backdrop-blur-lg bg-[#1a1a2e]/50 p-3 rounded-t-lg border border-[#5e3fde]/20"
              >
                <span>Modified Code</span>
                {rightContent && <span className="ml-2">Lines: {getLineCount(rightContent)}</span>}
              </label>
              <div className="relative">
                <textarea
                  id="rightInput"
                  style={baseTextStyle}
                  className={`w-full h-[32rem] p-4 rounded-lg transition-colors duration-200 font-mono
                    bg-[#1E1E3F] text-white border-[#5e3fde]/20 
                    border focus:outline-none focus:ring-2 focus:ring-[#5e3fde]/50 resize-none
                    ${wrapLines ? 'whitespace-pre-wrap' : 'whitespace-pre'}
                    sm:text-base`}
                  value={rightContent}
                  onChange={handleRightChange}
                  placeholder="Paste your code or text here..."
                />
                <button
                  onClick={() => handlePaste('right')}
                  className={`absolute bottom-4 right-4 px-3 sm:px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 flex items-center justify-center gap-2 bg-[#5e3fde] text-white hover:bg-[#4e35b5] active:bg-[#3d2a8f] focus:outline-none focus:ring-2 focus:ring-[#5e3fde]/50 shadow-sm`}
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                  Paste
                </button>
              </div>
            </div>
          </div>
        )}

        {(showDiff || isLiveEdit) && (
          <div className="bg-[#1a1a2e]/80 rounded-lg overflow-hidden border border-[#5e3fde]/20 shadow-xl">
            <div className="p-4 sm:p-6 border-b border-[#5e3fde]/20 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
              <div className="text-xl font-semibold">
                Differences: <span className="text-[#5e3fde]">{diffCount}</span>
              </div>
              <div className="flex gap-3 w-full sm:w-auto">
                <button
                  onClick={() => handleCopyDiff(leftContent, 'left')}
                  className={actionButtonClasses}
                  disabled={copyStatus['left']}
                >
                  {copyStatus['left'] ? (
                    <>
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      Copied!
                    </>
                  ) : (
                    <>
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
                      </svg>
                      Copy Original
                    </>
                  )}
                </button>
                <button
                  onClick={() => handleCopyDiff(rightContent, 'right')}
                  className={actionButtonClasses}
                  disabled={copyStatus['right']}
                >
                  {copyStatus['right'] ? (
                    <>
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      Copied!
                    </>
                  ) : (
                    <>
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
                      </svg>
                      Copy Modified
                    </>
                  )}
                </button>
              </div>
            </div>
            
            {/* Update the grid container with better spacing */}
            <div className={`grid grid-cols-1 lg:grid-cols-2 gap-6 
              ${isLiveEdit ? 'p-4 sm:p-6' : 'divide-y lg:divide-y-0 lg:divide-x'} 
              divide-[#5e3fde]/20`}
            >
              <div className={`overflow-x-auto ${
                isLiveEdit 
                  ? 'bg-[#1E1E3F]/20 rounded-lg p-3 sm:p-4 border border-[#5e3fde]/10' 
                  : ''
              }`}>
                {renderDiff(leftContent, 'left')}
              </div>
              <div className={`overflow-x-auto ${
                isLiveEdit 
                  ? 'bg-[#1E1E3F]/20 rounded-lg p-3 sm:p-4 border border-[#5e3fde]/10' 
                  : ''
              }`}>
                {renderDiff(rightContent, 'right')}
              </div>
            </div>
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