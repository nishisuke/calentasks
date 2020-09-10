import React, { FC, useEffect, useState, useRef } from 'react'
import { Task } from 'src/types/Task'
import { AuthedUser } from 'src/types/AuthedUser'

import firebase from 'firebase/app'
import { CalendarDate } from 'src/entities/CalendarDate'
import { IKey, TaskKey } from 'src/entities/TaskKey'

const reorder = <T>(list: T[], startIndex: number, endIndex: number): T[] => {
  const result: T[] = [...list]
  const [removed] = result.splice(startIndex, 1)
  result.splice(endIndex, 0, removed)

  return result
}

export const bbb = (
  order: IKey[],
  key: IKey,
  date: CalendarDate | undefined
) => {
  const dateOrder: (number | null)[] = order.map((st) => {
    return st.ts
  })
  const now = new Date()
  const tod = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate()
  ).getTime()

  const revIn: number = [...dateOrder].reverse().findIndex((r) => r && r <= tod)
  const beforeTodayIndex: number | null =
    revIn === -1 ? null : dateOrder.length - revIn - 1
  const keysInOrder: IKey[] = [...order]

  if (!date) {
    console.log('order', 'no date', beforeTodayIndex)
    if (beforeTodayIndex !== null) {
      keysInOrder.splice(beforeTodayIndex + 1, 0, key)
      return keysInOrder
    } else {
      return [key, ...keysInOrder]
    }
  }

  const dateKeyExists = order.indexOf(key) !== -1
  if (dateKeyExists) {
    console.log('order', 'dateex')
    return keysInOrder
  }
  console.log('order', 'datenotex')

  if (date.ts > tod) {
    // OK
    console.log(dateOrder, date.ts)
    const plu = dateOrder.findIndex((k) => k && k > date.ts)
    console.log('order', 'dateaftoday', plu)
    if (plu > -1) {
      keysInOrder.splice(plu, 0, key)
      return keysInOrder
    } else {
      return [...keysInOrder, key]
    }
  }
  // today or 過去
  if (beforeTodayIndex === null) {
    console.log('order', 'datebetodayunex')
    return [key, ...keysInOrder]
  }
  const beforeval = order[beforeTodayIndex]
  const beforets = beforeval.ts! // TODO
  console.log('order', 'datebetodayex', beforets)
  if (date.ts < beforets) {
    const findin = dateOrder.findIndex((ts) => ts && ts > date.ts)
    keysInOrder.splice(findin, 0, key)
    return keysInOrder
  } else {
    keysInOrder.splice(beforeTodayIndex + 1, 0, key)
    return keysInOrder
  }
}
export const useTask = (user: AuthedUser) => {
  const [dones, setDones] = useState<Task[]>([])
  const [order, setOrder] = useState<IKey[]>([])
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
      const keysInOrder = bbb(order, new TaskKey(date || doc.id), date)
      const orderDoc = db.collection('order').doc(user.uid)
      const task = await db.runTransaction(async (transaction) => {
        await transaction.set(doc, ob)
        await transaction.set(orderDoc, {
          keysInOrder: keysInOrder.map((i) => i.key),
        })
        return { ...ob, id: doc.id, date: date?.ts }
      })

      setOrder(keysInOrder)
      setDones((b) => [...b, task])

      setAdding(false)
      return ''
    } catch (e) {
      setAdding(false)
      // TODO: e
      alert('fail')
      return '失敗しました'
    }
  }

  const toggle = async (t: Task) => {
    setDoingDone(true)
    try {
      let keysInOrder = [...order]
      let tmpLocalOrder = [...order]
      if (t.date) {
        if (dones.filter((l) => l.date === t.date).length === 1) {
          keysInOrder = keysInOrder.filter((b) => !b.ts || b.ts !== t.date)
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

      const task = await db.runTransaction(async (transaction) => {
        await transaction.update(doc, upda)
        await transaction.set(orderDoc, { keysInOrder })
      })

      setOrder(tmpLocalOrder)
      setDones((b) => {
        const tar: Task = dones.find((e) => e.id === t.id)!
        const toggled = { ...tar, ...upda }

        return [...b.filter((e) => e.id !== t.id), toggled]
      })
      setDoingDone(false)
    } catch (e) {
      setDoingDone(false)
      // TODO: e
      alert('fail')
    }
  }

  const setO = (a: number, b: number) => {
    setOrder(reorder(order, a, b))
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
        setDones(arr)
      })
      .catch((e: Error) => console.error(e)) // TODO

    firebase
      .firestore()
      .collection('order')
      .doc(user.uid)
      .get()
      .then((doc: any) => {
        if (doc.exists) {
          setOrder(doc.data().keysInOrder.map((b: any) => new TaskKey(b)))
        } else {
          // TODO
        }
      })
      .catch((e: Error) => console.error(e)) // TODO
  }, [])

  return {
    addTask,
    moveItem: setO,
    toggle,
    adding,
    doingDone,
    tasks: dones.filter((t) => !t.done),
    order,
  }
}
