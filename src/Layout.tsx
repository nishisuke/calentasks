import React, { ReactNode, FC, useContext, useEffect, useState } from 'react'
import { CalendarContext } from 'src/contexts/calendar'
// @ts-ignore
import ScrollOut from 'scroll-out'
import { MenuContent } from 'src/components/MenuContent'

interface Props {
  page: ReactNode
  loading: boolean
  showMenu: boolean
  num: number
}
interface MP {
  num: number
  icon: ReactNode
}
const LI = () => (
  <span className="mymenu loading">
    <i className="fas fa-spinner fa-pulse" />
  </span>
)

interface IP {
  click: () => void
  open: boolean
}
const MI: FC<IP> = ({ click, open }) => (
  <span className={`mymenu ${!open && 'myfloatmenu'}`} onClick={click}>
    <i className="fas fa-bars" />
  </span>
)

const hero = 40
const Header: FC<MP> = ({ num, icon }) => {
  const { calendar, setCalendar } = useContext(CalendarContext)

  const ch = (diff: number) => {
    setCalendar((before) => ({
      ...before,
      currentIndex: before.currentIndex + diff,
    }))
  }
  return (
    <div data-scroll className="myheader" style={{ height: hero }}>
      {icon}
      <span className="monthlabel">{num}月</span>
      <div className="headertail">
        <span className="myiconwrap" onClick={() => ch(-1)}>
          <i className="fas fa-angle-left" />
        </span>
        <span className="myiconwrap" onClick={() => ch(1)}>
          <i className="fas fa-angle-right" />
        </span>
      </div>
    </div>
  )
}

export const Layout: FC<Props> = ({ num, showMenu, page, loading }) => {
  const [menuopen, setMenuopen] = useState(false)

  return (
    <>
      <Header
        num={num}
        icon={
          loading ? (
            <LI />
          ) : showMenu ? (
            <MI open={menuopen} click={() => setMenuopen(!menuopen)} />
          ) : (
            <div style={{ width: 37 }}></div>
          )
        }
      />
      {menuopen && <MenuContent />}
      {!menuopen && page}
    </>
  )
}
