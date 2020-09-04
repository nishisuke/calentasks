import React, { FC } from 'react'

import { signIn } from 'src/services/authService'
interface M {}

export const SignIn: FC<M> = ({}) => {
  return (
    <>
      <button onClick={signIn}>sign in</button>
    </>
  )
}
