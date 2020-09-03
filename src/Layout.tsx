import React, { FC, ReactNode, useState, useRef } from 'react'

interface Props {
  page: ReactNode
}

export const Layout: FC<Props> = ({ page }) => {
  const [scrollTop, setScrollTop] = useState(0)
  const ref = useRef<HTMLDivElement>(null)

  return (
    <div
      className="scroll-container"
      onScroll={() => setScrollTop(ref.current?.scrollTop || 0)}
      ref={ref}
    >
      {page}
    </div>
  )
}
