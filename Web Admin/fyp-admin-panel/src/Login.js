import './App.css';
import React, {useState,useEffect} from 'react';
import { useHistory } from "react-router";
import firebase from "firebase";
var config = {
    apiKey: "AIzaSyBLwWyP1YuWZrqvpo_zsNJIyEf8Xi_Lpco",
    authDomain: "gyradosvpn.firebaseapp.com",
    databaseURL: "https://gyradosvpn.firebaseio.com",
    projectId: "gyradosvpn",
    storageBucket: "gyradosvpn.appspot.com",
    messagingSenderId: "50961203679",
    appId: "1:50961203679:web:5889613169c3eeb168c46a"
  };


function Login() {
 const [userName,setUserName] = useState('')
 const [password,setPassword] = useState('')
 const history = useHistory();
  useEffect(()=>{
      if (!firebase.apps.length) {
      firebase.initializeApp(config);
      }else {
        firebase.app(); // if already initialized, use that one
      }
  },[])   
  var SubmitForm = (event)=>{
    event.preventDefault();
    try{
    firebase.database().ref('Administrators/'+userName).on('value', (snapshot) => {
    var pass= snapshot.val();
    console.log(pass)
    if(pass!=null){
    if(pass.password == password){
      console.log("SUbmited "+userName+"  "+password+" end")  
      history.push({pathname:'/Dashboard',  state: { signInStatus: 'signedIn', email: userName }})
      setUserName('')
      setPassword('')
    }else{
    alert('Invalid Credentials')
    }
  }else{
    alert('Invalid')
    
  }
  });
  }catch(err){
    console.log(err)
    alert('Connection Error')
  }
}
  return (
    <div className="App">
      <form className="loginBg" onSubmit={SubmitForm}>
        
        <div className='inputHeader'>
          <p>LOGIN FORM</p>
        </div>
        <div className='inputCover'>
        <p>USER NAME</p>
        <input
          type="text"
          value={userName}
          onChange={(name)=>{setUserName(name.target.value)}}
        />
        </div>
        <div className='inputCover'>
        <p>PASSWORD</p>
        <input
          type="password"
          value={password}
          onChange={(name)=>{setPassword(name.target.value)}}

        />
        </div>
        <div className='inputCover'>
        <input
          type="submit"
        />
        </div>
      </form>
    </div>
  );
}

export default Login;
