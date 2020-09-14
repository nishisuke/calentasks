import React, { FC, useEffect, useState } from 'react'
import firebase from 'firebase/app'

import { Task } from 'src/types/Task'
import { signOut } from 'src/services/authService'
import { AuthedUser } from 'src/types/AuthedUser'

interface P {
  user: AuthedUser
}

export const MenuContent: FC<P> = ({ user }) => {
  const [dones, set] = useState<Task[]>([])

  useEffect(() => {
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
        return arr
        arr.sort((a, b) => b.doneAt! - a.doneAt!)
        set(arr)
      })
    // TODO: catch
  }, [])

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