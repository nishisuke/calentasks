import React, { FC, useEffect, useState, useRef } from 'react'
import { Task } from 'src/types/Task'
import { AuthedUser } from 'src/types/AuthedUser'

import firebase from 'firebase/app'

export const useTask = (user: AuthedUser) => {
  const [dones, setDones] = useState<Task[]>([])
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
        const dateKey = `${dateOb.getFullYear()}${`0${
          dateOb.getMonth() + 1
        }`.slice(-2)}${`0${dateOb.getDate()}`.slice(-2)}`
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

      setOrder(keysInOrder)
      const task: Task = { ...ob, id: doc.id, date: date }

      setDones((b) => [...b, task])
    } catch (e) {
      // TODO: e
      alert('fail')
    }
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
        const tar: Task = dones.find((e) => e.id === t.id)!
        const toggled = { ...tar, ...upda }

        return [...b.filter((e) => e.id !== t.id), toggled]
      })
    } catch (e) {
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
    console.log(tasksGroups.reduce((ac, arr) => [...ac, ...arr], []).length)
    console.log(tasksGroups)
    console.log(order)
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
  }
}
