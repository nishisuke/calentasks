import React, { FC, useState } from 'react'

import { Task } from 'src/types/Task'

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
