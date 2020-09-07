import React, { FC, useState } from 'react'
import { CSSTransition } from 'react-transition-group'

import { Task } from 'src/types/Task'

interface I {
  task: Task
  done: (t: Task) => Promise<void>
  disableDone: boolean
  setDoingDone: (s: boolean) => void
}

// This is undone
export const Item: FC<I> = ({ task, done, disableDone, setDoingDone }) => {
  const [s, sb] = useState(false)
  const click = () => {
    setDoingDone(true)
    sb(true)
  }
  // TODO; onexited　完了に失敗しました 2020/02/21 12:30
  return (
    <CSSTransition
      in={!s}
      exit={true}
      enter={false}
      timeout={510}
      classNames="my-node"
      onExited={
        () =>
          done(task)
            .then(() => setDoingDone(false))
            .catch(() => setDoingDone(false))
        // TODO e
      }
    >
      <div className={`field my-node`}>
        {!disableDone && !s && (
          <span onClick={click}>
            <i className="far fa-circle" />
          </span>
        )}
        {!disableDone && s && (
          <span onClick={click}>
            <i className="fas fa-check" />
          </span>
        )}
        {task.title}
        {task.date}
      </div>
    </CSSTransition>
  )
}
