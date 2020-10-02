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
    calendar: { currentDate },
  } = useContext(CalendarContext)
  const startDate = new CalendarDate(currentDate.y, index + currentDate.m, 1)
  return <Month tasks={tasks} handleDate={handleDate} startDate={startDate} />
}
