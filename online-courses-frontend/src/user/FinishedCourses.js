import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {Link} from 'react-router-dom';

function FinishedCourses() {
    const [courses, setCourses] = useState([{}]);
    useEffect(()=>{
        console.log('from Registered');
        fetchData();
    },[])
    const fetchData = async function(){
        try {
            const res = await axios(
                {
                    method: 'get',
                    url: 'http://127.0.0.1:4000/users/me',
                    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
                }
            );
            if(res.status === 200){
                setCourses(res.data.finishedCourses);
            }
        } catch (e) {
            console.log(e);
        }
        
    }
    return (
        <>
        <div className="mx-auto mt-4" style={{width: 200}}>
            <h5 className="text-info">Finished Courses</h5>
        </div>
        {courses.length ? 
            <div className='row d-flex justify-content-sm-around'>
                {courses.map((course)=>{
                    return(
                        <div className="card col-3 p-2 m-2 bg-light shadow" key={course._id} >
                            <img src="https://picsum.photos/150/150" className="card-img-top mt-1 rounded" alt="pic"/>
                            <div className="card-body center">
                                <h5 className="card-title text-info">{course.name}</h5>
                                <strong>Points : <span className="badge badge-success">{course.points}</span></strong>
                                <p className="card-text text-muted">{course.description}</p>
                                <Link to={`/course/${course._id}`} className="btn btn-primary">See more</Link>
                            </div>
                        </div>
                    )
                })}
            </div>
        :   <div className="mx-auto mt-4" style={{width: 200}}>
                <h6 className="text-warning">No Finished Courses</h6>
            </div>
        }
        </>
    );
}

export default FinishedCourses;
