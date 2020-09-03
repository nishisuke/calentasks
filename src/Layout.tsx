import React, { FC, ReactNode, useRef } from 'react'

interface Props {
  page: ReactNode
}

declare global {
  interface Window {
    currentScrollTop: number
  }
}

export const Layout: FC<Props> = ({ page }) => {
  const ref = useRef<HTMLDivElement>(null)

  return (
    <div
      className="scroll-container"
      onScroll={() => (window.currentScrollTop = ref.current?.scrollTop || 0)}
      ref={ref}
    >
      {page}
    </div>
  )
}
