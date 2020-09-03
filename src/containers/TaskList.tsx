import React, { FC, useState } from 'react'
import { TransitionGroup, CSSTransition } from 'react-transition-group'

import { Task } from 'src/types/Task'
import { Item } from 'src/components/Task'

const arr = Array(73)
  .fill(null)
  .map((_, id) => ({
    id,
    title: 'hello',
    done: false,
  }))
export const TaskList: FC = () => {
  const [items, setItems] = useState<Task[]>(arr)

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
