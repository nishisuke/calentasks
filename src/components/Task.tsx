import React, { FC, useState } from 'react'
import { CSSTransition } from 'react-transition-group'

import { Task } from 'src/types/Task'
import { DraggableProvided } from 'react-beautiful-dnd'

interface I {
  task: Task
  done: (t: Task) => void
  provided?: DraggableProvided
}

// This is undone
export const Item: FC<I> = ({ task, done, provided }) => {
  const [s, sb] = useState(false)
  const click = () => {
    sb(true)
  }
  // TODO; onexited　完了に失敗しました 2020/02/21 12:30
  return (
    <CSSTransition
      in={!s}
      exit={true}
      enter={false}
      timeout={2000}
      classNames="my-node"
      onExited={() => done(task)}
    >
      <div
        ref={provided?.innerRef}
        {...provided?.draggableProps}
        {...provided?.dragHandleProps}
        className={`field my-node`}
      >
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
        {task.date}
      </div>
    </CSSTransition>
  )
}
