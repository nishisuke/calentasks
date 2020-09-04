import * as firebase from 'firebase/app'

export const signOut = () => firebase.auth().signOut()

export const signIn = async () => {
  const provider = new firebase.auth.GoogleAuthProvider()
  await firebase
    .auth()
    .signInWithPopup(provider)
    .catch(function (error: Error) {
      // TODO
      // // Handle Errors here.
      // var errorCode = error.code;
      // var errorMessage = error.message;
      // // The email of the user's account used.
      // var email = error.email;
      // // The firebase.auth.AuthCredential type that was used.
      // var credential = error.credential;
      // // ...
    })
}

export const signUp = (e: string, p: string) =>
  firebase.auth().createUserWithEmailAndPassword(e, p)
