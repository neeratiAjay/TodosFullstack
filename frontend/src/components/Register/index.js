import {Component} from "react"
import {Link,Navigate} from "react-router-dom"
//import { v4 as uuidv4 } from 'uuid';

import "./index.css"

class Register extends Component{
    state = {name:"", username:"", email:"", password:"", confirmPassword:"",errMsg:"",error:false, isLogin:false};
    
    changeName = event =>{
        this.setState({name:event.target.value})
    }
    changeUserName = event =>{
        this.setState({username:event.target.value})
    }
    changeEmail = event =>{
        this.setState({email:event.target.value})
    }
    changePassword = event =>{
        this.setState({password:event.target.value})
    }
    confirmPassword = event =>{
        this.setState({confirmPassword:event.target.value})
    }

    submitForm =  async(event) =>{
     event.preventDefault()
     const {name, username, email, password,confirmPassword} = this.state
     if (password === confirmPassword){
   
     const url = "http://localhost:4000/register"

     const formatData = {name:name, username:username, email:email, password:password}
     const options ={
        method:"POST",
        body :JSON.stringify(formatData),
        headers :{
            'Content-Type': 'application/json'
        }
     }
    
     const response = await fetch(url, options)
     const result = await response.json()
     
     if(response.ok === true){
       this.setState({isLogin:true})

     }else{
        this.setState({errMsg:result.message, error:true})
     }
     

    }else{
        this.setState({error:true,errMsg:"Password doesnot match"})
    }
    }
    render(){
        const {name,username,email,password, confirmPassword, errMsg, error,isLogin} = this.state
        if(isLogin === true){
           return <Navigate to = "/login" replace/>
        }
        return (
            <div className="Register-container">
                <h1 className="register-heading">Registration</h1>
                <form className="card-container" onSubmit={this.submitForm}>
                    <label htmlFor="name" className="label">NAME</label>
                    <input type = "text" placeholder="Enter your name"  value={name} onChange={this.changeName}
                    id = "name" className="input" required/>

                    <label htmlFor="username" className="label">USER NAME</label>
                    <input type = "text" placeholder="Enter your username" 
                    value={username}
                    onChange={this.changeUserName}
                    id = "username" className="input" required/>

                    <label htmlFor="email" className="label">EMAIL</label>
                    <input type = "text" placeholder="Enter your email" 
                    value={email}
                    onChange={this.changeEmail}
                    id = "email" className="input" required/>

                    <label htmlFor="password" className="label">PASSWORD</label>
                    <input type = "password" placeholder="Enter your password" 
                    value={password}
                    onChange={this.changePassword}
                    id = "password" className="input" required/>

                    <label htmlFor="confirmPassword" className="label"> CONFIRM PASSWORD</label>
                    <input type = "password" placeholder="Confirm Password" 
                    value={confirmPassword}
                    onChange={this.confirmPassword}
                    id = "confirmPassword" className="input" required/>

                    <button type = "submit" className="submit-btn">Submit</button>
                   {error && <p className="error-text">*{errMsg}</p>}
                   <p className="para">Already have an account? <Link to="/login">Login</Link></p>
                </form>
            </div>
        )
    }
}
export default Register