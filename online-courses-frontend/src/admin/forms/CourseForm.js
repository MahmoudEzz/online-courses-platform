import React, { useState, useEffect } from 'react';
import { Modal } from 'react-bootstrap';
import axios from 'axios';

function CourseModal(props) {
    
    const [name, setName] = useState(null);
    const [description, setDescription] = useState(null);
    const [points, setPoints] = useState(null);
    const [categories, setCategories] = useState(null);
    const [categoryArr, setCategoryArr] = useState([]);
    const [pointsError, setPointsError] = useState(null);

    //closing modal with setting form value to null
    const handleClose = () => {
        props.setShow(false);
        props.setItem(null);
        setName(null);
    };

    useEffect(()=>{
        console.log('Modal');
        fetchData();
        setName(props.item?.name);
        setDescription(props.item?.description);
        setPoints(props.item?.points);
        let result = props?.item?.categories?.map(i => i._id);
        if(result){
            setCategoryArr(result);
        }else {
            setCategoryArr([]);
        }
    },[props.item]);

    const fetchData = async function(){
        try {
            const res = await axios(`http://127.0.0.1:4000/categories`);
            if(res.status === 200){
                setCategories(res.data);
            }
        } catch (e) {
            console.log(e);
        }
        
    }

    const addCategory = (e)=>{
        if(categoryArr?.includes(e.target.id)){
            setCategoryArr(categoryArr.filter(i => i !== e.target.id));
        }else {
            setCategoryArr([...categoryArr, e.target.id]);
        }
    }
    
    // validate and submit form
    const validateAndSubmit = function(e){
        let errorsflag = false;
        e.preventDefault();
        if(points < 0 ){
            errorsflag = true;
            setPointsError('Must be a positive number');
        }
        if(!errorsflag){
            submitData();
        }
    }  
    // submit data
    const submitData = () =>{
        axios({
            method: props.item? "patch" :'post',
            url: `http://127.0.0.1:4000/courses/${props.item?._id || ''}`,
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
            data: {
                name,
                description,
                points,
                categories: categoryArr
            }
          }).then((res)=>{
            if(res.status === 201){
              props.setCourses([...props.courses, res.data]);
              handleClose();
            }
            if(res.status === 200){
              props.setItem(res.data);
              handleClose();
            }
          }).catch ((e)=>{
              // client received an error response (5xx, 4xx)
              handleClose();
          })
    }
    return (
        <Modal show={props.show} onHide={handleClose}>
          <Modal.Header closeButton>
            <Modal.Title>{ props.item ? "Update Course" : "Add Course" }</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <form onSubmit={(e)=>{validateAndSubmit(e)}}>
                <div className="form-group">
                    <label htmlFor="name">Name</label>
                    <input onChange={(e)=>setName(e.target.value)} value={name || ''} type="text" className="form-control" id="name" required />
                </div>
                <div className="form-group">
                    <label htmlFor="description">Description</label>
                    <input onChange={(e)=>setDescription(e.target.value)} value={description || ''} type="text" className="form-control" id="description" required />
                </div>
                <div className="form-group">
                    <label htmlFor="points">Points</label>
                    <input onChange={(e)=>setPoints(e.target.value)} value={points || ''} type="number" className="form-control" id="points" required />
                    {pointsError && <p style = {{color: "red"}}>{pointsError}</p>}
                </div>
                <p>Categories</p>
                {categories?.map((category)=> (
                    <div className="form-check form-check-inline" key={category._id}>
                        <input onChange={addCategory} className="form-check-input" type="checkbox" id={category._id} name={category.name} checked = {categoryArr?.includes(category._id)}/>
                        <label className="form-check-label" htmlFor={category._id}>{category.name}</label>
                    </div>
                    )
                )}
                <hr></hr>
                <button type="submit" className="btn btn-primary">Submit</button>
            </form>
          </Modal.Body>
        </Modal>
    );
  }
  export default CourseModal;