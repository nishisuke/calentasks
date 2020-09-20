import React, { FC, useEffect, useState, useRef } from 'react'
import { Task } from 'src/types/Task'
import { AuthedUser } from 'src/types/AuthedUser'

import firebase from 'firebase/app'
import { CalendarDate } from 'src/entities/CalendarDate'
import { IKey, getKey } from 'src/entities/TaskKey'

const reorder = <T>(list: T[], startIndex: number, endIndex: number): T[] => {
  const result: T[] = [...list]
  const [removed] = result.splice(startIndex, 1)
  result.splice(endIndex, 0, removed)

  return result
}

export const bbb = (
  order: IKey[],
  date: CalendarDate | undefined
): number | null => {
  const dateOrder: (number | null)[] = order.map((st) => st.ts)
  const now = new Date()
  const tod = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate()
  ).getTime()

  const revIn: number = [...dateOrder].reverse().findIndex((r) => r && r <= tod)
  const beforeTodayIndex: number | null =
    revIn === -1 ? null : dateOrder.length - revIn - 1

  if (!date) {
    console.log('order', 'no date', beforeTodayIndex)
    if (beforeTodayIndex !== null) {
      return beforeTodayIndex + 1
    } else {
      return 0
    }
  }

  if (order.findIndex((b) => b.ts === date.ts) !== -1) {
    console.log('order', 'dateex')
    return null
  }
  console.log('order', 'datenotex')

  if (date.ts > tod) {
    // OK
    console.log(dateOrder, date.ts)
    const plu = dateOrder.findIndex((k) => k && k > date.ts)
    console.log('order', 'dateaftoday', plu)
    if (plu > -1) {
      return plu
    } else {
      return order.length
    }
  }
  // today or 過去
  if (beforeTodayIndex === null) {
    console.log('order', 'datebetodayunex')
    return 0
  }
  const beforeval = order[beforeTodayIndex]
  const beforets = beforeval.ts!
  console.log('order', 'datebetodayex', beforets)
  if (date.ts < beforets) {
    const findin = dateOrder.findIndex((ts) => ts && ts > date.ts)
    return findin
  } else {
    return beforeTodayIndex + 1
  }
}

interface V {
  order: IKey[]
  todos: Task[]
}
export const useTask = (user: AuthedUser) => {
  const [foo, setFoo] = useState<V>({ order: [], todos: [] })
  const { todos, order } = foo

  const [adding, setAdding] = useState(false)
  const [doingDone, setDoingDone] = useState(false)

  const addTask = async ({
    title,
    date,
  }: {
    title: string
    date?: CalendarDate
  }) => {
    if (!title) return '入力してください'
    setAdding(true)
    try {
      const db = firebase.firestore()
      const doc = db.collection('tasks').doc()
      const added = Date.now()
      const ob = {
        done: false,
        title,
        date: date?.ts || null,
        userID: user.uid,
        activatedAt: added,
        createdAt: added,
      }
      const inde = bbb(order, date)
      const keysInOrder = [...order]
      if (inde !== null) {
        keysInOrder.splice(inde, 0, getKey(date || doc.id))
      }

      const orderDoc = db.collection('order').doc(user.uid)
      const task = await db.runTransaction(async (transaction) => {
        await transaction.set(doc, ob)
        await transaction.set(orderDoc, {
          keysInOrder: keysInOrder.map((i) =>
            i.ts ? parseInt(i.key, 10) : i.key
          ),
        })
        return { ...ob, id: doc.id, date: date?.ts }
      })

      setFoo((b: V) => ({
        ...b,
        todos: [...b.todos, task],
        order: keysInOrder,
      }))

      setAdding(false)
      return ''
    } catch (e) {
      setAdding(false)
      console.error(e)
      return '失敗しました'
    }
  }

  const toggle = async (t: Task) => {
    setDoingDone(true)
    try {
      let keysInOrder = [...order]
      let tmpLocalOrder = [...order]
      if (t.date) {
        if (todos.filter((l) => l.date === t.date).length === 1) {
          keysInOrder = keysInOrder.filter((b) => b.ts !== t.date)
          // NOTE: dbだけdate消す
        }
      } else {
        keysInOrder = keysInOrder.filter((b) => b.key !== t.id)
        tmpLocalOrder = [...keysInOrder]
      }

      const db = firebase.firestore()
      const doc = firebase.firestore().collection('tasks').doc(t.id)
      const upda = { done: true, doneAt: Date.now() }
      const orderDoc = db.collection('order').doc(user.uid)

      await db.runTransaction(async (transaction) => {
        await transaction.update(doc, upda)
        await transaction.set(orderDoc, {
          keysInOrder: keysInOrder.map((i) =>
            i.ts ? parseInt(i.key, 10) : i.key
          ),
        })
      })

      const tar: Task = todos.find((e) => e.id === t.id)!
      const toggled = { ...tar, ...upda }
      setFoo((b) => ({
        ...b,
        todos: [...b.todos.filter((e) => e.id !== t.id), toggled],
        order: tmpLocalOrder,
      }))

      setDoingDone(false)
    } catch (e) {
      setDoingDone(false)
      console.error(e)
      alert('fail')
    }
  }

  const setO = (a: number, b: number) => {
    setFoo((be) => ({
      ...be,
      order: reorder(order, a, b),
    }))
  }

  useEffect(() => {
    const tasks: Promise<Task[]> = firebase
      .firestore()
      .collection('tasks')
      .where('userID', '==', user.uid)
      .where('done', '==', false)
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
        return arr
      })

    const o: Promise<IKey[]> = firebase
      .firestore()
      .collection('order')
      .doc(user.uid)
      .get()
      .then((doc: any) => {
        if (doc.exists) {
          return doc.data().keysInOrder.map((b: string | number) => {
            if (typeof b === 'number') {
              const mod = b % 10000
              return getKey(
                new CalendarDate(
                  Math.floor(b / 10000),
                  Math.floor(mod / 100),
                  mod % 100
                )
              )
            } else if (typeof b === 'string') {
              return getKey(b)
            } else {
              throw new Error('No type')
            }
          })
        } else {
          return []
        }
      })

    Promise.all([tasks, o])
      .then(([todos, order]) =>
        setFoo({
          todos,
          order,
        })
      )
      .catch((e: Error) => console.error(e))
  }, [])

  return {
    addTask,
    moveItem: setO,
    toggle,
    adding,
    doingDone,
    todos,
    order,
  }
}
