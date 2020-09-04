import { AuthedUser } from 'src/types/AuthedUser'

export interface Auth {
  loaded: boolean
  user?: AuthedUser
}
