import style from './AddToDo.module.css';
import React, { useState } from "react";
import { MdOutlineAddComment } from "react-icons/md";
function Additem({onNewItem}) {
  const[todoName, setTodoName] = useState("");
  const[dueDate, setDueDate] = useState("");

  const handleNameChange = (event) => {
  setTodoName(event.target.value); }
  const handleDateChange = (event) => {
    setDueDate(event.target.value);
  }

  const AddButtoncliked=()=>{
   onNewItem(todoName,dueDate)
   setDueDate("");
   setTodoName("");
  }




  return (
    <div className="container text-center">
      <div className="row my-row">
        <div className="col-6">
          <input
            type="text"
            className={`form-control inputStyle  ${style.inputStyle}`}
            placeholder="Enter your task here"
            value={todoName}
            onChange={handleNameChange}
          />
        </div>
        <div className="col-4">
          <input type="date" className={`form-control inputStle ${style.inputStyle}`}
          value={dueDate}
          onChange={handleDateChange} />
        </div>
        <div className="col-2 ">
          <button type="button" className="btn btn-success my-button" 
          onClick={ AddButtoncliked }>
           <MdOutlineAddComment />
          </button>
        </div>
      </div>
    </div>
  );
}
export default Additem;
