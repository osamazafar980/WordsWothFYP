import './Dash.css';
import React, {useState , useEffect} from 'react';
import { useHistory, useLocation } from "react-router";
import { ListGroup, ListGroupItem } from "shards-react";
import firebase from "firebase";
var ip = 'localhost'
var config = {
    apiKey: "AIzaSyBLwWyP1YuWZrqvpo_zsNJIyEf8Xi_Lpco",
    authDomain: "gyradosvpn.firebaseapp.com",
    databaseURL: "https://gyradosvpn.firebaseio.com",
    projectId: "gyradosvpn",
    storageBucket: "gyradosvpn.appspot.com",
    messagingSenderId: "50961203679",
    appId: "1:50961203679:web:5889613169c3eeb168c46a"
  };
function Dashboard(props) {
 const history = useHistory();
 const location = useLocation();
 const [signedIn,setSignedIn] = useState(location.state==undefined?"signedOut":location.state.signInStatus)
 const [Email,setEmail] = useState(location.state==undefined?"Unknown":location.state.email)
 const [newUserName,setNewUserName] = useState('')
 const [newPassword,setNewPassword] = useState('')
 const [oldPassword,setOldPassword] = useState('')
 const [status,setStatus] = useState('None')
 const [reports,setReports] = useState([])
 const [updateStatus,setUpdateStatus] = useState(false)
 const [New,setNew] = useState('0')
 const [Total,setTotal] = useState('0')
 useEffect(()=>{
    if (!firebase.apps.length) {
     firebase.initializeApp(config);
    }else {
      firebase.app(); // if already initialized, use that one
    }
  firebase.database().ref('updateStatus/').on('value',(snapshot)=>{
    var sat = snapshot.val()
    console.log(sat)
    if(sat=='true'){
    setUpdateStatus(true)}else{
    setUpdateStatus(false)
    }
  });
  firebase.database().ref('New/').on('value',(snapshot)=>{
    setNew(snapshot.val())
  });
  firebase.database().ref('Books/').on('value',(snapshot)=>{
    var b = snapshot.val()
    setTotal(Object.keys(b).length)
  });
  firebase.database().ref('Reports/').on('value',(snapshot)=>{
    var b = snapshot.val()
    if(b!=null){
    var k=[]
    for(var x = 0;x<Object.keys(b).length;x++){
      k.push(b[Object.keys(b)[x]]);
    }
    setReports(k)
    }else{
    setReports([])
    }
  });
  },[])
 function createAccount (){
  setStatus('create')
 }
 function updatePassword (){
   setStatus('update')
 }
 function report (){
   setStatus('report')
 }
 function signOut (){
   history.goBack()
 }
 function back (){
  setStatus('None')
 }
 function update (){
    fetch("http://"+ip+":8080/files/update/")
    .then(response => {response.json()})
    .catch(err => {
      console.log(err);
    });
  firebase.database().ref('updateStatus/').set('true');
  alert('Update Started')
  setUpdateStatus(true)
 }
 
var SubmitCreateForm = (event)=>{
  event.preventDefault();
  firebase.database().ref('Administrators/'+newUserName).set({'password':newPassword});
  console.log("SUbmited "+newUserName+"  "+newPassword+" end")  
  setNewUserName('')
  setNewPassword('')
  alert('Administrator Created')
  setStatus('None')
}
var SubmitUpdateForm = (event)=>{
  event.preventDefault();
  var  update = false;
  firebase.database().ref('Administrators/'+Email).on('value', (snapshot) => {
    if(oldPassword==snapshot.val().password){
      update = true;
    }
  });
  if(update){
      firebase.database().ref('Administrators/'+Email).set({'password':newPassword});
      alert('Password Updated')
  }else{
      alert('Wrong Old Password')
  }  
}

 if(signedIn=='signedIn' && status=='None'){
  return (
    <div className="DashApp">
      <div className='DashBoard'>
        <div id='dashRow'>
          <div id='dashSectionL'>
            <p>Administrator</p>
              <div id='dashOptions'>
                <p>Options</p>
                <button id='dashOptionsButton' onClick={createAccount}>Create New Account</button>
                <button id='dashOptionsButton' onClick={updatePassword}>Update Password</button>
                <button id='dashOptionsButton' onClick={report}>Reports</button>
                <button id='dashOptionsButtonLast' onClick={signOut}>Sign Out</button>
              </div>
          </div>
          <div id='dashSectionR'>
            <p>Library Statistics</p>
              <div id='dashStats'>
              <div id='dashStatsRow'>
                <p>Last Update</p>
                <p>Total Books Added: {Total}</p>
                <p>New Books Added: {New}</p>
              </div>
              <div id='dashStatsReports'>
                <button id={updateStatus?'dashStatsReportsUpdateProgress':'dashStatsReportsUpdate'}
                  onClick={update}
                  disabled={updateStatus}
                >{updateStatus?'Update In Progress':'Update Progress'}</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
 }
 else if(signedIn=='signedIn' && status=='create'){
    return(
      <div className='dashCreateBox'>
        <form className="dashLoginBg" onSubmit={SubmitCreateForm}>
          <div className='inputHeader'>
            <p>SIGNUP FORM</p>
          </div> 
          <div className='inputCover'>
          <p>NEW USER NAME</p>
          <input
            type="text"
            value={newUserName}
            onChange={(name)=>{setNewUserName(name.target.value)}}
          />
          </div>
          <div className='inputCover'>
          <p>NEW PASSWORD</p>
          <input
            type="password"
            value={newPassword}
            onChange={(name)=>{setNewPassword(name.target.value)}}
          />
          </div>
          <div className='inputCover'>
          <input
            type="submit"
            value='Create'
          />
          </div>
        </form>
        <div id='backBox'>
          <button id='reportButton' onClick={back}>Back</button>
        </div>
      </div>
    );
  }
 else if(signedIn=='signedIn' && status=='update'){
    return(
      <div className='dashCreateBox'>
        <form className="dashLoginBg" onSubmit={SubmitUpdateForm}>
          <div className='inputHeader'>
            <p>PASSWORD UPDATE FORM</p>
          </div> 
          <div className='inputCover'>
          <p>Old PASSWORD</p>
          <input
            type="text"
            value={oldPassword}
            onChange={(name)=>{setOldPassword(name.target.value)}}
          />
          </div>
          <div className='inputCover'>
          <p>NEW PASSWORD</p>
          <input
            type="password"
            value={newPassword}
            onChange={(name)=>{setNewPassword(name.target.value)}}
          />
          </div>
          <div className='inputCover'>
          <input
            type="submit"
            value='Update'
          />
          </div>
        </form>
        <div id='backBox'>
          <button id='reportButton' onClick={back}>Back</button>
        </div>
      </div>
    );
  }
 else if(signedIn=='signedIn' && status=='report'){
    return(
      <div className='reportBox'>
        <p id='reportHeader'>Reports</p>
        <div id='reports'>
        {
          reports.map(function(report, idx) {
              return( 
                <div id="report">
                  <div>
                  <p id='name'>Name:{report.name}</p>
                  <p id='name'>Email:{report.email}</p>
                  <p id='problem'>{report.problem}</p>
                  </div>
                  <button id='reportButton' key={idx} onClick={()=>{
                    console.log(reports)
                    var x = []
                    firebase.database().ref('Reports/').set({});
                    for(var i = 0; i<reports.length; i++ ){
                      if(i!=idx){
                        x.push(reports[i])
                        firebase.database().ref('Reports/' + Date.now()).set(reports[i]);                        
                      }
                    }
                    setReports(x)
                  }}>Resolve</button>
                </div>
                );
          })
        }
        <div id='backBox'>
          <button id='reportButton' onClick={back}>Back</button>
        </div>
        </div>
      </div>
      );
  }
  else if(signedIn!='signedIn'){
    return(
      <div className='dashCreateBox'>
        <form className="dashLoginBg">
          <div className='inputHeader'>
            <p>NOT SIGNED IN, PLEASE SIGN IN TO ACCESS DASHBOARD</p>
          </div> 
        </form>  
      </div>
    );
  }
}

export default Dashboard;
