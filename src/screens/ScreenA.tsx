import React, { FC, useState, useContext, useEffect, useRef } from 'react'
import ReactSwipe from 'react-swipe'
import { CalendarContext } from 'src/contexts/calendar'

const times = (n: number) => Array(n).fill(null)

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

const getLastDate = (y: number, m: number) => new Date(y, m, 0).getDate()

const getWeeks = (startDate: Date, limit: number) => {
  const year = startDate.getFullYear()
  const month = startDate.getMonth() + 1
  const prevMonth = month - 1
  const lastDate = getLastDate(year, month)
  const prevMonthLastDate = getLastDate(year, prevMonth)

  const prevMonthDatesCount = startDate.getDay()
  const prevMonthDates = times(prevMonthDatesCount).map(
    (_, i) => prevMonthLastDate - prevMonthDatesCount + i
  )

  const dates = times(lastDate).map((_, i) => i + 1)

  const r = (lastDate + prevMonthDatesCount) % 7
  const nextMonthDatesCount = r === 0 ? 0 : 7 - r
  const nextMonthDates = times(nextMonthDatesCount).map((_, i) => 1 + i)

  const calendarDates = [...prevMonthDates, ...dates, ...nextMonthDates]

  const line = Math.min(Math.ceil(calendarDates.length / 7), limit)
  return times(line).map((_, i) => calendarDates.slice(i * 7, i * 7 + 7))
}
const Month: FC<M> = ({ startDate }) => {
  console.log(startDate.getMonth() + 1, 'Month')
  return (
    <div className="swipe-page box">
      Month: {startDate.getMonth() + 1}
      {getWeeks(startDate, 5).map((week, i) => (
        <div key={i}>
          {week.map((date) => (
            <span key={date}>{date}</span>
          ))}
        </div>
      ))}
    </div>
  )
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
