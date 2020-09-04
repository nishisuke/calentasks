import React, { FC, useEffect, useState, useRef } from 'react'

import { Calendar } from 'src/containers/Calendar'
import { TaskList } from 'src/containers/TaskList'
import { Task } from 'src/types/Task'
import { CSSTransition } from 'react-transition-group'

const arr = Array(30)
  .fill(null)
  .map((_, id) => ({
    id,
    title: 'hello',
    done: false,
  }))

interface FP {
  onClick: () => void
}

const FAB: FC<FP> = ({ onClick, children }) => (
  <button onClick={onClick} className="button is-floating is-small is-primary">
    {children}
  </button>
)

export const ScreenA: FC = () => {
  const [tasks, setTasks] = useState<Task[]>(arr)
  const [addMode, setAddMode] = useState(false)
  const [animTrigger, setAnimTrigger] = useState({
    in: false,
    title: '',
  })
  const inputRef = useRef<HTMLInputElement>(null)
  const [t, sett] = useState('')

  const addAndEnd = (title: string) => {
    if (title) {
      addTask(title)
    }
    setAddMode(false)
  }
  const addTask = (title: string) => {
    setTasks((b) => [
      ...b,
      {
        id: Date.now(),
        done: false,
        title,
      },
    ])
    sett('')
    setAnimTrigger({ in: !animTrigger.in, title })
  }

  useEffect(() => {
    if (addMode) inputRef.current?.focus()
  }, [addMode])

  return (
    <>
      <Calendar />
      {addMode && (
        <div className="field has-addons">
          <div className="control">
            <input
              ref={inputRef}
              onChange={(e) => sett(e.target.value)}
              value={t}
              className="input"
              type="text"
            />
          </div>
          <div className="control">
            <button onClick={() => addTask(t)} className="button">
              保存
            </button>
          </div>
        </div>
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
      {addMode && t && <FAB onClick={() => addAndEnd(t)}>OK</FAB>}
      {addMode && !t && (
        <FAB onClick={() => setAddMode(false)}>
          <i className={`fas fa-times`} />
        </FAB>
      )}

      {!addMode && <TaskList tasks={tasks} />}
    </>
  )
}
