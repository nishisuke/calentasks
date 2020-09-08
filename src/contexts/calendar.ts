import { createContext, Dispatch, SetStateAction } from 'react'
export interface Calendar {
  thisMonth: number
  currentIndex: number
}
interface CalendarProps {
  calendar: Calendar
  setCalendar: Dispatch<SetStateAction<Calendar>>
}

export const CalendarContext = createContext<CalendarProps>({
  calendar: { thisMonth: 1, currentIndex: 1 },
  setCalendar: () => {},
})
