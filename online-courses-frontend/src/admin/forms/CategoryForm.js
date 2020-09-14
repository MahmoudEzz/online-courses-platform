import React, { useState, useEffect } from 'react';
import { Modal } from 'react-bootstrap';
import axios from 'axios';

function CategoryModal(props) {
  
    const handleClose = () => {
        props.setShow(false);
        props.setItem(null);
        setName(null);
    };
    const [name, setName] = useState(null);

    useEffect(()=>{
        console.log('Modal');
        setName(props.item?.name);
    },[props.item])
    
    const validateAndSubmit = function(e){
        e.preventDefault();
        axios({
          method: props.item? "patch" :'post',
          url: `http://127.0.0.1:4000/categories/${props.item?._id || ''}`,
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
          data: {
              name
          }
        }).then((res)=>{
          if(res.status === 201){
            props.setCategories([...props.categories, res.data]);
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
            <Modal.Title>{ props.item ? "Update Category" : "Add category" }</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <form onSubmit={(e)=>{validateAndSubmit(e)}}>
                <div className="form-group">
                    <label htmlFor="name">Name</label>
                    <input onChange={(e)=>setName(e.target.value)} value={name || ''} type="text" className="form-control" id="name" required />
                </div>
                <button type="submit" className="btn btn-primary">Submit</button>
            </form>
          </Modal.Body>
        </Modal>
    );
  }
  export default CategoryModal;