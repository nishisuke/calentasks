import * as firebase from 'firebase/app'

export const signOut = () => firebase.auth().signOut()
export const signIn = (e: string, p: string) =>
  firebase.auth().signInWithEmailAndPassword(e, p)
export const signUp = (e: string, p: string) =>
  firebase.auth().createUserWithEmailAndPassword(e, p)
