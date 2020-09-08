import React, { FC } from 'react'

export const ScrollOutSticky: FC = ({ children }) => (
  <div className="swipesticky">
    <div data-scroll className="scrollout">
      {children}
    </div>
  </div>
)
