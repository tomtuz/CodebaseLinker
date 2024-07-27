'use client'

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from '@radix-ui/react-tooltip'
import { useRef, useEffect } from 'react'

export function useRenderCount(): number {
  const renderCount = useRef(0)

  useEffect(() => {
    renderCount.current += 1
  })

  return renderCount.current
}

// reliable, simple component for redraws
export const renderCountElement = (
  count: number,
  name: string = 'GenericElement'
) => (
  <div>
    <TooltipProvider delayDuration={0}>
      <Tooltip>
        <TooltipTrigger>
          <span className="w-[80px] bg-blue-100 text-sm font-bold outline outline-1 outline-red-300">
            {count}
          </span>
        </TooltipTrigger>
        <TooltipContent className="bg-white">
          <p>{name}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  </div>
)
