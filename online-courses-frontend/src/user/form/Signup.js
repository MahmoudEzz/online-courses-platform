import React, {useState} from 'react';
import axios from 'axios';
import { useHistory } from "react-router-dom";

function Signup(props) {

    const [name, setName] = useState(null);
    const [email, setEmail] = useState(null);
    const [password, setPassword] = useState(null);
  
    const [emailError, setEmailError] = useState(null);
    const [passwordError, setPasswordError] = useState(null);
  
    const history = useHistory();
  
    const validateAndSubmit = (e)=>{
      let errorsflag = false;
      e.preventDefault();
      console.log("will validate");
      //validation 
      const validateEmail = (email)=>{
        const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(String(email).toLowerCase());
      }
      if(password && password.length>6){
        setPasswordError(null);
        console.log('sucesss');
      } else {
        setPasswordError('password length must be more than 6 characters');
        errorsflag = true;
      }
      if(validateEmail(email)){
        setEmailError(null);
        console.log('sucesss');
      } else {
        setEmailError('provide a valid email');
        errorsflag = true;
      }
  
      //submition
      if(!errorsflag){
        sendData();
      }
  
    }
    // send signup request to the backend
    const sendData = function(){
      axios({
        method: 'post',
        url: 'http://127.0.0.1:4000/users',
        data: {
            name,
            email,
            password
        }
      }).then((res)=>{
        if(res.status === 201){
          // redirect to home
          localStorage.setItem('token', res.data.token);
          props.setUser(res.data.user);
          history.push('/');
        }
      }).catch ((e)=>{
        // client received an error response (5xx, 4xx)
        setPasswordError('Invalid email or password');
        history.push('/login');
      })  
    }
    return (
      <div className='container bg-light shadow p-3 mt-5 rounded'>
            <form onSubmit={(e)=>{validateAndSubmit(e)}}>
                <div className="form-group">
                    <label htmlFor="name">Name</label>
                    <input onChange={(e)=>setName(e.target.value)} value={name || ''} type="text" className="form-control" id="name" required />
                </div>
                <div className="form-group">
                    <label htmlFor="InputEmail1">Email address</label>
                    <input onChange={(e)=>setEmail(e.target.value)} value={email || ''} type="email" className="form-control" id="InputEmail1" aria-describedby="emailHelp"/>
                    <small id="emailHelp" className="form-text text-muted">We'll never share your email with anyone else.</small>
                </div>
                {emailError && <p style = {{color: "red"}}>{emailError}</p>}
                <div className="form-group">
                    <label htmlFor="exampleInputPassword1">Password</label>
                    <input onChange={(e)=>setPassword(e.target.value)} value={password || ''} type="password" className="form-control" id="exampleInputPassword1"/>
                </div>
                {passwordError && <p style = {{color: "red"}}>{passwordError}</p>}
                <button type="submit" className="btn btn-primary">Submit</button>
            </form>
      </div>
    )
}

export default Signup;