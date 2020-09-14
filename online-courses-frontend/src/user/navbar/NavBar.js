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
        axios({
            method: 'post',
            url: 'http://127.0.0.1:4000/users/logout',
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
          }).then((res)=>{
            if(res.status === 200){
              // redirect to home
              localStorage.removeItem('token');
              props.setUser(null);
              setUser(null);
              history.push('/');
            }
          }).catch ((e)=>{
            // client received an error response (5xx, 4xx)
            history.push('/');
          })  
    }

    return (
        <Navbar collapseOnSelect expand="lg" bg="dark" variant="dark" sticky="top">
            <Navbar.Brand href="/">Online Courses</Navbar.Brand>
            <Navbar.Toggle aria-controls="responsive-navbar-nav" />
            <Navbar.Collapse id="responsive-navbar-nav">
                <Nav className="mr-auto">
                    <Link to="/" className="nav-link">Home</Link>
                    <Link to="/categories" className="nav-link">categories</Link>
                    { user ?
                        <>
                        <Link to='/courses/registered' className="nav-link" >Registered</Link>
                        <Link to='/courses/finished' className="nav-link" >Finished</Link>
                        </>: ''
                    }
                </Nav>
                <Nav>
                    {user ? 
                        <>
                            <span className="navbar-text">Welcome, <strong>{user.name}</strong></span>
                            
                            <span className="navbar-text ml-2 badge-success badge-pill text-white"> Score {user.score}</span>
                            <button onClick={logout} type='button' className="navbar-text btn border border-danger rounded ml-2">
                                Logout
                            </button>
                        </>
                    :
                        <>
                            <Link to="/login" className="navbar-text btn border border-info rounded mr-1">
                                Login
                            </Link>
                            <Link to='/register' className="navbar-text btn border border-info rounded">
                                Sign up
                            </Link> 
                        </>
                    }  
                </Nav>
            </Navbar.Collapse>
        </Navbar>
  );
}

export default NavBar;
