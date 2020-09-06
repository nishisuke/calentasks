import React, { FC, useState } from 'react'
import { Draggable, Droppable, DragDropContext } from 'react-beautiful-dnd'

import { Task } from 'src/types/Task'
import { Item } from 'src/components/Task'

interface P {
  tasks: Task[][]
  toggle: (t: Task) => void
  setTasks: (k: string[]) => void
  order: string[]
}
const reorder = <T,>(list: T[], startIndex: number, endIndex: number): T[] => {
  const result = Array.from(list)
  const [removed] = result.splice(startIndex, 1)
  result.splice(endIndex, 0, removed)

  return result
}
export const TaskList: FC<P> = ({ order, setTasks, tasks, toggle }) => {
  const onDragEnd = (result: any) => {
    if (!result.destination) {
      return
    }

    if (result.destination.index === result.source.index) {
      return
    }

    const items = reorder(order, result.source.index, result.destination.index)
    setTasks(items)
  }

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <Droppable droppableId="droppable-1">
        {(provided: any) => (
          <div ref={provided.innerRef} {...provided.droppableProps}>
            {tasks.map((ts, i) =>
              ts.length === 1 ? (
                <Draggable key={ts[0].id} draggableId={ts[0].id} index={i}>
                  {(provided: any) => (
                    <Item provided={provided} task={ts[0]} toggle={toggle} />
                  )}
                </Draggable>
              ) : (
                <Draggable
                  isDragDisabled={true}
                  key={ts[0].date!.toString()}
                  draggableId={ts[0].date!.toString()}
                  index={i}
                >
                  {(provided: any) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                    >
                      {ts.map((h) => (
                        <Item task={h} toggle={toggle} />
                      ))}
                    </div>
                  )}
                </Draggable>
              )
            )}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </DragDropContext>
  )
}
