import React, { FC } from 'react'
import { CalendarDate } from 'src/entities/CalendarDate'
import { Task } from 'src/types/Task'

interface M {
  startDate: CalendarDate
  handleDate?: (cal: CalendarDate) => void
  tasks: Task[]
}

const times = (n: number) => Array(n).fill(null)

const getWeeks = (startDate: CalendarDate, limit: number) => {
  const prevMonthDatesCount = startDate.date.getDay()
  const prevMonthDates = times(prevMonthDatesCount).map(
    (_, i) => i - prevMonthDatesCount
  )

  const dates = times(7 * limit - prevMonthDatesCount).map((_, i) => i)
  const calendarDates = [...prevMonthDates, ...dates]

  const line = Math.min(Math.ceil(calendarDates.length / 7), limit)
  return times(line).map((_, i) => calendarDates.slice(i * 7, i * 7 + 7))
}

export const Month: FC<M> = ({ startDate, handleDate, tasks }) => {
  return (
    <>
      {getWeeks(startDate, 5).map((week, i) => (
        <div className="cal-week" key={i}>
          {week.map((date) => {
            const dayst = tasks.filter(
              (t) =>
                t.date ===
                new CalendarDate(startDate.y, startDate.m, startDate.d + date)
                  .ts
            )
            return (
              <div
                onClick={
                  handleDate
                    ? () =>
                        handleDate(
                          new CalendarDate(
                            startDate.y,
                            startDate.m,
                            startDate.d + date
                          )
                        )
                    : undefined
                }
                className="cal-date"
                key={
                  new CalendarDate(startDate.y, startDate.m, startDate.d + date)
                    .d
                }
              >
                <div className="caldatelabel">
                  {
                    new CalendarDate(
                      startDate.y,
                      startDate.m,
                      startDate.d + date
                    ).d
                  }
                </div>
                {dayst.slice(0, 1).map((t) => (
                  <div className="is-size-7 hog" key={t.id}>
                    {t.title}
                  </div>
                ))}
                {dayst.length === 2 && (
                  <div className="is-size-7 hog">{dayst[1].title}</div>
                )}
                {dayst.length > 2 && (
                  <div className="is-size-7 hog">+{dayst.length - 1}</div>
                )}
              </div>
            )
          })}
        </div>
      ))}
    </>
  )
}
