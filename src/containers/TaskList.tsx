import React, { useCallback, FC, useState } from 'react'
import {
  Draggable,
  Droppable,
  DragDropContext,
  DraggableProvided,
} from 'react-beautiful-dnd'

import { Task } from 'src/types/Task'
import { Item } from 'src/components/Task'

interface P {
  tasksGroups: Task[][]
  done: (t: Task) => void
  setOrder: (a: number, b: number) => void
}

export const TaskList: FC<P> = ({ setOrder, tasksGroups, done }) => {
  const [b, sb] = useState(false)
  const onDragEnd = (result: any) => {
    sb(false)
    if (!result.destination) {
      return
    }

    if (result.destination.index === result.source.index) {
      return
    }
    setOrder(result.source.index, result.destination.index)
  }

  const onBeforeCapture = useCallback(() => {
    sb(true)
  }, [b])
  const onBeforeDragStart = useCallback(() => {}, [])
  const onDragStart = useCallback(() => {}, [])

  return (
    <DragDropContext
      onBeforeCapture={onBeforeCapture}
      onBeforeDragStart={onBeforeDragStart}
      onDragStart={onDragStart}
      onDragEnd={onDragEnd}
    >
      <Droppable droppableId="droppable-1">
        {(provided: any) => (
          <div
            className="tasklist has-background-grey-darker"
            ref={provided.innerRef}
            {...provided.droppableProps}
          >
            {tasksGroups.map((ts, i) => {
              if (ts.length < 1) {
                // orderの消し忘れなどのため
                return (
                  <Draggable
                    isDragDisabled={true}
                    key={i.toString()}
                    draggableId={i.toString()}
                    index={i}
                  >
                    {(provided: DraggableProvided) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        className="is-hidden"
                      />
                    )}
                  </Draggable>
                )
              } else if (ts[0].date) {
                const idDrag = ts[0].date!.toString()
                const da = new Date(ts[0].date)
                return (
                  <Draggable
                    isDragDisabled={true}
                    key={idDrag}
                    draggableId={idDrag}
                    index={i}
                  >
                    {(provided: DraggableProvided) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                      >
                        <span className="has-text-grey-light">
                          {da.getMonth() + 1}/{da.getDate()}
                        </span>
                        {ts.map((h) => (
                          <Item
                            key={h.id}
                            task={h}
                            done={done}
                            disableDone={b}
                          />
                        ))}
                      </div>
                    )}
                  </Draggable>
                )
              } else {
                const id = ts[0].id
                return (
                  <Draggable key={id} draggableId={id} index={i}>
                    {(provided: DraggableProvided) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        className="box taskbox"
                      >
                        <Item disableDone={b} task={ts[0]} done={done} />
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
