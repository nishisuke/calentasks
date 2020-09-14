import React, { ReactNode, FC, useContext, useEffect, useState } from 'react'
import { CalendarContext } from 'src/contexts/calendar'
// @ts-ignore
import ScrollOut from 'scroll-out'

interface Props {
  page: ReactNode
}
interface MP {
  hero: number
  openChildren: ReactNode
  closeChildren: ReactNode
  num: number
  menuopen: boolean
  setMenuopen: () => void
}
const Menu: FC<MP> = ({
  num,
  hero,
  openChildren,
  closeChildren,
  setMenuopen,
  menuopen,
}) => {
  return (
    <>
      <div data-scroll className="myheader" style={{ height: `${hero}px` }}>
        <span className="mymenu" onClick={setMenuopen}>
          <i className="fas fa-bars" />
        </span>
        <span className="monthlabel">{num}月</span>
      </div>
      {menuopen && openChildren}
      {!menuopen && closeChildren}
    </>
  )
}

export const Layout: FC<Props> = ({ page }) => {
  const [menuopen, setMenuopen] = useState(false)
  const { calendar } = useContext(CalendarContext)
  const hero = 40
  useEffect(() => {
    if (menuopen) return () => {}

    const so = ScrollOut({
      offset: hero,
      cssProps: {
        visibleY: true,
      },
    })

    return so.teardown
  }, [menuopen])

  return (
    <>
      <Menu
        menuopen={menuopen}
        setMenuopen={() => setMenuopen(!menuopen)}
        hero={hero}
        num={((calendar.thisMonth + calendar.currentIndex - 1) % 12) + 1}
        closeChildren={page}
        openChildren={<div>hoge</div>}
      />
    </>
  )
}
