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
    if (beforeTodayIndex !== null) {
      return beforeTodayIndex + 1
    } else {
      return 0
    }
  }

  if (order.findIndex((b) => b.ts === date.ts) !== -1) {
    return null
  }

  if (date.ts > tod) {
    // OK
    const plu = dateOrder.findIndex((k) => k && k > date.ts)
    if (plu > -1) {
      return plu
    } else {
      return order.length
    }
  }
  // today or 過去
  if (beforeTodayIndex === null) {
    return 0
  }
  const beforeval = order[beforeTodayIndex]
  const beforets = beforeval.ts!
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
      const orderDoc = db.collection('order').doc(user.uid)
      const [task, keysInOrder] = await db.runTransaction(
        async (transaction) => {
          const sfDoc = await transaction.get(orderDoc)
          if (!sfDoc.exists) {
            throw 'Document does not exist!'
          }
          const latestOrder = sfDoc
            .data()!
            .keysInOrder.map((b: string | number) => {
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

          const inde = bbb(latestOrder, date)
          const keysInOrder = [...latestOrder]
          if (inde !== null) {
            keysInOrder.splice(inde, 0, getKey(date || doc.id))
          }

          await transaction.set(doc, ob)
          await transaction.set(orderDoc, {
            keysInOrder: keysInOrder.map((i) =>
              i.ts ? parseInt(i.key, 10) : i.key
            ),
          })
          return [{ ...ob, id: doc.id, date: date?.ts }, keysInOrder]
        }
      )

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
      const db = firebase.firestore()
      const doc = firebase.firestore().collection('tasks').doc(t.id)
      const upda = { done: true, doneAt: Date.now() }
      const orderDoc = db.collection('order').doc(user.uid)

      const tmpLocalOrder = await db.runTransaction(async (transaction) => {
        const sfDoc = await transaction.get(orderDoc)
        if (!sfDoc.exists) {
          throw 'Document does not exist!'
        }
        const latestOrder = sfDoc
          .data()!
          .keysInOrder.map((b: string | number) => {
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

        let keysInOrder = [...latestOrder]
        let tmpLocalOrder = [...latestOrder]
        if (t.date) {
          if (todos.filter((l) => l.date === t.date).length === 1) {
            keysInOrder = keysInOrder.filter((b) => b.ts !== t.date)
            // NOTE: dbだけdate消す
          }
        } else {
          keysInOrder = keysInOrder.filter((b) => b.key !== t.id)
          tmpLocalOrder = [...keysInOrder]
        }

        await transaction.update(doc, upda)
        await transaction.set(orderDoc, {
          keysInOrder: keysInOrder.map((i) =>
            i.ts ? parseInt(i.key, 10) : i.key
          ),
        })
        return tmpLocalOrder
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
    const newOrder = reorder(order, a, b)
    setFoo((be) => ({
      ...be,
      order: newOrder,
    }))
    const db = firebase.firestore()
    const orderDoc = db.collection('order').doc(user.uid)
    const keysInOrder = newOrder.map((i) =>
      i.ts ? parseInt(i.key, 10) : i.key
    )

    // TODO: error
    db.runTransaction(async (transaction) => {
      const sfDoc = await transaction.get(orderDoc)
      if (!sfDoc.exists) {
        throw 'Document does not exist!'
      }
      if (
        sfDoc.data()!.keysInOrder.join() !==
        order.map((i) => (i.ts ? parseInt(i.key, 10) : i.key)).join()
      ) {
        throw 'change'
      }

      transaction.set(orderDoc, {
        keysInOrder,
      })
    })
  }

  useEffect(() => {
    // TODO: listen error
    let o = () => {}
    let un = () => {}
    un = firebase
      .firestore()
      .collection('tasks')
      .where('userID', '==', user.uid)
      .where('done', '==', false)
      .onSnapshot(function (snapshot) {
        // @ts-ignore
        const tasks: Task[] = snapshot.docs.map((doc) => {
          const data = doc.data()
          return {
            ...data,
            id: doc.id,
            date: data?.date || undefined,
          }
        })
        setFoo((b) => ({
          ...b,
          todos: tasks,
        }))
      })

    o = firebase
      .firestore()
      .collection('order')
      .doc(user.uid)
      .onSnapshot(function (doc) {
        let ord: IKey[] = []
        const d = doc.data()
        if (doc.exists && d) {
          ord = d.keysInOrder.map((b: string | number) => {
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
        }

        setFoo((b) => ({
          ...b,
          order: ord,
        }))
      })

    return () => {
      o()
      un()
    }
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
