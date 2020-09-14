import React, { useState, useEffect} from 'react';
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import axios from 'axios';
import { useHistory } from "react-router-dom";

import Navbar from './navbar/NavBar';
import Home from './Home';
import Login from './form/Login';
import Signup from './form/Signup';
import Category from './Category';
import CourseDetails from './CourseDetails';
import CategoryDetails from './CategoryDetails';
import RegisteredCourses from './RegisteredCourses';
import FinishedCourses from './FinishedCourses';


function User() {
    const history = useHistory();
    const [user, setUser] = useState(null);
    useEffect(()=>{
        console.log('from User');
        if(localStorage.getItem("token")){
            readProfile();
        }
    },[]);
    // to access user data if page reloaded
    const readProfile = ()=>{
        axios({
        method: 'get',
        url: 'http://127.0.0.1:4000/me',
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
                <Route exact path="/" render={()=><Home />} />
                <Route exact path="/login" render={()=> <Login setUser={setUser}/> } />
                <Route exact path="/register" render={()=> <Signup setUser={setUser} /> } />
                <Route exact path="/categories" component={Category} />
                <Route exact path="/course/:id" render={({match})=><CourseDetails user={user} setUser={setUser} id={match.params.id}/>} />
                <Route exact path="/category/:id" component={CategoryDetails} />
                <Route exact path="/courses/registered" component={RegisteredCourses} />
                <Route exact path="/courses/finished" component={FinishedCourses} />
            </Switch>
        </Router>
    );
}

export default User;
