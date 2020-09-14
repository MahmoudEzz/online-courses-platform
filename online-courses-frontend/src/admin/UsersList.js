import React, { useState, useEffect } from 'react';
import axios from 'axios';

function UsersList() {

    // users state
    const [users, setUsers] = useState([{}]);

    useEffect(()=>{
        console.log('from Users');
        const fetchData = async function(){
            try {
                const res = await axios(
                    {
                        method: 'get',
                        url: `http://127.0.0.1:4000/users?limit=50&skip=0`,
                        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
                    }
                );
                if(res.status === 200){
                    setUsers(res.data.filter((user)=>user.isAdmin === false));
                }
            } catch (e) {
                setUsers([]);
                console.log(e);
            }
            
        }
        fetchData();
    },[])

    const disableUser = (user)=>{
        debugger;
        axios({
            method: 'patch',
            url: `http://127.0.0.1:4000/users/activate/${user._id}`,
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        }).then((res)=>{
            if(res.status === 200){
                debugger;
                setUsers(users.filter((i)=> i !== user));
            }
          }).catch ((e)=>{
                debugger;

          })
    }

    return (
        <div className='container mt-2'>
            {users.length ? 
                <table className="table text-center mt-2">
                    <thead className="thead-dark">
                        <tr>
                            <th scope="col">#</th>
                            <th scope="col">Name</th>
                            <th scope="col">Email</th>
                            <th scope="col">Disable</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map((user, index)=>{
                            return(
                                <tr key={user._id}>
                                    <th scope="row">{index + 1}</th>
                                    <td>{user.name}</td>
                                    <td>{user.email}</td>
                                    <td>
                                        {user.isActive? 
                                            <button type="button" className="btn btn-danger" onClick={()=> disableUser(user)}> Disable </button>
                                        : 
                                            <button type="button" className="btn btn-success" onClick={()=> disableUser(user)}> Activate </button>
                                        }
                                    </td>
                                </tr>
                            )
                        })}
                    </tbody>
                </table>
                :   <div className="mx-auto mt-4" style={{width: 200}}>
                        <h6 className="text-warning">No users Available</h6>
                    </div>
            }
        </div>
    );
}

export default UsersList;
