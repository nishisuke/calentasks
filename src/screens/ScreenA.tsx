import React, { FC, useEffect, useState, useRef } from 'react'

import { Calendar } from 'src/containers/Calendar'
import { TaskList } from 'src/containers/TaskList'
import { Task } from 'src/types/Task'
import { CSSTransition } from 'react-transition-group'
import { Auth } from 'src/types'
import { SignIn } from 'src/containers/SignIn'

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
  auth: Auth
}
export const ScreenA: FC<P> = ({ auth }) => {
  const [tasks, setTasks] = useState<Task[]>([])
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
      .where('userID', '==', auth.user!.uid)
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
        setTasks(arr)
      })
      .catch((e: Error) => console.error(e)) // TODO
  }, [])

  const addTask = async ({ title, date }: { title: string; date?: number }) => {
    try {
      const doc = firebase.firestore().collection('tasks').doc()
      const ob = {
        done: false,
        title,
        date: date || null,
        userID: auth.user!.uid,
      }
      await doc.set(ob)

      sett('')
      setdt(undefined)
      setAnimTrigger({ in: !animTrigger.in, title })
      const task: Task = { ...ob, id: doc.id, date: date }
      setTasks((b) => [...b, task])
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
      await doc.set({ done: !t.done }, { merge: true })

      setTasks((b) => {
        const i: number = b.findIndex((e) => e.id === t.id)
        const tar: Task = b[i]
        const copy = [...b]
        copy[i] = { ...tar, done: true }
        return copy
      })
    } catch (e) {
      // TODO: e
      alert('fail')
    }
  }

  if (!auth.loaded) {
    return <div>Loading</div>
  } else if (!auth.user) {
    return <SignIn />
  } else if (auth.user) {
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

        {!addMode && <TaskList tasks={tasks} toggle={toggle} />}
        <button onClick={signOut} className="button ">
          sign out
        </button>
      </>
    )
  } else {
    throw new Error('Fail')
  }
}
