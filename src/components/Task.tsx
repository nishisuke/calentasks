import React, { FC, useState } from 'react'
import { CSSTransition } from 'react-transition-group'

import { Task } from 'src/types/Task'
import { DraggableProvided } from 'react-beautiful-dnd'

interface I {
  task: Task
  toggle: (t: Task) => void
  provided: DraggableProvided
}

// This is undone
export const Item: FC<I> = ({ task, toggle, provided }) => {
  const [s, sb] = useState(task.done)
  const click = () => {
    sb(!task.done)
    setTimeout(() => toggle(task), 2000)
  }
  return (
    <CSSTransition
      in={!s}
      exit={true}
      enter={false}
      timeout={2000}
      classNames="my-node"
    >
      <div
        ref={provided.innerRef}
        {...provided.draggableProps}
        {...provided.dragHandleProps}
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
      </div>
    </CSSTransition>
  )
}
