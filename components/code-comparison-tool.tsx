'use client'

import React, { useState, useMemo } from 'react'
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

  // ... rest of your render code ...

  return (
    <div className="min-h-screen bg-[#0B0B1E] text-white">
      {/* Your existing JSX */}
    </div>
  )
}