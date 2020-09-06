import React, { FC, useState } from 'react'
import { Draggable, Droppable, DragDropContext } from 'react-beautiful-dnd'

import { Task } from 'src/types/Task'
import { Item } from 'src/components/Task'

interface P {
  tasks: Task[]
  toggle: (t: Task) => void
  setTasks: (
    cb: (t: { [key: string]: Task[] }) => { [key: string]: Task[] }
  ) => void
}
const reorder = (
  list: Task[],
  startIndex: number,
  endIndex: number
): Task[] => {
  const result = Array.from(list)
  const [removed] = result.splice(startIndex, 1)
  result.splice(endIndex, 0, removed)

  return result
}
export const TaskList: FC<P> = ({ setTasks, tasks, toggle }) => {
  const onDragEnd = (result: any) => {
    if (!result.destination) {
      return
    }

    if (result.destination.index === result.source.index) {
      return
    }

    const items = reorder(tasks, result.source.index, result.destination.index)
    setTasks((b) => ({ ...b, undone: items }))
  }

  console.log(tasks)
  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <Droppable droppableId="droppable-1">
        {(provided: any) => (
          <div ref={provided.innerRef} {...provided.droppableProps}>
            {tasks.map((t, i) => (
              <Draggable key={t.id} draggableId={t.id} index={i}>
                {(provided: any) => (
                  <Item provided={provided} task={t} toggle={toggle} />
                )}
              </Draggable>
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </DragDropContext>
  )
}
