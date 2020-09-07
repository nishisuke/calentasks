import React, { FC, useContext } from 'react'

import { CalendarContext } from 'src/contexts/calendar'
import { Month } from 'src/components/Month'
import { CalendarDate } from 'src/entities/CalendarDate'
import { Task } from 'src/types/Task'

interface P {
  index: number
  pages: number
  tasks: Task[]
  handleDate?: (cald: CalendarDate) => void
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

export const MonthContainer: FC<P> = ({ index, pages, handleDate, tasks }) => {
  const {
    calendar: { currentIndex, displayedMonth },
  } = useContext(CalendarContext)
  const diff = loopRelativeIndex(index, currentIndex, pages)
  const thisYear = new Date().getFullYear()
  const startDate = new CalendarDate(thisYear, diff + displayedMonth, 1)
  return <Month tasks={tasks} handleDate={handleDate} startDate={startDate} />
}
