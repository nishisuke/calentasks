import React, { useCallback, FC, useState } from 'react'
import {
  Draggable,
  Droppable,
  DragDropContext,
  DraggableProvided,
} from 'react-beautiful-dnd'

import { IKey } from 'src/entities/TaskKey'
import { Task } from 'src/types/Task'
import { Item } from 'src/components/Task'

interface P {
  order: IKey[]
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

  const filtered: Task[] = order.reduce(
    (acc: Task[], o: IKey) => [...acc, ...o.filterTasks(tasks)],
    []
  )
  const errored = tasks.filter((i) => !filtered.find((a) => a.id === i.id))

  const disableDrag = doingDone || a || errored.length !== 0

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
              if (keystr.ts !== null) {
                const idDrag = keystr.key
                const ts = keystr.filterTasks(tasks)
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
                          {keystr.key.slice(4, 6)}/{keystr.key.slice(6)}
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
                const id = keystr.key
                const task = keystr.filterTasks(tasks)[0]
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
            {errored.map((h, i) => {
              return (
                <Draggable
                  isDragDisabled={true}
                  key={h.id}
                  draggableId={h.id}
                  index={i + filtered.length}
                >
                  {(provided: DraggableProvided) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                      className="boxdrag"
                    >
                      <Item
                        className="taskdate"
                        setDoingDone={sa}
                        key={h.id}
                        task={h}
                        done={done}
                        disableDone={b}
                      />
                    </div>
                  )}
                </Draggable>
              )
            })}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </DragDropContext>
  )
}
