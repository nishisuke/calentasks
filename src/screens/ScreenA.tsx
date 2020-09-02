import React, { FC, useState, useContext, useEffect, useRef } from 'react'
import ReactSwipe from 'react-swipe'
import { CalendarContext } from 'src/contexts/calendar'

const array = [0, 0, 0] // must be 3以上の奇数
const loopRelativeIndex = (
  index: number,
  currentIndex: number,
  loop: number
) => {
  let diff = index - currentIndex
  if (Math.abs(diff) === loop - 1) {
    const abs = loop - 2 // loop is expected to be 3以上の奇数
    return Math.sign(diff) * -1 * abs
  } else {
    return diff
  }
}
const loopSwipeDirection = (be: number, af: number, loop: number) => {
  const d = af - be
  if (be === 0 && af === loop - 1) {
    return -1
  } else if (be === loop - 1 && af === 0) {
    return 1
  }
  return af - be
}

// ==========

interface M {
  startDate: Date
}
const Month: FC<M> = ({ startDate }) => {
  console.log(startDate)
  return <div className="swipe-page box">Month: {startDate.getMonth() + 1}</div>
}

// ==========
interface P {
  index: number
}

const PageContainer: FC<P> = ({ index }) => {
  const {
    calendar: { currentIndex, displayedMonth },
  } = useContext(CalendarContext)
  const diff = loopRelativeIndex(index, currentIndex, array.length)
  const thisYear = new Date().getFullYear()
  const startDate = new Date(thisYear, diff + displayedMonth - 1, 1)
  return <Month startDate={startDate} />
}

// ==========
export const ScreenA: FC = () => {
  const { calendar, setCalendar } = useContext(CalendarContext)
  const initIndex = calendar.currentIndex

  const callback = (nextIndex: number) => {
    setCalendar((before) => ({
      currentIndex: nextIndex,
      displayedMonth:
        before.displayedMonth +
        loopSwipeDirection(before.currentIndex, nextIndex, array.length),
    }))
  }

  return (
    <ReactSwipe
      className="swipe"
      swipeOptions={{ startSlide: initIndex, continuous: true, callback }}
      style={{
        container: {},
        wrapper: {
          overflow: 'hidden',
          position: 'relative',
        },
        child: {},
      }}
    >
      {array.map((_, i) => (
        <PageContainer key={i} index={i} />
      ))}
    </ReactSwipe>
  )
}
