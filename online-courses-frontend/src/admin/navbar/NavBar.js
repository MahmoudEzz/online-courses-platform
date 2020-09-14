import React, { useState, useEffect } from 'react';
import {Navbar, Nav, NavDropdown} from 'react-bootstrap';
import {Link} from 'react-router-dom';
import axios from 'axios';
import { useHistory } from "react-router-dom";

function NavBar(props) {
    const history = useHistory();  
    const [user, setUser] = useState(props.user);

    useEffect(()=>{
        console.log('from Nav');
        setUser(props.user);
    },[props.user]);

    // logout handling
    const logout = ()=>{
        debugger;
        axios({
            method: 'post',
            url: 'http://127.0.0.1:4000/admins/logout',
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
          }).then((res)=>{
              debugger
            if(res.status === 200){
              // redirect to home
              localStorage.removeItem('token');
              props.setUser(null);
              setUser(null);
              history.push('/admin/login');
            }
          }).catch ((e)=>{
              debugger;
            // client received an error response (5xx, 4xx)
            history.push('/');
          })  
    }

    return (
        <Navbar collapseOnSelect expand="lg" bg="dark" variant="dark" sticky="top">
            <Navbar.Brand href="">Admin Dashboard</Navbar.Brand>
            <Navbar.Toggle aria-controls="responsive-navbar-nav" />
            <Navbar.Collapse id="responsive-navbar-nav">
                <Nav className="mr-auto">
                    { user ?
                        <>
                        <Link to='/user/list' className="nav-link" >Users</Link>
                        <Link to='/admin/list' className="nav-link" >Admins</Link>
                        <Link to='/admin/courses' className="nav-link" >Courses</Link>
                        <Link to='/admin/categories' className="nav-link" >Categories</Link>
                        </>: ''
                    }
                </Nav>
                <Nav>
                    {user ? 
                        <>
                            <span className="navbar-text">Welcome, <strong>{user.name}</strong></span>
                            
                            <button onClick={()=>logout()} type='button' className="navbar-text btn border border-danger rounded ml-2">
                                Logout
                            </button>
                        </>
                    :
                        <>
                        </>
                    }  
                </Nav>
            </Navbar.Collapse>
        </Navbar>
  );
}

export default NavBar;
