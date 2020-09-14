import React, { useState, useEffect } from 'react';
import axios from 'axios';
import CategoryModal from './forms/CategoryForm';
import { Button } from 'react-bootstrap';

function CategoriesList() {

    // modal state
    const [show, setShow] = useState(false);
    const handleShow = () => setShow(true);

    // categoris state
    const [categories, setCategories] = useState([{}]);
    const [item, setItem] = useState(null);


    useEffect(()=>{
        console.log('from Category');
        const fetchData = async function(){
            try {
                const res = await axios(`http://127.0.0.1:4000/categories?limit=50&skip=0`);
                if(res.status === 200){
                    setCategories(res.data);
                }
            } catch (e) {
                setCategories([]);
                console.log(e);
            }
            
        }
        fetchData();
    },[item])

    // Remove category
    const removeCategory = (category)=>{
        axios({
            method: 'delete',
            url: `http://127.0.0.1:4000/categories/${category._id}`,
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
          }).then((res)=>{
            if(res.status === 200){
                // Remove from categories array 
                setCategories(categories.filter(i => i !== category))
            }
          }).catch ((e)=>{
                console.log(e);

          })
    }

    // update category
    const updateCategory = (category)=>{
        setItem(category);
        setShow(true);
    }


    return (
        <>
        {/*  tabel section */}
        <div className='container mt-2'>
            <Button variant="primary" onClick={handleShow}>
                Add category
            </Button>
            {categories.length ? 
                <table className="table text-center mt-2">
                    <thead className="thead-dark">
                        <tr>
                            <th scope="col">#</th>
                            <th scope="col">Name</th>
                            <th scope="col">Update</th>
                            <th scope="col">Delete</th>
                        </tr>
                    </thead>
                    <tbody>
                        {categories.map((category, index)=>{
                            return(
                                <tr key={category._id}>
                                    <th scope="row">{index + 1}</th>
                                    <td>{category.name}</td>
                                    <td><button onClick={()=>{updateCategory(category)}} className='btn btn-warning'>Update</button></td>
                                    <td><button onClick={()=>{removeCategory(category)}} className='btn btn-danger'>Delete</button></td>
                                </tr>
                            )
                        })}
                    </tbody>
                </table>
                :   <div className="mx-auto mt-4" style={{width: 200}}>
                        <h6 className="text-warning">No Categories Available</h6>
                    </div>
            }
        </div>

        {/* Modal section */}
        <CategoryModal 
            show={show} 
            setShow={setShow} 
            categories={categories} 
            setCategories={setCategories}
            item={item}
            setItem={setItem}
        />
        </>
    );
}

export default CategoriesList;
