import React, { FC } from 'react'

export const ScrollOutSticky: FC = ({ children }) => (
  <div data-scroll className="swipesticky">
    <div>{children}</div>
  </div>
)
