import React, { FC, createContext, useState, useEffect } from 'react'

interface Props {
  updatedAt: number
}

export const IntervalContext = createContext<Props>({
  updatedAt: 0,
})

export const IntervalProvider: FC = ({ children }) => {
  const [value, set] = useState({ updatedAt: 0 })

  useEffect(() => {
    const id = setInterval(() => set({ updatedAt: Date.now() }), 30 * 60 * 1000)
    return () => clearInterval(id)
  }, [])

  return (
    <IntervalContext.Provider value={value}>
      {children}
    </IntervalContext.Provider>
  )
}
