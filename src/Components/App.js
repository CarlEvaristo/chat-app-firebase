import React from  "react"
import firebase from "firebase/app"
import "firestore/firestore"
import "firebase/auth"
import {useAuthState} from "react-firebase-hooks/auth"
import {useCollectionData} from "react-firebase-hooks/firestore"
import SignIn from "./SignIn"

firebase.initializeApp({
  apiKey: "AIzaSyCRcGwwxufrDebkMmbyKORG_XmUOVXgnGM",
  authDomain: "chat-app-2c50f.firebaseapp.com",
  projectId: "chat-app-2c50f",
  storageBucket: "chat-app-2c50f.appspot.com",
  messagingSenderId: "39400765644",
  appId: "1:39400765644:web:0c81f650fcdfc524e7aa69"
})

const auth = firebase.auth()
const firestore = firebase.firestore()

function App() {
  const [user] = useAuthState(auth)   // user signed in? => object with user info => not signed in? => null
  return (
    <div className="App">
      <header className="App-header">
      
      <section>
        {user? <Chatroom /> : <Signin />}
      </section>
      </header>
    </div>
  );
}

export default App;
