import React, { FC, useEffect, useContext, useState } from 'react'
import { render } from 'react-dom'

// Side effects
import 'src/libs/initFirebase'
import 'firebase/auth'
import 'firebase/firestore'

import { CalendarProvider, CalendarContext } from 'src/contexts/calendar'
import { VisibilityContext, VisibilityProvider } from 'src/contexts/visibility'
import { useAuth } from 'src/hooks/useAuth'
import { Layout } from 'src/Layout'
import { ScreenA } from 'src/screens/ScreenA'
import { SignIn } from 'src/containers/SignIn'
import { Month } from 'src/components/Month'
import { CalendarDate } from 'src/entities/CalendarDate'

import 'src/static/style.scss'

interface PP {
  num: number
}
const EmptyCal: FC<PP> = ({ num }) => {
  return (
    <div style={{ height: 310, display: 'flex', flexFlow: 'column nowrap' }}>
      <Month
        startDate={new CalendarDate(new Date().getFullYear(), num, 1)}
        handleDate={() => {}}
        tasks={[]}
      />
    </div>
  )
}
const App = () => {
  const { visible } = useContext(VisibilityContext)
  const { syncTime, calendar } = useContext(CalendarContext)
  const auth = useAuth()

  useEffect(() => {
    if (visible) {
      syncTime()
    }
  }, [visible])

  const num = ((calendar.thisMonth + calendar.currentIndex - 1) % 12) + 1
  const page = !auth.loaded ? (
    <EmptyCal num={num} />
  ) : auth.user ? (
    <ScreenA user={auth.user} />
  ) : (
    <>
      <EmptyCal num={num} />
      <SignIn />
    </>
  )
  const showMenu = !(auth.loaded && !auth.user)
  return (
    <Layout num={num} loading={!auth.loaded} page={page} showMenu={showMenu} />
  )
}

render(
  <VisibilityProvider>
    <CalendarProvider>
      <App />
    </CalendarProvider>
  </VisibilityProvider>,
  document.getElementById('app')
)
