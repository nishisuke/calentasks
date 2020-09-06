import React, { FC, useEffect, useState, useRef } from 'react'

import { Calendar } from 'src/containers/Calendar'
import { TaskList } from 'src/containers/TaskList'
import { Task } from 'src/types/Task'
import { CSSTransition } from 'react-transition-group'
import { AuthedUser } from 'src/types/AuthedUser'

import firebase from 'firebase/app'
import { signOut } from 'src/services/authService'

interface FP {
  onClick: () => void
}

const FAB: FC<FP> = ({ onClick, children }) => (
  <button onClick={onClick} className="button is-floating is-small is-primary">
    {children}
  </button>
)

interface P {
  user: AuthedUser
}

const calundoneorder = (a: Task, b: Task) => {
  return a.date === b.date ? b.activatedAt - a.activatedAt : a.date! - b.date!
}

const calnoundoneorder = (cal: Task, nocal: Task, now: number) => {
  if (nocal.orderDate) {
    return cal.date! === nocal.orderDate ? -1 : cal.date! - nocal.orderDate
  } else {
    return cal.date! === now
      ? nocal.activatedAt - cal.activatedAt
      : cal.date! - now
  }
}

//  date?: number
//  orderDate?: number
//  orderDateIndex?: number
//
//  activatedAt: number
//  doneAt?: number
const undoneorder = (t: Task[]) => {
  const copy = [...t]
  const now = Date.now() // TODO: 00:00:00
  copy.sort((a: Task, b: Task) => {
    if (a.date && b.date) {
      return calundoneorder(a, b)
    }
    if (a.date && !b.date) {
      return calnoundoneorder(a, b, now)
    }
    if (!a.date && b.date) {
      return -1 * calnoundoneorder(a, b, now)
    }
    if (!a.date && !b.date) {
      if (a.orderDate && b.orderDate) {
        return a.orderDate === b.orderDate
          ? a.orderDateIndex! - b.orderDateIndex!
          : a.orderDate - b.orderDate
      }
      if (a.orderDate && !b.orderDate) {
        return a.orderDate! === now
          ? b.activatedAt - a.activatedAt
          : a.orderDate! - now
      }
      if (!a.orderDate && b.orderDate) {
        return b.orderDate! === now
          ? b.activatedAt - a.activatedAt
          : now - b.orderDate!
      }
      if (!a.orderDate && !b.orderDate) {
        return b.activatedAt - a.activatedAt
      }
      //  orderDate?: number
      //  orderDateIndex?: number
      //
      //  activatedAt: number
      //  doneAt?: number
    }
    return 0
  })
  return copy
}

