import React from  "react"

import firebase from "firebase/compat/app"
import "firebase/compat/auth"
import "firebase/compat/firestore"

import { useAuthState } from "react-firebase-hooks/auth"
import { useCollectionData } from 'react-firebase-hooks/firestore';

firebase.initializeApp({
  apiKey: "AIzaSyCRcGwwxufrDebkMmbyKORG_XmUOVXgnGM",
  authDomain: "chat-app-2c50f.firebaseapp.com",
  projectId: "chat-app-2c50f",
  storageBucket: "chat-app-2c50f.appspot.com",
  messagingSenderId: "39400765644",
  appId: "1:39400765644:web:dcaeed4b9553cca8e7aa69"
})

const auth = firebase.auth()                                     // initialize firebase authentication
const firestore = firebase.firestore()                           // initialize cloud database "firestore"

function SignIn() {                                              // SIGN IN COMPONENT (SIGN IN BUTTON => POPUP)
  const signInWithGoogle = () => {
      const provider = new firebase.auth.GoogleAuthProvider()    //determine provider (Google) 
      auth.signInWithPopup(provider)                             //sign in with popup => auth.signInWithPopup(provider)  
  }

  const signInAnonymous = () => {
      auth.signInAnonymously().catch(alert);
  }

  return (
    <main>
      <button onClick={signInWithGoogle}>Sign In With Google</button>
      <button onClick={signInAnonymous}>Sign In Anonymous</button>
    </main>
  )
}

function SignOut() {                                              // SIGN OUT COMPONENT (SIGN OUT BUTTON)
  return auth.currentUser && (
    <button onClick={() => auth.signOut()}>Sign Out</button>  //sign out => auth.SignOut()
  )
}

function ChatMessage(props) {                        // RECEIVES MESSAGE DATA AS PROP FROM PARENT CHATROOM COMPONENT
  const {text, uid, id} = props.message              // DESTRUCTURE MESSAGE INTO USER ID AND TEXT
  const messageClass = uid === auth.currentUser.uid ? "sent" : "received"   // check of uid in message === uid die is ingelogd 

  return (
    <div className={`message ${messageClass}`}>   {/*de style van ingelogde user is anders dan andere user*/}
      <p>{text}</p>
    </div>
  )
}

function Chatroom() {
  const messageRef = firestore.collection("messages")           // LET OP reference to a firestore collection ("messages") 
                                                                        //=> DEZE HEEFT METHODS OM CRUD THE DOEN OP DB FIRESTORE
  const query = messageRef.orderBy("createdAt").limit(25)       // query documents in the collection
  const [messages] = useCollectionData(query, {idField:'id'})   // useCollectionData DATA HOOK: listen to REALTIME update to data
                                                          // returns array of objects => 1 object = 1 chat message
                                                          // REACT RENDERS WHEN DATA CHANGES IN REALTIME
  const [formValue, setFormValue] = React.useState("")  //1st real React state (for form data)
  const dummy = React.useRef()        // CREATE A USEREF => TO BE ABLE TO ADDRESS A DIV (INSTEAD OF DIRECT DOM MANIPULATION)
                                            //=> SO I CAN USE .current.scrollIntoView() METHOD ON IT.

  async function sendMessage(e) {
    e.preventDefault()
    const {uid} = auth.currentUser

    await messageRef.add({            // ADD = FIRESTORE CREATE COMMAND => CREATE NEW DOCUMENT
      text: formValue,               // TAKES A JS OBJECT AS ARGUMENT => CONTAINING WHATEVER DATA YOU WANT
      createdAt: firebase.firestore.FieldValue.serverTimestamp(),   // firebase can give us its server timestamp
      uid 
    })     
    
    setFormValue("")  //reset form (set state to "" => state dictates form input's value !!!)

    dummy.current.scrollIntoView({behaviour:"smooth"})  //=> MAKES LATEST MESSAGE SCROLL INTO VIEW (MESSAGE BY OTHER PARTY)
  }

  return (
    <main>
      <h1>Chat</h1>
      <div className="messageBox">             
        {/*SEND REALTIME messages DATA (from useCollectionData DATA HOOK) AS PROP TO CHATMESSAGE COMPONENT*/}                                                             
        {messages && messages.map(msg => <ChatMessage key={msg.id} message={msg} /> )} 
        <div ref={dummy}></div>       {/*LET OP IK GEBRUIK REF EN USEREF IPV DIREKTE DOM MANIPULATION!!!! */}
      </div>
      <form onSubmit={sendMessage}>
        <input value={formValue} onChange={(e)=>setFormValue(e.target.value)} />   {/* state dictates input value */}
        <button type="submit" >Send</button>
      </form>

      <SignOut />
    </main>
  )
}     

function App() {
  const [user] = useAuthState(auth)   // useAuthState USER HOOK => user signed in? => object with user info => not signed in? => null
  
  return (
    <div className="App">
      <header className="App-header">
      
      <section>
        {user? <Chatroom /> : <SignIn />}
      </section>
      </header>
    </div>
  );
}

export default App;
