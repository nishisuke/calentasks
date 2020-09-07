import React, { FC } from 'react'
import { CalendarDate } from 'src/entities/CalendarDate'
import { Task } from 'src/types/Task'

interface M {
  startDate: CalendarDate
  handleDate?: (cal: CalendarDate) => void
  tasks: Task[]
}

const times = (n: number) => Array(n).fill(null)
const getLastDate = (y: number, m: number) => new Date(y, m, 0).getDate()

const getWeeks = (startDate: CalendarDate, limit: number) => {
  const year = startDate.y
  const month = startDate.m
  const prevMonth = month - 1
  const lastDate = getLastDate(year, month)
  const prevMonthLastDate = getLastDate(year, prevMonth)

  const prevMonthDatesCount = startDate.date.getDay()
  const prevMonthDates = times(prevMonthDatesCount).map(
    (_, i) => prevMonthLastDate - prevMonthDatesCount + i + 1
  )

  const dates = times(lastDate).map((_, i) => i + 1)

  const r = (lastDate + prevMonthDatesCount) % 7
  const nextMonthDatesCount = r === 0 ? 0 : 7 - r
  const nextMonthDates = times(nextMonthDatesCount).map((_, i) => 1 + i)

  const calendarDates = [...prevMonthDates, ...dates, ...nextMonthDates]

  const line = Math.min(Math.ceil(calendarDates.length / 7), limit)
  return times(line).map((_, i) => calendarDates.slice(i * 7, i * 7 + 7))
}

export const Month: FC<M> = ({ startDate, handleDate, tasks }) => {
  return (
    <div className="swipe-page">
      Month: {startDate.m}
      {getWeeks(startDate, 5).map((week, i) => (
        <div className="cal-week" key={i}>
          {week.map((date) => (
            <div
              onClick={
                handleDate
                  ? () =>
                      handleDate(
                        new CalendarDate(startDate.y, startDate.m, date)
                      )
                  : undefined
              }
              className="cal-date"
              key={date}
            >
              {date}
              {tasks
                .filter(
                  (t) =>
                    t.date ===
                    new CalendarDate(startDate.y, startDate.m, date).ts
                )
                .map((t) => (
                  <div key={t.id}>{t.title}</div>
                ))}
            </div>
          ))}
        </div>
      ))}
    </div>
  )
}
