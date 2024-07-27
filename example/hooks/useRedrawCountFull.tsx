'use client'

import {
  useRef,
  useLayoutEffect,
  useState,
  useCallback,
  useEffect
} from 'react'

interface RenderInfo {
  count: number
  timestamp: number
  type: 'mount' | 'update' | 'hydration'
}

// const globalHistoryDisable = false
const globalHistoryDisable = true
const globalDisableComponent = true

// semi-reliable component for redraws and redraw history
export function useRenderCountFull(
  componentName: string,
  debug: boolean = false
) {
  const renderCount = useRef(0)
  const history = useRef<RenderInfo[]>([])
  const [, forceUpdate] = useState({})
  const isFirstRender = useRef(true)
  const isMounted = useRef(false)

  useLayoutEffect(() => {
    renderCount.current += 1
    const renderType = isFirstRender.current
      ? 'mount'
      : isMounted.current
        ? 'update'
        : 'hydration'
    history.current.push({
      count: renderCount.current,
      timestamp: Date.now(),
      type: renderType
    })

    if (debug) {
      console.log(
        `${componentName} render: ${renderCount.current}, type: ${renderType}`
      )
    }

    isFirstRender.current = false
    return () => {
      isMounted.current = true
    }
  })

  useEffect(() => {
    // Force an update after mount to ensure we capture any hydration render
    if (!isMounted.current) {
      forceUpdate({})
    }
  }, [])

  const updateVisualizer = useCallback(() => {
    forceUpdate({})
  }, [])

  const RenderCountVisualizer = () => (
    <div className="inline-flex items-center space-x-2 text-sm">
      <span className="font-bold">{componentName}:</span>
      <span className="rounded bg-blue-100 px-2 py-1">
        Renders: {renderCount.current}
      </span>
      {!globalHistoryDisable && (
        <span className="rounded bg-green-100 px-2 py-1">
          History:{' '}
          {history.current.map((h) => `${h.count}(${h.type[0]})`).join(', ')}
        </span>
      )}
    </div>
  )

  return {
    renderCount: renderCount.current,
    history: history.current,
    RenderCountVisualizer,
    updateVisualizer
  }
}
