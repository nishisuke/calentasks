import React, {
  useState,
  FC,
  createContext,
  Dispatch,
  SetStateAction,
} from 'react'

export interface Calendar {
  thisMonth: number
  currentIndex: number
}
interface CalendarProps {
  calendar: Calendar
  setCalendar: Dispatch<SetStateAction<Calendar>>
  syncTime: () => void
}

export const CalendarContext = createContext<CalendarProps>({
  calendar: { thisMonth: 1, currentIndex: 1 },
  setCalendar: () => {},
  syncTime: () => {},
})

const getTodayPage = (now: Date): number => {
  const prevCount = new Date(now.getFullYear(), now.getMonth(), 1).getDay()
  return now.getDate() + prevCount > 35 ? 1 : 0
}

const getCal = () => {
  const now = new Date()
  return {
    currentIndex: getTodayPage(now),
    thisMonth: now.getMonth() + 1,
  }
}

export const CalendarProvider: FC = ({ children }) => {
  const [calendar, setCalendar] = useState<Calendar>(getCal())
  const syncTime = () => setCalendar(getCal())

  return (
    <CalendarContext.Provider value={{ calendar, setCalendar, syncTime }}>
      {children}
    </CalendarContext.Provider>
  )
}
