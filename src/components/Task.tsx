import React, { FC, useState } from 'react'
import { CSSTransition } from 'react-transition-group'

import { Task } from 'src/types/Task'

interface I {
  task: Task
  done: (t: Task) => Promise<void>
  disableDone: boolean
  setDoingDone: (s: boolean) => void
  className: string
}

// This is undone
export const Item: FC<I> = ({
  className,
  task,
  done,
  disableDone,
  setDoingDone,
}) => {
  const [s, sb] = useState(false)
  const click = () => {
    setDoingDone(true)
    sb(true)
  }

  return (
    <CSSTransition
      in={!s}
      exit={true}
      enter={false}
      timeout={500}
      classNames="my-node"
      onExited={() =>
        done(task)
          .then(() => setDoingDone(false))
          .catch(() => setDoingDone(false))
      }
    >
      <div className={`${className} my-node`}>
        {!disableDone && !s && (
          <span onClick={click} className="donearea">
            <i className="far fa-circle" />
          </span>
        )}
        {!disableDone && s && (
          <span className="donearea">
            <i className="fas fa-check" />
          </span>
        )}
        {disableDone && <span className="donearea empty" />}
        <span className="tasktitle">{task.title}</span>
      </div>
    </CSSTransition>
  )
}