type DoneTask = { [key: string]: Task[] }
export const ScreenA: FC<P> = ({ user }) => {
  const [dones, setDones] = useState<DoneTask>({ done: [], undone: [] })
  const [order, setOrder] = useState<string[]>([])
  const dateOrder: (number | null)[] = order.map((st) => {
    if (/^\d{8,8}$/.test(st)) {
      return new Date(
        parseInt(st.slice(0, 4), 10),
        parseInt(st.slice(4, 6), 10) - 1,
        parseInt(st.slice(6, 8), 10)
      ).getTime()
    } else {
      return null
    }
  })
  const now = new Date()
  const tod = new Date(
    now.getFullYear(),
    now.getMonth() - 1,
    now.getDate()
  ).getTime()
  const revIn: number = dateOrder.reverse().findIndex((r) => r && r <= tod)
  const beforeTodayIndex: number | null =
    revIn === -1 ? null : dateOrder.length - revIn - 1

  const [addMode, setAddMode] = useState(false)
  const [animTrigger, setAnimTrigger] = useState({
    in: false,
    title: '',
  })
  const inputRef = useRef<HTMLInputElement>(null)
  const [t, sett] = useState('')
  const [d, setdt] = useState<number | undefined>(undefined)

  const addAndEnd = async ({
    title,
    date,
  }: {
    title: string
    date?: number
  }) => {
    if (title) {
      addTask({ title, date }).then(() => setAddMode(false))
      // TODO: catch
    } else {
      setAddMode(false)
    }
  }
  useEffect(() => {
    firebase
      .firestore()
      .collection('tasks')
      .where('userID', '==', user.uid)
      .get()
      .then(function (querySnapshot: any) {
        const arr: Task[] = []
        querySnapshot.forEach(function (doc: any) {
          const data = doc.data()
          arr.push({
            ...data,
            id: doc.id,
            date: data?.date || undefined,
          })
        })

        const done = arr.filter((b) => b.done)
        const undone = arr.filter((b) => !b.done)
        setDones({
          done: undoneorder(done),
          undone,
        })
      })
      .catch((e: Error) => console.error(e)) // TODO

    firebase
      .firestore()
      .collection('order')
      .doc(user.uid)
      .get()
      .then((doc: any) => {
        if (doc.exists) {
          setOrder(doc.data().keysInOrder)
        } else {
          // TODO
        }
      })
      .catch((e: Error) => console.error(e)) // TODO
  }, [])

  const addTask = async ({ title, date }: { title: string; date?: number }) => {
    try {
      const doc = firebase.firestore().collection('tasks').doc()
      const added = Date.now()
      const ob = {
        done: false,
        title,
        date: date || null,
        userID: user.uid,
        activatedAt: added,
        createdAt: added,
      }
      await doc.set(ob)
      let keysInOrder = [...order]

      if (date) {
        const dateOb = new Date(date)
        const dateKey = `${dateOb.getFullYear()}${
          dateOb.getMonth() + 1
        }${dateOb.getDate()}`
        if (dateOrder.indexOf(date) === -1) {
          if (date > tod) {
            const plu = dateOrder.findIndex((k) => k && k > date)
            if (plu > -1) {
              keysInOrder = [
                ...keysInOrder.slice(0, plu),
                dateKey,
                ...keysInOrder.slice(plu),
              ]
            } else {
              keysInOrder = [...keysInOrder, dateKey]
            }
          } else {
            if (beforeTodayIndex) {
              // TODO: 一旦雑にやった
              keysInOrder = [dateKey, ...keysInOrder]
            } else {
              keysInOrder = [dateKey, ...keysInOrder]
            }
          }
        }
      } else {
        if (beforeTodayIndex) {
          keysInOrder = [
            ...keysInOrder.slice(0, beforeTodayIndex + 1),
            doc.id,
            ...keysInOrder.slice(beforeTodayIndex + 1),
          ]
        } else {
          keysInOrder = [doc.id, ...keysInOrder]
        }
      }

      await firebase
        .firestore()
        .collection('order')
        .doc(user.uid)
        .set({ keysInOrder })

      sett('')
      setdt(undefined)
      setAnimTrigger({ in: !animTrigger.in, title })
      const task: Task = { ...ob, id: doc.id, date: date }

      setDones((b) => {
        const undone = [...b.undone, task]

        return {
          ...b,
          undone: undoneorder(undone),
        }
      })
    } catch (e) {
      // TODO: e
      alert('fail')
    }
  }

  useEffect(() => {
    if (addMode) inputRef.current?.focus()
  }, [addMode])

  const setDate = (y: number, m: number, d: number) =>
    setdt(new Date(y, m - 1, d).getTime())
  const handleDate = addMode
    ? setDate
    : (y: number, m: number, d: number) => {
        setDate(y, m, d)
        setAddMode(true)
      }

  const toggle = async (t: Task) => {
    try {
      const doc = firebase.firestore().collection('tasks').doc(t.id)
      const now = Date.now()
      const upda = t.done
        ? { done: !t.done, activatedAt: now }
        : { done: !t.done, doneAt: now }
      await doc.set(upda, { merge: true })

      setDones((b) => {
        const removeArr = t.done ? b.done : b.undone
        const addedArr = !t.done ? b.done : b.undone
        const tar: Task = removeArr.find((e) => e.id === t.id)!
        const toggled = { ...tar, ...upda }
        const removed = removeArr.filter((e) => e.id !== t.id)
        const added = [...addedArr, toggled]

        return t.done
          ? {
              done: removed,
              undone: undoneorder(added),
            }
          : {
              done: added,
              undone: undoneorder(removed),
            }
      })
    } catch (e) {
      // TODO: e
      alert('fail')
    }
  }

  const li: Task[][] = []
  order.map((st) => {
    if (/^\d{8,8}$/.test(st)) {
      const ts = new Date(
        parseInt(st.slice(0, 4), 10),
        parseInt(st.slice(4, 6), 10) - 1,
        parseInt(st.slice(6, 8), 10)
      ).getTime()
      li.push(dones.undone.filter((t) => t.date && t.date === ts))
    }

    const t = dones.undone.find((t) => t.id === st)
    if (t) li.push([t])
  })

  return (
    <>
      <Calendar handleDate={handleDate} />
      {addMode && (
        <>
          <div className="field has-addons">
            <div className="control">
              <input
                ref={inputRef}
                onChange={(e) => sett(e.target.value)}
                value={t}
                className="input"
                type="text"
              />
            </div>
            <div className="control">
              <button
                onClick={() => addTask({ title: t, date: d })}
                className="button"
              >
                保存
              </button>
            </div>
          </div>
          {d && (
            <div className="field ">
              <p className="help">
                {new Date(d).getFullYear()}/{new Date(d).getMonth() + 1}/
                {new Date(d).getDate()}
              </p>
            </div>
          )}
        </>
      )}

      <CSSTransition in={animTrigger.in} timeout={2000} classNames="my-check">
        <span className="my-check">
          <i className={`fas fa-check`} />
          {animTrigger.title} を保存しました
        </span>
      </CSSTransition>
      {!addMode && (
        <FAB onClick={() => setAddMode(true)}>
          <i className={`fas fa-plus`} />
        </FAB>
      )}
      {addMode && t && (
        <FAB onClick={() => addAndEnd({ title: t, date: d })}>OK</FAB>
      )}
      {addMode && !t && (
        <FAB onClick={() => setAddMode(false)}>
          <i className={`fas fa-times`} />
        </FAB>
      )}

      {!addMode && <TaskList setTasks={setDones} tasks={li} toggle={toggle} />}
      <button onClick={signOut} className="button ">
        sign out
      </button>
    </>
  )
}
