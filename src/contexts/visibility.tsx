import React, { FC, createContext, useState, useEffect } from 'react'

interface Props {
  visible: boolean
}

export const VisibilityContext = createContext<Props>({
  visible: true,
})

// @ts-ignore
let hidden: string | undefined = undefined
let visibilityChange: string | undefined = undefined

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
  const handleVisibilityChange = (e: any) => {
    set({ visible: e.target.visibilityState === 'visible' })
  }

  useEffect(() => {
    let cb = () => {}
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
      // @ts-ignore
      cb = () =>
        // @ts-ignore
        document.removeEventListener(
          // @ts-ignore
          visibilityChange,
          handleVisibilityChange,
          false
        )
    }
    return cb
  }, [])
  return (
    <VisibilityContext.Provider value={value}>
      {children}
    </VisibilityContext.Provider>
  )
}
