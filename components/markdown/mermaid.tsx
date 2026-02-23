'use client'

import clsx from 'clsx'
import mermaid from 'mermaid'
import React, { useCallback, useEffect, useMemo, useRef } from 'react'

interface MermaidProps {
  chart: string
  className?: string
}

mermaid.initialize({
  theme: 'neutral',
})

// Sequential render queue prevents concurrent mermaid.render() race conditions
let renderQueue: Promise<void> = Promise.resolve()

const Mermaid = ({ chart, className }: MermaidProps) => {
  const ref = useRef<HTMLDivElement | null>(null)
  const [svg, setSvg] = React.useState<string>('')

  const renderMermaid = useCallback(async () => {
    if (!ref.current || !chart) return

    renderQueue = renderQueue.then(async () => {
      try {
        const id = `mermaid-${Math.random().toString(36).substring(7)}`
        const { svg: renderedSvg } = await mermaid.render(id, chart)
        setSvg(renderedSvg)
      } catch (error) {
        console.error('Mermaid diagram render error:', error)
        if (ref.current) {
          ref.current.innerHTML = `<pre>${chart}</pre>`
        }
      }
    })
  }, [chart])

  const memoizedClassName = useMemo(() => clsx('mermaid', className), [className])

  useEffect(() => {
    renderMermaid()
  }, [renderMermaid])

  return (
    <div className={memoizedClassName} ref={ref} dangerouslySetInnerHTML={{ __html: svg }} />
  )
}

const MermaidMemo = React.memo(Mermaid)
export default MermaidMemo
