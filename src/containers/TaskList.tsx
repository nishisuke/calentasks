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
  order: string[]
  tasks: Task[]
  done: (t: Task) => Promise<void>
  setOrder: (a: number, b: number) => void
  doingDone: boolean
}

export const TaskList: FC<P> = ({
  doingDone,
  setOrder,
  tasks,
  order,
  done,
}) => {
  const [b, sb] = useState(false)
  const [a, sa] = useState(false)
  const disableDrag = doingDone || a

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
            {order.map((keystr, i) => {
              if (/^\d{8,8}$/.test(keystr)) {
                const idDrag = keystr
                const da = new Date(
                  parseInt(keystr.slice(0, 4), 10),
                  parseInt(keystr.slice(4, 6), 10) - 1,
                  parseInt(keystr.slice(6, 8), 10)
                )
                const ts = tasks.filter(
                  (t) => t.date && t.date === da.getTime()
                )
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
                        <div className="datetitle has-text-grey-light">
                          {da.getMonth() + 1}/{da.getDate()}
                        </div>
                        {ts.map((h) => (
                          <Item
                            className="taskdate"
                            setDoingDone={sa}
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
                const id = keystr
                const task = tasks.find((t) => t.id === id)!
                return (
                  <Draggable
                    isDragDisabled={disableDrag}
                    key={id}
                    draggableId={id}
                    index={i}
                  >
                    {(provided: DraggableProvided) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        className="boxdrag"
                      >
                        <Item
                          className="box"
                          setDoingDone={sa}
                          disableDone={b}
                          task={task}
                          done={done}
                        />
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
