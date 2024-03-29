import React, { FC, useContext } from 'react'
import { CalendarContext } from 'src/contexts/calendar'
import { MonthContainer } from 'src/containers/MonthContainer'
import { CalendarDate } from 'src/entities/CalendarDate'
import { Task } from 'src/types/Task'
import SwipeableViews from 'react-swipeable-views'
import { virtualize } from 'react-swipeable-views-utils'

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
        tasks={index === calendar.currentIndex ? tasks : []}
        handleDate={index === calendar.currentIndex ? handleDate : undefined}
        key={key}
        index={index}
      />
    )
  }
  return (
    <VirtualizeSwipeableViews
      style={{ height: '100%' }}
      containerStyle={{ height: '100%' }}
      slideStyle={{ height: '100%' }}
      slideClassName="swipe-page"
      overscanSlideAfter={1}
      overscanSlideBefore={1}
      index={calendar.currentIndex}
      onChangeIndex={callback}
      slideRenderer={slideRenderer}
    />
  )
}
