import React, { FC, useEffect, useContext, useState } from 'react'
import { render } from 'react-dom'

// Side effects
import 'src/libs/initFirebase'
import 'firebase/auth'
import 'firebase/firestore'

import { CalendarProvider, CalendarContext } from 'src/contexts/calendar'
import { VisibilityContext, VisibilityProvider } from 'src/contexts/visibility'
import { IntervalContext, IntervalProvider } from 'src/contexts/interval'
import { useAuth } from 'src/hooks/useAuth'
import { Layout } from 'src/Layout'
import { ScreenA } from 'src/screens/ScreenA'
import { SignIn } from 'src/containers/SignIn'
import { Month } from 'src/components/Month'
import { CalendarDate } from 'src/entities/CalendarDate'

import 'src/static/style.scss'

interface PP {
  num: CalendarDate
  current: CalendarDate
}
const EmptyCal: FC<PP> = ({ num, current }) => {
  return (
    <div style={{ height: 310, display: 'flex', flexFlow: 'column nowrap' }}>
      <Month
        startDate={num}
        handleDate={() => {}}
        tasks={[]}
        current={current}
      />
    </div>
  )
}
const App = () => {
  const { visible } = useContext(VisibilityContext)
  const { syncTime, calendar } = useContext(CalendarContext)
  const { updatedAt } = useContext(IntervalContext)
  const auth = useAuth()

  useEffect(() => {
    if (visible) {
      syncTime()
    }
  }, [visible, updatedAt])

  const num = new CalendarDate(
    calendar.currentDate.y,
    calendar.currentDate.m + calendar.currentIndex,
    1
  )
  const page = !auth.loaded ? (
    <EmptyCal num={num} current={calendar.currentDate} />
  ) : auth.user ? (
    <ScreenA user={auth.user} />
  ) : (
    <>
      <EmptyCal num={num} current={calendar.currentDate} />
      <SignIn />
    </>
  )
  const showMenu = !(auth.loaded && !auth.user)
  return (
    <Layout
      num={num.m}
      loading={!auth.loaded}
      page={page}
      showMenu={showMenu}
    />
  )
}

render(
  <IntervalProvider>
    <VisibilityProvider>
      <CalendarProvider>
        <App />
      </CalendarProvider>
    </VisibilityProvider>
  </IntervalProvider>,
  document.getElementById('app')
)
