import React, { FC, ReactNode, useEffect } from 'react'
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

const hero = 40
export const Layout: FC<Props> = ({ page }) => {
  useEffect(() => {
    const so = ScrollOut({
      offset: hero,
      cssProps: true, // TODO
    })

    return so.teardown
  }, [])
  return <>{page}</>
}
