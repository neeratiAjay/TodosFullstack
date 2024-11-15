import { useState,useEffect } from "react"
import {useNavigate} from "react-router-dom"
import Cookies from "js-cookie"
import {Link} from "react-router-dom"

import "./index.css"

const Profile = ()=>{
    const [userDetails, setUserDetails] = useState("")
    const [errMsg,setErrMsg] = useState("")
    const [showError, setError]= useState(false)
    const [currentPassword, setCurrentPassword] = useState("")
    const [newPassword, setNewPassword] = useState("")
    

    const navigate = useNavigate(); 
    const jwtToken = Cookies.get("jwt_token");
   
   
    useEffect(()=>{ 
        if (!jwtToken) {
            navigate("/login"); // Use navigate for redirection
        }else{
       
    const getUserData = async ()=>{
        const url = "https://todosfullstack.onrender.com/profile"
       
        const options = {
            method:"GET",
            headers:{
                authorization:`Bear ${jwtToken}`
            }
        }
        const response = await fetch(url,options)
        const data = await response.json()
        setUserDetails(data)
    }
    getUserData()
}

    },[jwtToken,navigate])
   

    const updatePassword = async (event)=>{
        event.preventDefault()
        if (currentPassword.trim()==="" || currentPassword.length === 0){
            alert("Please Enter valid current password")
        }else if(newPassword.trim()==="" || newPassword.length === 0){
            alert("Please Enter valid New Password")
        }else if(currentPassword === newPassword){
              alert("New Password can not be same as the Current Password.")
        }
        else{
        const {id} = userDetails
        const url = "https://todosfullstack.onrender.com/profile"
        //const jwtToken = Cookies.get("jwt_token")
        const options = {
            method:"PUT",
            headers:{
                authorization:`Bear ${jwtToken}`,
                'Content-type':"application/json",
            },
            body:JSON.stringify({ id:id,currentPassword:currentPassword,newPassword:newPassword})
        }
        const response = await fetch(url,options)
        const data = await response.json()
        if(response.ok === true){
            alert("Password updated Successfully")
            setCurrentPassword("")
            setNewPassword("")
        }else{
            setErrMsg(data.err_msg)
            setError(true)
        }
        

    }
    }

    const deleteAccount = async()=>{
        const {id} = userDetails
        const url = `https://todosfullstack.onrender.com/profile/${id}`
        const options = {
            method:"DELETE",
            headers:{authorization:`Bear ${jwtToken}`}
        }
        const response = await fetch(url,options)
        if (response.ok) {
            alert("Your account has been deleted successfully.");
            Cookies.remove("jwt_token"); // Clear the JWT token after deletion
            navigate("/register"); // Redirect to the registration page after successful deletion
        }

           
    }

    const onClickLogout = ()=>{
        Cookies.remove("jwt_token")
        navigate("/login")
        
    }
    
    
    
 
    const {name,username,email} = userDetails
    
    return (
        <div className="profile-bg-container">
            <Link to ="/" className="back">Go Back</Link>
        <h1 className="profile-heading">Profile Details</h1>
        <ul className="ul-container">
            <li className="name-text">Name : <span className="span-text">{name}</span></li>
            <li className="name-text">User Name :<span  className="span-text">{username}</span></li>
            <li className="name-text">Email : <span  className="span-text">{email}</span></li>

        </ul>
        <h1 className="profile-heading">Change Password Here</h1>
        <form className="update-password-container" onSubmit={updatePassword}>
       
            <label htmlFor="currentPassword" className="label">Enter  your current password</label>
            <input type = "password" id ="currentPassword"  placeholder="Current Password"
             className="password-input" value={currentPassword} onChange={(e)=>setCurrentPassword(e.target.value)} required />
            <label htmlFor="NewPassword" className="label">Enter your new password</label>
            <input type ="password" placeholder="New Password" 
            className="password-input" id = "NewPassword" value={newPassword} onChange={(e)=>setNewPassword(e.target.value)}required/>
             {showError && <p className="error-text">*{errMsg}</p>}
            <button type = "submit" className="password-submit-btn">Submit</button>
           
        </form>
       
        <div className="flex-column">
        <button className="btn-logout" onClick={onClickLogout}> Logout</button>
        <button className="btn-delete" onClick={deleteAccount}>Delete Account</button>
        </div>
       

        </div>
    )


}
export default Profile