import React, { FC, useContext } from 'react'

import { CalendarContext } from 'src/contexts/calendar'
import { Month } from 'src/components/Month'
import { CalendarDate } from 'src/entities/CalendarDate'
import { Task } from 'src/types/Task'

interface P {
  index: number
  tasks: Task[]
  handleDate?: (cald: CalendarDate) => void
}

export const MonthContainer: FC<P> = ({ index, handleDate, tasks }) => {
  const {
    calendar: { thisMonth },
  } = useContext(CalendarContext)
  const thisYear = new Date().getFullYear()
  const startDate = new CalendarDate(thisYear, index + thisMonth, 1)
  return <Month tasks={tasks} handleDate={handleDate} startDate={startDate} />
}
