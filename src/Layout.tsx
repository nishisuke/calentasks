import React, { ReactNode, FC, useContext, useEffect, useState } from 'react'
import { CalendarContext } from 'src/contexts/calendar'
// @ts-ignore
import ScrollOut from 'scroll-out'

interface Props {
  page: ReactNode
  menu: ReactNode
  loading: boolean
}
interface MP {
  hero: number
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

const Header: FC<MP> = ({ num, hero, icon }) => {
  return (
    <div data-scroll className="myheader" style={{ height: `${hero}px` }}>
      {icon}
      <span className="monthlabel">{num}月</span>
    </div>
  )
}

export const Layout: FC<Props> = ({ menu, page, loading }) => {
  const [menuopen, setMenuopen] = useState(false)
  const { calendar } = useContext(CalendarContext)
  const hero = 40

  useEffect(() => {
    let cb = () => {}
    if (!menuopen && !loading) {
      const so = ScrollOut({
        offset: hero,
        cssProps: {
          visibleY: true,
        },
      })
      cb = so.teardown
    }

    return cb
  }, [menuopen, loading])

  return (
    <>
      <Header
        hero={hero}
        num={((calendar.thisMonth + calendar.currentIndex - 1) % 12) + 1}
        icon={
          loading ? (
            <LI />
          ) : (
            <MI open={menuopen} click={() => setMenuopen(!menuopen)} />
          )
        }
      />
      {menuopen && menu}
      {!menuopen && page}
    </>
  )
}
