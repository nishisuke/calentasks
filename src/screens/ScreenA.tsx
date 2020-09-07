import React, { FC, useContext, useEffect, useState, useRef } from 'react'
import { CalendarContext } from 'src/contexts/calendar'

import { Calendar } from 'src/containers/Calendar'
import { TaskList } from 'src/containers/TaskList'
import { Task } from 'src/types/Task'
import { CSSTransition } from 'react-transition-group'
import { AuthedUser } from 'src/types/AuthedUser'

import firebase from 'firebase/app'
import { signOut } from 'src/services/authService'
import { useTask } from 'src/hooks/useTask'
import { CalendarDate } from 'src/entities/CalendarDate'

interface FP {
  onClick: () => void
  adding?: boolean
}

const FAB: FC<FP> = ({ onClick, children, adding }) => (
  <button
    onClick={onClick}
    className={`button is-floating is-small addbutton ${
      adding ? 'is-loading' : ''
    }`}
    disabled={adding}
  >
    {children}
  </button>
)

interface P {
  user: AuthedUser
}

export const ScreenA: FC<P> = ({ user }) => {
  const [animTrigger, setAnimTrigger] = useState({
    in: false,
    title: '',
  })
  const [title, sett] = useState('')
  const [d, setdt] = useState<CalendarDate | undefined>(undefined)
  const [addMode, setAddMode] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const { calendar } = useContext(CalendarContext)

  const {
    doingDone,
    adding,
    addTask: _add,
    moveItem,
    tasksGroups,
    toggle,
  } = useTask(user)

  useEffect(() => {
    if (addMode) inputRef.current?.focus()
  }, [addMode])

  const handleDate = addMode
    ? setdt
    : (cald: CalendarDate) => {
        setdt(cald)
        setAddMode(true)
      }

  const addTask = async (ob: { title: string; date?: CalendarDate }) => {
    const text = await _add(ob)
    if (!text) {
      setAnimTrigger({ in: !animTrigger.in, title: ob.title })
      sett('')
      setdt(undefined)
    } else {
      // TODO
      alert(text)
    }
  }

  const addAndEnd = async ({
    title,
    date,
  }: {
    title: string
    date?: CalendarDate
  }) => {
    if (title) {
      addTask({ title, date }).then(() => setAddMode(false))
      // TODO: catch
    } else {
      setAddMode(false)
    }
  }
  let tasks: Task[] = []
  const now = new Date()
  const beg = new Date(
    now.getFullYear(),
    calendar.displayedMonth - 1,
    1
  ).getTime()
  const end = new Date(now.getFullYear(), calendar.displayedMonth, 1).getTime()
  tasksGroups.forEach((l) => {
    tasks = tasks.concat(
      l.filter((t) => t.date && !t.done && beg <= t.date && t.date < end)
    )
  })

  return (
    <>
      <Calendar tasks={tasks} handleDate={handleDate} />
      {addMode && (
        <>
          <div className="field has-addons">
            <div className="control">
              <input
                ref={inputRef}
                onChange={(e) => sett(e.target.value)}
                value={title}
                className="input"
                type="text"
              />
            </div>
            <div className="control">
              <button
                onClick={() => addTask({ title: title, date: d })}
                className={`button ${adding ? 'is-loading' : ''}`}
                disabled={adding}
              >
                保存
              </button>
            </div>
          </div>
          {d && (
            <div className="field ">
              <p className="help">
                {d.y}/{d.m}/{d.d}
              </p>
            </div>
          )}
        </>
      )}

      <CSSTransition in={animTrigger.in} timeout={2000} classNames="my-check">
        <span className="my-check">
          <i className={`fas fa-check`} />
          {animTrigger.title} を保存しました
        </span>
      </CSSTransition>
      {!addMode && (
        <FAB onClick={() => setAddMode(true)}>
          <i className={`fas fa-plus`} />
        </FAB>
      )}
      {addMode && title && (
        <FAB
          adding={adding}
          onClick={() => addAndEnd({ title: title, date: d })}
        >
          OK
        </FAB>
      )}
      {addMode && !title && (
        <FAB onClick={() => setAddMode(false)}>
          <i className={`fas fa-times`} />
        </FAB>
      )}

      {!addMode && (
        <TaskList
          doingDone={doingDone}
          setOrder={moveItem}
          tasksGroups={tasksGroups}
          done={toggle}
        />
      )}
      <button onClick={signOut} className="button ">
        sign out
      </button>
    </>
  )
}
