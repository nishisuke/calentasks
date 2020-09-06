import React, { FC, useState } from 'react'

import { Task } from 'src/types/Task'
import { DraggableProvided } from 'react-beautiful-dnd'

interface I {
  task: Task
  toggle: (t: Task) => void
  provided: DraggableProvided
}

export const Item: FC<I> = ({ task, toggle, provided }) => {
  const [s, sb] = useState(task.done)
  const click = () => {
    sb(!task.done)
    toggle(task)
  }
  return (
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
  )
}
