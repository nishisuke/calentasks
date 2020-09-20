import React, { FC, useEffect, useState } from 'react'
import firebase from 'firebase/app'

import { Task } from 'src/types/Task'
import { signOut } from 'src/services/authService'
import { AuthedUser } from 'src/types/AuthedUser'
import { useAuth } from 'src/hooks/useAuth'

interface P {}

export const MenuContent: FC<P> = ({}) => {
  const auth = useAuth()
  const { user } = auth
  const [dones, set] = useState<Task[]>([])

  // TODO: show errored
  //  const filtered: Task[] = order.reduce(
  //    (acc: Task[], o: IKey) => [...acc, ...o.filterTasks(tasks)],
  //    []
  //  )
  //  const errored = tasks.filter((i) => !filtered.find((a) => a.id === i.id))

  useEffect(() => {
    if (!user) return
    firebase
      .firestore()
      .collection('tasks')
      .where('userID', '==', user.uid)
      .where('done', '==', true)
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
        arr.sort((a, b) => b.doneAt! - a.doneAt!)
        set(arr)
      })
    // TODO: catch
  }, [user])

  return (
    <>
      <button onClick={signOut} className="button ">
        sign out
      </button>
      {dones.map((t) => (
        <div key={t.id}>{t.title}</div>
      ))}
    </>
  )
}
