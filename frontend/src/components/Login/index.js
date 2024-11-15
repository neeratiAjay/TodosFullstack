import {Component} from "react"
import {Link,Navigate} from "react-router-dom"
import Cookies from "js-cookie"

import "./index.css"

class Login extends Component{
 state = {username:"", password:"", error:false, errMsg:"",isLogin:false}
  
 
 

 usernameHandler = event =>{
    this.setState({username:event.target.value})
 }
 passwordHandler = event =>{
    this.setState({password:event.target.value})
 }
 
 onSubmitSuccess = jwtToken=>{
   
    Cookies.set("jwt_token", jwtToken,{expires:30})
    
    this.setState({isLogin:true})
    //history.replace("/")
 }
 onSubmitFailure = (errMsg)=>{
    this.setState({errMsg, error:true})

 }

 submitData = async event =>{
    event.preventDefault()
    const {username, password} = this.state
    const userDetails = {username:username, password:password}
    const url = "https://todosfullstack.onrender.com/login"
    const options = {
      method: 'POST',
      headers:{ 'Content-Type': 'application/json'},
      body: JSON.stringify(userDetails),
    }
    const response = await fetch(url, options)
    const data = await response.json()
    if (response.ok === true){
        this.onSubmitSuccess(data.jwt_token)
        const userData = {userId:data.user_id}
        localStorage.setItem("userId",JSON.stringify(userData))
        
    }else{
    
        this.onSubmitFailure(data.err_msg)
    }

 }
    render(){
        const {username,password,errMsg,error,isLogin} = this.state
        if(isLogin === true){
         return <Navigate to ="/"/>
        }
    return (
        <div className="login-container">
        <h1 className="heading">Login</h1>
        <form onSubmit={this.submitData} className="card-container">
            <label className="label" htmlFor="username">USERNAME</label>
            <input type = "text" id = "username" placeholder="Enter username" className="input"
            value={username} onChange={this.usernameHandler}/>

            <label htmlFor="password" className="label">PASSWORD</label>
            <input type = "password" placeholder="Enter your password" 
            value={password}
            onChange={this.passwordHandler}
            id = "password" className="input" required/>
           <button type = "submit" className="submit-btn">Login</button>
           {error && <p className="error-text">*{errMsg}</p>}
           <p className="para">If you don't have account? <Link to="/register">Sign up</Link></p>
        </form>
        </div>
    )
    }

}
export default Login