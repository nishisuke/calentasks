import React, { FC, useEffect, useState, useRef } from 'react'
import { Task } from 'src/types/Task'
import { AuthedUser } from 'src/types/AuthedUser'

import firebase from 'firebase/app'
import { CalendarDate } from 'src/entities/CalendarDate'
const aaa = async (
  title: string,
  date: CalendarDate | undefined,
  userID: string
): Promise<Task> => {
  const doc = firebase.firestore().collection('tasks').doc()
  const added = Date.now()
  const ob = {
    done: false,
    title,
    date: date?.ts || null,
    userID,
    activatedAt: added,
    createdAt: added,
  }
  await doc.set(ob)
  return { ...ob, id: doc.id, date: date?.ts }
}
const bbb = (order: string[], key: string, date: CalendarDate | undefined) => {
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
    now.getMonth(),
    now.getDate()
  ).getTime()

  const revIn: number = [...dateOrder].reverse().findIndex((r) => r && r <= tod)
  const beforeTodayIndex: number | null =
    revIn === -1 ? null : dateOrder.length - revIn - 1
  const keysInOrder = [...order]

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
  const beforets = new Date(
    parseInt(beforeval.slice(0, 4), 10),
    parseInt(beforeval.slice(4, 6), 10) - 1,
    parseInt(beforeval.slice(6, 8), 10)
  ).getTime()
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
  const [order, setOrder] = useState<string[]>([])
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
      // TODO: transac
      const task = await aaa(title, date, user.uid)
      const keysInOrder = bbb(order, date?.key || task.id, date)

      await firebase
        .firestore()
        .collection('order')
        .doc(user.uid)
        .set({ keysInOrder })

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
      const doc = firebase.firestore().collection('tasks').doc(t.id)
      const now = Date.now()
      const upda = t.done
        ? { done: !t.done, activatedAt: now }
        : { done: !t.done, doneAt: now }
      await doc.set(upda, { merge: true })
      let keysInOrder = [...order]
      if (t.date && dones.filter((l) => l.date === t.date).length === 1) {
        const d = new Date(t.date)
        const cald = new CalendarDate(
          d.getFullYear(),
          d.getMonth() + 1,
          d.getDate()
        )
        keysInOrder = keysInOrder.filter((b) => b !== cald.key)
      } else {
        keysInOrder = keysInOrder.filter((b) => b !== t.id)
      }
      await firebase
        .firestore()
        .collection('order')
        .doc(user.uid)
        .set({ keysInOrder })
      setOrder(keysInOrder)

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
    const reorder = <T>(
      list: T[],
      startIndex: number,
      endIndex: number
    ): T[] => {
      const result = [...list]
      const [removed] = result.splice(startIndex, 1)
      result.splice(endIndex, 0, removed)

      return result
    }

    setOrder(reorder(order, a, b))
  }

  const tasksGroups: Task[][] = []
  order.map((st) => {
    if (/^\d{8,8}$/.test(st)) {
      const ts = new Date(
        parseInt(st.slice(0, 4), 10),
        parseInt(st.slice(4, 6), 10) - 1,
        parseInt(st.slice(6, 8), 10)
      ).getTime()
      tasksGroups.push(dones.filter((t) => !t.done && t.date && t.date === ts))
    }

    const t = dones.find((t) => !t.done && t.id === st)
    if (t) tasksGroups.push([t])
  })

  // TODO
  if (
    dones.filter((t) => !t.done).length !==
    tasksGroups.reduce((ac, arr) => [...ac, ...arr], []).length
  ) {
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
          setOrder(doc.data().keysInOrder)
        } else {
          // TODO
        }
      })
      .catch((e: Error) => console.error(e)) // TODO
  }, [])

  return {
    addTask,
    moveItem: setO,
    tasksGroups,
    toggle,
    adding,
    doingDone,
  }
}
