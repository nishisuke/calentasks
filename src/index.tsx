import React, { useState } from 'react'
import { render } from 'react-dom'

// Side effects
import 'src/libs/initFirebase'
import 'firebase/auth'
import 'firebase/firestore'

import { Layout } from 'src/Layout'
import { CalendarContext, Calendar } from 'src/contexts/calendar'
import { useAuth } from 'src/hooks/useAuth'
import { ScreenA } from 'src/screens/ScreenA'

import 'src/static/style.scss'

const App = () => {
  const auth = useAuth()
  const now = new Date()
  const [calendar, setCalendar] = useState<Calendar>({
    currentIndex: 0,
    displayedMonth: now.getMonth() + 1,
  })

  const page = <ScreenA auth={auth} />

  return (
    <CalendarContext.Provider value={{ calendar, setCalendar }}>
      <Layout page={page} />
    </CalendarContext.Provider>
  )
}

render(<App />, document.getElementById('app'))
