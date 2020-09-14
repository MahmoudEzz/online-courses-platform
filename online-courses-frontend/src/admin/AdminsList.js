import React, { useState, useEffect } from 'react';
import axios from 'axios';
import AdminModal from './forms/AdminForm';
import { Button } from 'react-bootstrap';

function AdminsList() {

    // modal state
    const [show, setShow] = useState(false);
    const handleShow = () => setShow(true);

    // admins state
    const [admins, setAdmins] = useState([{}]);

    useEffect(()=>{
        console.log('from Admin');
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
                    setAdmins(res.data.filter((user)=>user.isAdmin === true));
                }
            } catch (e) {
                setAdmins([]);
                console.log(e);
            }
            
        }
        fetchData();
    },[])


    return (
        <>
        {/*  tabel section */}
        <div className='container mt-2'>
            <Button variant="primary" onClick={handleShow}>
                Add admin
            </Button>
            {admins.length ? 
                <table className="table text-center mt-2">
                    <thead className="thead-dark">
                        <tr>
                            <th scope="col">#</th>
                            <th scope="col">Name</th>
                            <th scope="col">Email</th>
                        </tr>
                    </thead>
                    <tbody>
                        {admins.map((admin, index)=>{
                            return(
                                <tr key={admin._id}>
                                    <th scope="row">{index + 1}</th>
                                    <td>{admin.name}</td>
                                    <td>{admin.email}</td>
                                </tr>
                            )
                        })}
                    </tbody>
                </table>
                :   <div className="mx-auto mt-4" style={{width: 200}}>
                        <h6 className="text-warning">No admins Available</h6>
                    </div>
            }
        </div>

        {/* Modal section */}
        <AdminModal 
            show={show} 
            setShow={setShow} 
            admins={admins} 
            setAdmins={setAdmins}
        />
        </>
    );
}

export default AdminsList;
