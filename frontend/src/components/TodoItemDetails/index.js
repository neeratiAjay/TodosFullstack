import {useState,useEffect} from "react"
import Cookies from "js-cookie"

import "./index.css"

const TodoItemDetails = props =>{

   const { todoItem,deleteTodo,renderTodos} = props
   const {id,title,status} =  todoItem
   const [checked,setToggle] = useState(false)
   const [isEdit,toggleEdit] = useState(false)
   const [editInput,setEditInput] = useState(title)
   
   const deleteTodoItem = ()=>{
      deleteTodo(id)
   }
   const onClickEdit =()=>{
      toggleEdit(isEdit =>!isEdit)
   }

   const onClickCancel = ()=>toggleEdit(false)

   const onClickSave = async ()=>{
      
      const newStatus = "Inprogress"
      const url  = "https://todosfullstack.onrender.com/todos"
      const jwtToken = Cookies.get("jwt_token")
      const options = {
       method :"PUT",
       headers:{
          authorization :`Bear ${jwtToken}`, 
          "Content-Type" :"application/json"
       },
       body: JSON.stringify({id:id,title:editInput,status:newStatus})
    }
    await fetch(url,options)
     await onClickCancel()
    renderTodos()
   }
   
  

   const updateStatus = async()=>{
      setToggle((checked)=>!checked)
      const updatedStatus = status === "Inprogress"? "Completed":"Inprogress"
      const url  = "https://todosfullstack.onrender.com/todos"
      //const url = "http://localhost:4000/todos"
      const jwtToken = Cookies.get("jwt_token")
      const options = {
       method :"PUT",
       headers:{
          authorization :`Bear ${jwtToken}`, 
          "Content-Type" :"application/json"
       },
       body: JSON.stringify({id:id,title:title,status:updatedStatus})
    }
    await fetch(url,options)
    
  }

  useEffect(()=>{
   if(status === "Completed"){
      setToggle(checked=>true)
   }
   renderTodos()
  },[status,isEdit])
  
  
  const changeEditInput = event =>{
   setEditInput(event.target.value)
  }


   const underline =(checked === true) ?"text-line":""
   const isChecked = (checked === true) ? true :false
   return (<li key = {id} className="list-item">
           { !isEdit &&<>
           <p className={`title ${underline}`}>{title}</p>
           <input  type="checkbox" checked={isChecked} onChange={updateStatus} className="check-box" />
           <button className="btn-edit" type = "button" onClick={onClickEdit}>Edit</button>
           <button className="btn-delete" type="button" onClick = {deleteTodoItem}>Delete</button>
           </>}
           {isEdit&&<div className="flex-column">
           <input type = "text"  className ="edit-input" value={editInput} onChange={changeEditInput} placeholder="Enter Your Task"/>
           <div className="flex-row">
           <button type ="button" className="cancel-btn" onClick={onClickCancel}>Exit</button>
           <button type = "button" className="save-btn" onClick={onClickSave}>Save</button>
           </div>
           </div>}
       </li>)
}
export default TodoItemDetails