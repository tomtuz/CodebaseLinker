'use client'

import React, { useState, useCallback } from 'react'
import { useHonestRenderCount } from '@/hooks/useHonestRedrawCount'

export function RenderCountTestComponent2() {
  const { RenderCountVisualizer, updateVisualizer } = useHonestRenderCount(
    'TestComponent',
    true
  )
  const [count1, setCount1] = useState(0)
  const [count2, setCount2] = useState(0)
  const [text, setText] = useState('')

  const incrementCount1 = useCallback(() => {
    setCount1((prev) => prev + 1)
    updateVisualizer()
  }, [updateVisualizer])

  const incrementCount2 = useCallback(() => {
    setCount2((prev) => prev + 1)
    updateVisualizer()
  }, [updateVisualizer])

  const updateText = useCallback(() => {
    setText(Date.now().toString())
    updateVisualizer()
  }, [updateVisualizer])

  const updateAll = useCallback(() => {
    setCount1((prev) => prev + 1)
    setCount2((prev) => prev + 1)
    setText(Date.now().toString())
    updateVisualizer()
  }, [updateVisualizer])

  return (
    <div className="rounded-md border border-gray-300 p-4">
      <h2 className="mb-4 text-xl font-bold">Render Count Test Component</h2>
      <div className="mb-4">
        <RenderCountVisualizer />
      </div>
      <div className="space-y-2">
        <p>Count 1: {count1}</p>
        <p>Count 2: {count2}</p>
        <p>Text: {text}</p>
      </div>
      <div className="mt-4 space-x-2">
        <button
          onClick={incrementCount1}
          className="rounded bg-blue-500 px-4 py-2 text-white"
        >
          Increment Count 1
        </button>
        <button
          onClick={incrementCount2}
          className="rounded bg-green-500 px-4 py-2 text-white"
        >
          Increment Count 2
        </button>
        <button
          onClick={updateText}
          className="rounded bg-yellow-500 px-4 py-2 text-white"
        >
          Update Text
        </button>
        <button
          onClick={updateAll}
          className="rounded bg-red-500 px-4 py-2 text-white"
        >
          Update All
        </button>
      </div>
    </div>
  )
}
