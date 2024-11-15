import {Component} from "react"
import Cookies from "js-cookie"
import {Navigate,Link} from "react-router-dom"
import { v4 as uuidv4 } from 'uuid';
import { FaUserCircle } from "react-icons/fa"
import TodoItemDetails from "../TodoItemDetails";

import "./index.css"

class Todo extends Component{
    state = {todos:"",todoInput:""}

    getTodosData = async()=>{
        try{
        
        const jwtToken = Cookies.get("jwt_token")
        const url = `http://localhost:4000/user/todos`
        const options = {
            method:"GET",
            headers:{
                authorization:`Bear ${jwtToken}`
            }
        }
        const response = await fetch(url,options)
        const responseData  = await response.json()
        const formatData = responseData.map(data =>({
            id:data.id,
            title:data.title,
            status:data.status,
            userId : data.user_id
        })) 
        this.setState({todos:formatData})
    }catch(e){
        console.log(`Error ${e.message}`)
    }
    }

    componentDidMount(){
        this.getTodosData()

    }

    onChangeTodoInput = event =>{
        this.setState({todoInput:event.target.value})
    }
    submitNewTodo = async(event) =>{
        event.preventDefault()
        const{todoInput} = this.state
        const userIdData =JSON.parse(localStorage.getItem("userId"))
        const {userId} = userIdData
        const todoId = uuidv4().trim().toLowerCase()
        const newTodo = {id:todoId,title:todoInput,status:"Inprogress",userId:userId}
        const url = "http://localhost:4000/todos"
        const jwtToken = Cookies.get("jwt_token")
        const options = {
            method: 'POST',
            headers:{ 'Content-Type': 'application/json',authorization:`Bear ${jwtToken}`},
            body: JSON.stringify(newTodo),
          }
        if(todoInput !== ""){
        
         await fetch(url,options)
        this.setState({todoInput:""})
        }
       
        this.getTodosData()

    }

    deleteTodo = async id =>{
       const jwtToken = Cookies.get("jwt_token")
       const url = `http://localhost:4000/todos/${id}`
       const options = {
        method:"DELETE",
        headers:{
        authorization: `Bearer ${jwtToken}`,
      'Content-Type': 'application/json',
        }
       }
       await fetch(url,options)
       this.getTodosData()
       
    }
   
   
    

    

   

    render(){
        const{todoInput,todos} = this.state
        const jwtToken = Cookies.get("jwt_token")
        if (jwtToken === undefined){
            return <Navigate to ="/login"/>
        }
        return (
            <div className="todo-container">
                <div className="profile-container">
                    <Link to ="/profile">
                    <FaUserCircle size={30}/>
                <p className="profile-text"> My Profile</p>
                </Link>
                </div>
                <h1 className="heading">TODOS</h1>
                <form className="input-container"  onSubmit={this.submitNewTodo}>
                <input type = "text" placeholder="Enter Your Task" value={todoInput} onChange={this.onChangeTodoInput} className="todo-input"/>
                <button type = "submit" className="todo-btn">Create Task</button>
                </form>
                { todos.length>0?<ul className="ul-container">
                 {todos.map(eachTodo=><TodoItemDetails todoItem = {eachTodo} 
                 key = {eachTodo.id} deleteTodo = {this.deleteTodo}
                 renderTodos={this.getTodosData}/>)}
                </ul> :<h1 className="empty-task">Your Task List is Empty Create Task</h1>}
            </div>
        )
    }
}
export default Todo