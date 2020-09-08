import React, { FC, useContext } from 'react'
import { CalendarContext } from 'src/contexts/calendar'
import { MonthContainer } from 'src/containers/MonthContainer'
import { CalendarDate } from 'src/entities/CalendarDate'
import { Task } from 'src/types/Task'
import SwipeableViews from 'react-swipeable-views'
import { virtualize } from 'react-swipeable-views-utils'

const array = [0, 0, 0] // must be 3以上の奇数
const loopSwipeDirection = (be: number, af: number) => {
  return af - be
}
interface P {
  handleDate?: (cald: CalendarDate) => void
  tasks: Task[]
}
export const Calendar: FC<P> = ({ handleDate, tasks }) => {
  const { calendar, setCalendar } = useContext(CalendarContext)

  const callback = (nextIndex: number, beforeIndex: number) => {
    setCalendar((before) => ({
      ...before,
      currentIndex: nextIndex,
    }))
  }

  const VirtualizeSwipeableViews = virtualize(SwipeableViews)

  function slideRenderer(params: any) {
    const { index, key } = params
    return (
      <MonthContainer
        tasks={tasks}
        handleDate={index === calendar.currentIndex ? handleDate : undefined}
        key={key}
        index={index}
        pages={array.length}
      />
    )
  }
  return (
    <div className="swipesticky">
      <div data-scroll className="scrollout">
        <VirtualizeSwipeableViews
          index={calendar.currentIndex}
          onChangeIndex={callback}
          slideRenderer={slideRenderer}
        />
      </div>
    </div>
  )
}
