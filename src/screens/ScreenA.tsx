import React, { FC, useState, useContext, useEffect, useRef } from 'react'
import { TransitionGroup, CSSTransition } from 'react-transition-group'

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
export const Pages: FC = () => {
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

interface I {
  task: Task
  toggle: (t: Task) => void
}
export const Item: FC<I> = ({ task, toggle }) => {
  const [s, sb] = useState(task.done)
  const click = () => {
    sb(!task.done)
    toggle(task)
  }
  return (
    <div className={`field my-node`}>
      {!s && (
        <span onClick={click}>
          <i className="far fa-circle" />
        </span>
      )}
      {s && (
        <span onClick={click}>
          <i className="fas fa-check" />
        </span>
      )}
      {task.title}
    </div>
  )
}

interface Task {
  id: number
  title: string
  done: boolean
}
export const ScreenA: FC = () => {
  const [items, setItems] = useState<Task[]>([
    {
      id: 4,
      title: 'hello',
      done: false,
    },
    {
      id: 5,
      title: 'hello',
      done: false,
    },
    {
      id: 3,
      title: 'hello',
      done: false,
    },
    {
      id: 6,
      title: 'hello',
      done: false,
    },
  ])
  const toggle = (t: Task) => {
    setItems((b) => {
      const i: number = b.findIndex((e) => e.id === t.id)
      const tar: Task = b[i]
      const copy = [...b]
      copy[i] = { ...tar, done: true }
      return copy
    })
  }

  return (
    <>
      <TransitionGroup exit={true}>
        {items
          .filter((b) => !b.done)
          .map((t, i) => (
            <CSSTransition key={t.id} timeout={2000} classNames="my-node">
              <Item task={t} toggle={toggle} />
            </CSSTransition>
          ))}
      </TransitionGroup>
      <Pages />

      <div className="field has-addons">
        <div className="control">
          <input className="input" type="text" />
        </div>
        <div className="control">
          <a className="button">保存</a>
        </div>
      </div>
      <a href="#" className="button is-floating is-small is-primary">
        <i className="fas fa-plus"></i>
      </a>
    </>
  )
}
