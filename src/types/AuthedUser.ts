import { User } from 'firebase/app'

// export type AuthedUser = User & {}
export type AuthedUser = { uid: string }
