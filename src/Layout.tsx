import React, { FC, ReactNode } from 'react'

interface Props {
  page: ReactNode
}

export const Layout: FC<Props> = ({ page }) => {
  return <>{page}</>
}
