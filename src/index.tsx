import React, { useState } from 'react'
import { render } from 'react-dom'

import { Router } from 'src/routers/Router'
import { Layout } from 'src/Layout'
import { CalendarContext, Calendar } from 'src/contexts/calendar'

import 'src/static/style.css'

const App = () => {
  const now = new Date()
  const [calendar, setCalendar] = useState<Calendar>({
    currentIndex: 0,
    displayedMonth: now.getMonth() + 1,
  })

  const page = <Router />
  return (
    <CalendarContext.Provider value={{ calendar, setCalendar }}>
      <Layout page={page} />
    </CalendarContext.Provider>
  )
}

render(<App />, document.getElementById('app'))
