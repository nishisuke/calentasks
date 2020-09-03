import React, { FC, useContext } from 'react'

import { CalendarContext } from 'src/contexts/calendar'
import { Month } from 'src/components/Month'

interface P {
  index: number
  pages: number
}

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

export const MonthContainer: FC<P> = ({ index, pages }) => {
  const {
    calendar: { currentIndex, displayedMonth },
  } = useContext(CalendarContext)
  const diff = loopRelativeIndex(index, currentIndex, pages)
  const thisYear = new Date().getFullYear()
  const startDate = new Date(thisYear, diff + displayedMonth - 1, 1)
  return <Month startDate={startDate} />
}
