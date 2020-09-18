import React, { FC, createContext, useState, useEffect } from 'react'

interface Props {
  visible: boolean
}

export const VisibilityContext = createContext<Props>({
  visible: true,
})

// @ts-ignore
var hidden, visibilityChange
// @ts-ignore
if (typeof document.hidden !== 'undefined') {
  // Opera 12.10 and Firefox 18 and later support
  hidden = 'hidden'
  visibilityChange = 'visibilitychange'
  // @ts-ignore
} else if (typeof document.msHidden !== 'undefined') {
  hidden = 'msHidden'
  visibilityChange = 'msvisibilitychange'
  // @ts-ignore
} else if (typeof document.webkitHidden !== 'undefined') {
  hidden = 'webkitHidden'
  visibilityChange = 'webkitvisibilitychange'
}

export const VisibilityProvider: FC = ({ children }) => {
  const [value, set] = useState({ visible: true })
  useEffect(() => {
    const handleVisibilityChange = (e: any) => {
      set({ visible: e.target.visibilityState === 'visible' })
    }

    if (
      !(
        // @ts-ignore
        (
          typeof document.addEventListener === 'undefined' ||
          // @ts-ignore
          hidden === undefined
        )
      )
    ) {
      // @ts-ignore
      document.addEventListener(visibilityChange, handleVisibilityChange, false)
    }
  }, [])
  return (
    <VisibilityContext.Provider value={value}>
      {children}
    </VisibilityContext.Provider>
  )
}
