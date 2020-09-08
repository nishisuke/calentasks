import React, { FC } from 'react'

export const ScrollOutSticky: FC = ({ children }) => (
  <div className="swipesticky">
    <div data-scroll className="scrollout hoge">
      {children}
    </div>
  </div>
)
