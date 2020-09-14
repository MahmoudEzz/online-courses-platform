import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {Link} from 'react-router-dom';
function Category() {
    const [categories, setCategory] = useState([{
            courses: [],
            _id: "",
            name: ""
        }]);
    useEffect(()=>{
        console.log('from Category');
        fetchData();
    },[])

    const fetchData = async function(){
        try {
            const res = await axios(`http://127.0.0.1:4000/categories?limit=50&skip=0`);
            if(res.status === 200){
                setCategory(res.data);
            }
        } catch (e) {
            console.log(e);
        }
        
    }

    return (
        <>
        {categories.length ? 
        <div className='container mt-4 text-center'>
            <table className="table">
                <thead className="thead-dark">
                    <tr>
                        <th scope="col">#</th>
                        <th scope="col">Name</th>
                        <th scope="col">Click</th>
                    </tr>
                </thead>
                <tbody>
                    {categories.map((category, index)=>{
                        return(
                            <tr key={category._id}>
                                <th scope="row">{index + 1}</th>
                                <td>{category.name}</td>
                                <td><Link to={`/category/${category._id}`} className='btn btn-info'>view courses</Link></td>
                            </tr>
                        )
                    })}
                </tbody>
            </table>
        </div>
            :   <div className="mx-auto mt-4" style={{width: 200}}>
            <h6 className="text-warning">No Categories Available</h6>
        </div>
        }
        </>
    );
}

export default Category;
