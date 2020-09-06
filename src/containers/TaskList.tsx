import React, { FC, useState } from 'react'
import { Draggable, Droppable, DragDropContext } from 'react-beautiful-dnd'

import { Task } from 'src/types/Task'
import { Item } from 'src/components/Task'

interface P {
  tasksGroups: Task[][]
  done: (t: Task) => void
  setOrder: (a: number, b: number) => void
}

export const TaskList: FC<P> = ({ setOrder, tasksGroups, done }) => {
  const onDragEnd = (result: any) => {
    if (!result.destination) {
      return
    }

    if (result.destination.index === result.source.index) {
      return
    }
    setOrder(result.source.index, result.destination.index)
  }

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <Droppable droppableId="droppable-1">
        {(provided: any) => (
          <div ref={provided.innerRef} {...provided.droppableProps}>
            {tasksGroups.map((ts, i) => {
              if (ts.length === 0) {
                return null
              } else if (ts.length === 1) {
                const id = ts[0].id
                return (
                  <Draggable key={id} draggableId={id} index={i}>
                    {(provided: any) => (
                      <Item provided={provided} task={ts[0]} done={done} />
                    )}
                  </Draggable>
                )
              } else {
                const idDrag = ts[0].date!.toString()
                return (
                  <Draggable
                    isDragDisabled={true}
                    key={idDrag}
                    draggableId={idDrag}
                    index={i}
                  >
                    {(provided: any) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                      >
                        {ts.map((h) => (
                          <Item key={h.id} task={h} done={done} />
                        ))}
                      </div>
                    )}
                  </Draggable>
                )
              }
            })}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </DragDropContext>
  )
}
