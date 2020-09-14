import React, { useState, useEffect } from 'react';
import axios from 'axios';
import CourseModal from './forms/CourseForm';
import { Button } from 'react-bootstrap';

function CoursesList() {

    // modal state
    const [show, setShow] = useState(false);
    const handleShow = () => setShow(true);

    // courses state
    const [courses, setCourses] = useState([{}]);
    const [item, setItem] = useState(null);


    useEffect(()=>{
        console.log('from Course');
        const fetchData = async function(){
            try {
                const res = await axios(`http://127.0.0.1:4000/courses?limit=50&skip=0`);
                if(res.status === 200){
                    setCourses(res.data);
                }
            } catch (e) {
                setCourses([]);
                console.log(e);
            }
            
        }
        fetchData();
    },[item])

    // Remove Course
    const removeCourse = (course)=>{
        axios({
            method: 'delete',
            url: `http://127.0.0.1:4000/courses/${course._id}`,
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
          }).then((res)=>{
            if(res.status === 200){
                // Remove from courses array 
                setCourses(courses.filter(i => i !== course))
            }
          }).catch ((e)=>{
                debugger;

          })
    }

    // update course
    const updateCourse = (course)=>{
        setItem(course);
        setShow(true);
    }


    return (
        <>
        {/*  tabel section */}
        <div className='container mt-2'>
            <Button variant="primary" onClick={handleShow}>
                Add course
            </Button>
            {courses.length ? 
                <table className="table text-center mt-2">
                    <thead className="thead-dark">
                        <tr>
                            <th scope="col">#</th>
                            <th scope="col">Name</th>
                            <th scope="col">Categories</th>
                            <th scope="col">Update</th>
                            <th scope="col">Delete</th>
                        </tr>
                    </thead>
                    <tbody>
                        {courses.map((course, index)=>{
                            return(
                                <tr key={course._id}>
                                    <th scope="row">{index + 1}</th>
                                    <td>{course.name}</td>
                                    <td>{
                                            course?.categories?.map((category)=>
                                            (<span key={category._id} className="badge badge-secondary ml-1">{category.name}</span>))
                                        }
                                    </td>
                                    <td><button onClick={()=>{updateCourse(course)}} className='btn btn-warning'>Update</button></td>
                                    <td><button onClick={()=>{removeCourse(course)}} className='btn btn-danger'>Delete</button></td>
                                </tr>
                            )
                        })}
                    </tbody>
                </table>
                :   <div className="mx-auto mt-4" style={{width: 200}}>
                        <h6 className="text-warning">No Courses Available</h6>
                    </div>
            }
        </div>

        {/* Modal section */}
        <CourseModal 
            show={show} 
            setShow={setShow} 
            courses={courses} 
            setCourses={setCourses}
            item={item}
            setItem={setItem}
        />
        </>
    );
}

export default CoursesList;
