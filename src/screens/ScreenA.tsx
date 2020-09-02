import React, { FC, useEffect, useRef } from 'react'
import ReactSwipe from 'react-swipe'

interface P {
  index: number
}

const H: FC<P> = ({ index }) => {
  return <div className="swipe-page box">{index}</div>
}

export const ScreenA: FC = () => {
  const fu = (a: number) => {
    console.log(a)
  }

  const arr = [2, 3, 4, 5, 6]
  return (
    <ReactSwipe
      className="swipe"
      swipeOptions={{ continuous: true, callback: fu }}
      style={{
        container: {},
        wrapper: {
          overflow: 'hidden',
          position: 'relative',
        },
        child: {},
      }}
    >
      {arr.map((_, i) => (
        <H key={i} index={i} />
      ))}
    </ReactSwipe>
  )
}
