import './App.css';
import React, {useState} from 'react';
import { Route,BrowserRouter as Router, Switch, Redirect, Link } from 'react-router-dom';
import Dashboard from './Dashboard.js'
import Login from './Login.js'
function App() {
 const [userName,setUserName] = useState('')
 const [password,setPassword] = useState('')

  return (
    <Router>
      <Switch>
        <Route path='/Dashboard'>
          <Dashboard/>
        </Route>
        <Route path='/'>
          <Login/>
        </Route>
      </Switch>
    </Router>
  );
}

export default App;
