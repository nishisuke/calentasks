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
import { SignIn } from 'src/containers/SignIn'

import 'src/static/style.scss'

const App = () => {
  const auth = useAuth()
  const now = new Date()
  const [calendar, setCalendar] = useState<Calendar>({
    currentIndex: 0,
    displayedMonth: now.getMonth() + 1,
  })

  if (!auth.loaded) {
    return <div>Loading</div>
  } else if (!auth.user) {
    return <SignIn />
  } else if (auth.user) {
    const page = <ScreenA user={auth.user} />

    return (
      <CalendarContext.Provider value={{ calendar, setCalendar }}>
        <Layout page={page} />
      </CalendarContext.Provider>
    )
  } else {
    throw new Error('Fail')
  }
}

render(<App />, document.getElementById('app'))
