import React, { useState } from 'react'
import { render } from 'react-dom'

// Side effects
import 'src/libs/initFirebase'
import 'firebase/auth'
import 'firebase/firestore'

import { Layout } from 'src/Layout'
import { CalendarContext, Calendar } from 'src/contexts/calendar'
import { VisibilityProvider } from 'src/contexts/visibility'
import { useAuth } from 'src/hooks/useAuth'
import { ScreenA } from 'src/screens/ScreenA'
import { SignIn } from 'src/containers/SignIn'
import { MenuContent } from 'src/components/MenuContent'

import 'src/static/style.scss'

const getTodayPage = (now: Date): number => {
  const prevCount = new Date(now.getFullYear(), now.getMonth(), 1).getDay()
  return now.getDate() + prevCount > 35 ? 1 : 0
}

const App = () => {
  const auth = useAuth()
  const now = new Date()
  const [calendar, setCalendar] = useState<Calendar>({
    currentIndex: getTodayPage(now),
    thisMonth: now.getMonth() + 1,
  })

  // const dev = {uid: 'hogehoge'}
  // const auth = {
  //   loaded: true,
  //   user: dev,
  // }
  if (!auth.loaded) {
    return (
      <VisibilityProvider>
        <CalendarContext.Provider value={{ calendar, setCalendar }}>
          <Layout loading={true} page={<></>} menu={<></>} />
        </CalendarContext.Provider>
      </VisibilityProvider>
    )
  } else if (!auth.user) {
    return (
      <VisibilityProvider>
        <SignIn />
      </VisibilityProvider>
    )
  } else if (auth.user) {
    const page = <ScreenA user={auth.user} />

    return (
      <VisibilityProvider>
        <CalendarContext.Provider value={{ calendar, setCalendar }}>
          <Layout
            loading={false}
            page={page}
            menu={<MenuContent user={auth.user} />}
          />
        </CalendarContext.Provider>
      </VisibilityProvider>
    )
  } else {
    throw new Error('Fail')
  }
}

render(<App />, document.getElementById('app'))
