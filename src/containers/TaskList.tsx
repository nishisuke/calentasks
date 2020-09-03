import React, { FC, useState } from 'react'
import { TransitionGroup, CSSTransition } from 'react-transition-group'

import { Task } from 'src/types/Task'
import { Item } from 'src/components/Task'

export const TaskList: FC = () => {
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
    <TransitionGroup exit={true}>
      {items
        .filter((b) => !b.done)
        .map((t, i) => (
          <CSSTransition key={t.id} timeout={2000} classNames="my-node">
            <Item task={t} toggle={toggle} />
          </CSSTransition>
        ))}
    </TransitionGroup>
  )
}
