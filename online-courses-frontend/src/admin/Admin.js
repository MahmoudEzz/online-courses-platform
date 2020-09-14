import React, { useState, useEffect }from 'react';
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import axios from 'axios';
import { useHistory } from "react-router-dom";

import CategoriesList from './CategoriesList';
import AdminsList from './AdminsList';
import UsersList from './UsersList';
import CoursesList from './CoursesList';
import Login from '../user/form/Login';
import Navbar from './navbar/NavBar';



function Admin() {
    const history = useHistory();
    const [user, setUser] = useState(null);
    useEffect(()=>{
        console.log('from Admin');
        if(localStorage.getItem("token")){
            readProfile();
        }
    },[]);
    // to access user data if page reloaded
    const readProfile = ()=>{
        axios({
        method: 'get',
        url: 'http://127.0.0.1:4000/admin/me',
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        }).then((res)=>{
        if(res.status === 200){
            // redirect to home
            if(!res.data.isAdmin){
                history.push('/');

            }
            setUser(res.data);
        }
        }).catch ((e)=>{
            // client received an error response (5xx, 4xx)
            // redirect to home
            localStorage.removeItem('token');

            setUser(null);
        })
    }
    return (
        <Router>
        <Navbar user={user} setUser={setUser}/>
            <Switch>
                <Route exact path="/admin/login" render={()=> <Login setUser={setUser}/> } />
                <Route exact path="/admin/courses" component={CoursesList} />
                <Route exact path="/admin/categories" component={CategoriesList} />
                <Route exact path="/user/list" component={UsersList} />
                <Route exact path="/admin/list" component={AdminsList} />
            </Switch>
        </Router>
    );
}

export default Admin;
