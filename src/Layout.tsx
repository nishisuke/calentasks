import React, { FC, useCallback, ReactNode, useEffect, useRef } from 'react'
// @ts-ignore
import ScrollOut from 'scroll-out'

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
  const listener = useCallback(
    () => (window.currentScrollTop = ref.current?.scrollTop || 0),
    []
  )

  useEffect(() => {
    ScrollOut({
      scrollingElement: '.scroll-container',
      cssProps: true, // TODO
    })
    ref.current?.addEventListener('scroll', listener, { passive: true })
    return () => ref.current?.removeEventListener('scroll', listener, false)
  }, [])
  return (
    <>
      <div className="scroll-container" ref={ref}>
        {page}
        <div style={{ height: '500px' }} />
      </div>
    </>
  )
}
