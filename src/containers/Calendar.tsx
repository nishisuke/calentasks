import React, { FC, useContext } from 'react'
import ReactSwipe from 'react-swipe'
import { CalendarContext } from 'src/contexts/calendar'
import { MonthContainer } from 'src/containers/MonthContainer'

const array = [0, 0, 0] // must be 3以上の奇数
const loopSwipeDirection = (be: number, af: number, loop: number) => {
  const d = af - be
  if (be === 0 && af === loop - 1) {
    return -1
  } else if (be === loop - 1 && af === 0) {
    return 1
  }
  return af - be
}
interface P {
  handleDate?: (y: number, m: number, d: number) => void
}
export const Calendar: FC<P> = ({ handleDate }) => {
  const { calendar, setCalendar } = useContext(CalendarContext)

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
      swipeOptions={{
        startSlide: calendar.currentIndex,
        continuous: true,
        callback,
      }}
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
        <MonthContainer
          handleDate={i === calendar.currentIndex ? handleDate : undefined}
          key={i}
          index={i}
          pages={array.length}
        />
      ))}
    </ReactSwipe>
  )
}
