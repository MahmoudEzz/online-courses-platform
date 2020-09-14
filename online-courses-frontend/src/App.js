import React from 'react';
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import './App.css';

import Admin from './admin/Admin';
import User from './user/User';

function App() {

  return (
    <Router>
        <Switch>
            <Route path="/admin" component={Admin}/>
            <Route path="/" component={User} />
        </Switch>
    </Router>
  );
}

export default App;
