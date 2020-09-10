import { useState, useEffect } from 'react'
import * as firebase from 'firebase/app'

import { Auth } from 'src/types'

const auth = firebase.auth()
const convert = (user: firebase.User | null) => {
  const _auth: Auth = {
    loaded: true,
  }
  if (user) {
    _auth.user = user
  }
  return _auth
}

export const useAuth = () => {
  const [authObj, setAuth] = useState<Auth>({ loaded: false })

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(
      (user: firebase.User | null) => setAuth(convert(user)),
      (e: firebase.auth.Error) => {
        console.error(e)
      }
    )
    return unsubscribe
  }, [])

  return authObj
}
