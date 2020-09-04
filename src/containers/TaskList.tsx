import React, { FC, useState } from 'react'
import { TransitionGroup, CSSTransition } from 'react-transition-group'

import { Task } from 'src/types/Task'
import { Item } from 'src/components/Task'

interface P {
  tasks: Task[]
  toggle: (t: Task) => void
}
export const TaskList: FC<P> = ({ tasks, toggle }) => {
  return (
    <TransitionGroup exit={true}>
      {tasks
        .filter((b) => !b.done)
        .map((t, i) => (
          <CSSTransition key={t.id} timeout={2000} classNames="my-node">
            <Item task={t} toggle={toggle} />
          </CSSTransition>
        ))}
    </TransitionGroup>
  )
}
