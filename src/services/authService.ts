import * as firebase from 'firebase/app'

export const signOut = () => firebase.auth().signOut()

export const signIn = async () => {
  const provider = new firebase.auth.GoogleAuthProvider()
  await firebase
    .auth()
    .signInWithRedirect(provider)
    .catch(function (e: Error) {
      console.error(e)
    })
}

export const signUp = (e: string, p: string) =>
  firebase.auth().createUserWithEmailAndPassword(e, p)
