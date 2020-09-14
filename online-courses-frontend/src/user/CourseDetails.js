import React, { useState, useEffect } from 'react';
import axios from 'axios';

function CourseDetails(props) {

    const courseId = props.id;
    const [course, setCourse] = useState({categories:[]});
    const [regFlag, setRegFlag] = useState(false);
    const [finFlag, setFinFlag] = useState(false);

    useEffect(()=>{
        console.log('from course details');
        
        if(props.user?.registeredCourses.includes(courseId)){
            setRegFlag(true);
        }
        if(props.user?.finishedCourses.includes(courseId)){
            setFinFlag(true);
        }
        fetchData();
    },[])

    // get course details
    const fetchData = async function(){
        try {
            const res = await axios(`http://127.0.0.1:4000/courses/${courseId}`);
            if(res.status === 200){
                setCourse(res.data);
            }
        } catch (e) {
            console.log(e);
        }
        
    }

    // register/cancel a course
    const courseReg = (e)=>{
        if(regFlag){
            updateCourse('cancel');
            setRegFlag(false);
        } else {
            updateCourse('register');
            setRegFlag(true);
        }

    }

    // finish course
    const finishCourse = () => {
        updateCourse('finish');
        setFinFlag(true);
    }

    // make different request with the same method
    const updateCourse = (url)=>{
        axios({
            method: 'patch',
            url: `http://127.0.0.1:4000/users/course/${url}/${courseId}`,
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
          }).then((res)=>{
            if(res.status === 200){
              // redirect to home
              props.setUser(res.data);
            }
          }).catch ((e)=>{
            // client received an error response (5xx, 4xx)
            ;
            console.log(e);
          })
    }
    return (
        <div className='row d-flex justify-content-sm-around'>
            <div className="card col-3 p-2 m-2 bg-light shadow" >
                <img src="https://picsum.photos/400/400" className="card-img-top mt-1 rounded" alt="pic"/>
                <div className="card-body center">
                    <h5 className="card-title text-info">{course.name}</h5>
                    <strong>Points : <span className="badge badge-success">{course.points}</span></strong>
                    <hr></hr>
                    <p className="card-text text-muted">{course.description}</p>
                    <hr></hr>
                    {course.categories.map((category)=>{
                        return (<span key={category._id} className="badge badge-secondary">{category.name}</span>)
                    })}
                    {props.user? 
                    <>
                    <hr></hr>
                    {
                        finFlag ? <strong>Finished</strong>: 
                        regFlag? 
                            <>
                                <button onClick={courseReg} type="button" className="btn btn-danger" > Cancel </button>
                                <button onClick={finishCourse} type="button" className="btn btn-primary ml-3" > Finish </button>
                            </>
                            : 
                            <button onClick={courseReg} type="button" className="btn btn-success" > Register </button>
                    }
                    </>
                    : ''}
                </div>
            </div>
        </div>
    );
}

export default CourseDetails;
