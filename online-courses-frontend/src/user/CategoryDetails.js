import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {Link} from 'react-router-dom';

function CategoryDetails({match}) {
    const [category, setCategory] = useState({name:"", courses: [{_id:"", name:"", description:"" , points:0 }]});
    useEffect(()=>{
        console.log('from Category Details');
        const fetchData = async function(){
            try {
                const res = await axios(`http://127.0.0.1:4000/categories/${match.params.id}`);
                if(res.status === 200){
                    setCategory(res.data);
                }
            } catch (e) {
                console.log(e);
            }
            
        }
        fetchData();
    },[])
    return (
        <>
        <div className="mx-auto mt-4" style={{width: 100}}>
            <h5 className="text-info">{category.name}</h5>
        </div>
        {category.courses.length ? 
            <div className='row d-flex justify-content-sm-around'>
                {category.courses.map((course)=>{
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
        :   <div className="mx-auto mt-4" style={{width: 100}}>
                <h6 className="text-warning">No Courses</h6>
            </div>
        }
        </>
    );
}

export default CategoryDetails;
