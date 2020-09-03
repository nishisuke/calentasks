import React, { FC } from 'react'

interface M {
  startDate: Date
}

const times = (n: number) => Array(n).fill(null)
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

export const Month: FC<M> = ({ startDate }) => {
  // console.log(startDate.getMonth() + 1, 'Month')
  return (
    <div className="swipe-page">
      Month: {startDate.getMonth() + 1}
      {getWeeks(startDate, 5).map((week, i) => (
        <div className="cal-week" key={i}>
          {week.map((date) => (
            <div className="cal-date" key={date}>
              {date}
            </div>
          ))}
        </div>
      ))}
    </div>
  )
}
