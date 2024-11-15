
import {BrowserRouter,Routes,Route} from "react-router-dom"
import Register from "./components/Register"
import Login from "./components/Login"
import Todo from "./components/Todo"
import Profile from "./components/Profile"

import './App.css';

const App = () =>(
  <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
  <Routes>
    <Route path = "/register" element = {<Register/>}/>
    <Route path = "/login" element = {<Login/>}/>
    <Route path = "/" element = {<Todo/>}/>
    <Route path ="/profile" element = {<Profile/>}/>
  </Routes>
  </BrowserRouter>
)

export default App;
