import React, { useCallback, FC, useState } from 'react'
import {
  Draggable,
  Droppable,
  DragDropContext,
  DraggableProvided,
} from 'react-beautiful-dnd'

import { IKey } from 'src/entities/TaskKey'
import { CalendarDate } from 'src/entities/CalendarDate'
import { Task } from 'src/types/Task'
import { Item } from 'src/components/Task'

interface P {
  order: IKey[]
  tasks: Task[]
  done: (t: Task) => Promise<void>
  setOrder: (a: number, b: number) => void
  doingDone: boolean
}

const DAY_MSEC = 24 * 3600 * 1000

export const TaskList: FC<P> = ({
  doingDone,
  setOrder,
  tasks,
  order,
  done,
}) => {
  const [b, sb] = useState(false)
  const [a, sa] = useState(false)

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

  const disableDrag = doingDone || a
  const now = Date.now()
  const weekSince = now + 7 * DAY_MSEC

  const fs = order
    .map((keystr) => keystr.filterTasks(tasks))
    .filter((a) => a.length)
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
            {fs.map((ts, i) => {
              if (ts[0].date) {
                const d = new Date(ts[0].date)
                const cald = new CalendarDate(
                  d.getFullYear(),
                  d.getMonth() + 1,
                  d.getDate()
                )
                const idDrag = cald.key
                return (
                  <Draggable
                    isDragDisabled={true}
                    key={idDrag}
                    draggableId={idDrag}
                    index={i}
                  >
                    {(provided: DraggableProvided) => (
                      <div ref={provided.innerRef} {...provided.draggableProps}>
                        <div
                          className={`datetitle ${
                            d.getTime() < weekSince
                              ? 'has-text-info'
                              : 'has-text-grey-light'
                          } `}
                        >
                          {cald.key.slice(4, 6)}/{cald.key.slice(6)}
                        </div>
                        {ts.map((h) => (
                          <Item
                            handle={{ ...provided.dragHandleProps }}
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
                const task = ts[0]
                return (
                  <Draggable
                    isDragDisabled={disableDrag}
                    key={task.id}
                    draggableId={task.id}
                    index={i}
                  >
                    {(provided: DraggableProvided) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        className="boxdrag"
                      >
                        <Item
                          handle={{ ...provided.dragHandleProps }}
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
