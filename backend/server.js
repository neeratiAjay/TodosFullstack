
const express = require("express")
const sqlite3 = require("sqlite3")
const path = require("path")
const {open} = require("sqlite")
 const cors = require("cors")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
const { title } = require("process")
const { ADDRGETNETWORKPARAMS } = require("dns")

app = express()





const corsOptions = {
    origin: ['http://localhost:3004','https://todosfrontend-wu9i.onrender.com'],
    methods: ['GET', 'POST', 'PUT', 'DELETE'], // Define the allowed methods if necessary
    credentials: true, // Include credentials if necessary
  };
  
  app.use(cors(corsOptions));
  
  


  app.use(express.json())

const dbPath = path.join(__dirname, "todo.db");
let db = null;
const initializeDBAndServer = async () => {
 try {
   db = await open({
     filename: dbPath,
     driver: sqlite3.Database,
   });
   app.listen(4000, () => {
     console.log("Server Running at http://localhost:4000/");
   });
 } catch (e) {
   console.log(`DB Error: ${e.message}`);
   process.exit(1);
 }
};

initializeDBAndServer()

// CHECK USER AUTHENTICATION WITH MIDDLEWARE FUNCTION 
const authenticateToken = (request,response,next) =>{
    const authHeader = request.headers["authorization"]
    
    let jwtToken
    if (authHeader !== undefined){
        jwtToken = authHeader.split(" ")[1]
    }

    if (jwtToken === undefined){
        response.status(401)
        response.send("Invalid Jwt Token")
    }else{
        jwt.verify(jwtToken,"MY_SECRET_TOKEN",(err, payload)=>{
            if(err){
                response.status(401)
                response.send("Invalid Jwt Token")
            }else{
                request.username = payload.username;
                next()
            }
        })
    }


}

// REGISTER API 
app.post("/register", async(request,response)=>{

    const {name,username,email, password} =request.body 
    
    const hashedPassword = await  bcrypt.hash(password, 10)
    const userQuary = `SELECT * FROM  user WHERE username = '${username}'`;
     
    const dbUser = await db.get(userQuary)
     
    if (dbUser === undefined){
        const insertQuary = `INSERT INTO user (name, username, email, password)
        VALUES ('${name}', '${username}', '${email}', '${hashedPassword}');`

        const dbResponse = await db.run(insertQuary)
        const newUserId = dbResponse.lastID
        response.send({ message: `New user id ${newUserId}`})

    }else{
        response.status(400)
        response.send("User already exists")
    }
   

})

// LOGIN API 
app.post("/login",async (request,response)=>{
    const {username, password} = request.body
    
    const userQuary = `SELECT * FROM user WHERE username = '${username}'`
    const dbUser = await db.get(userQuary)
    if (dbUser === undefined){
        response.status(400)
        response.send({err_msg:"Invalid User"})
    }else{
        const isPasswordMatch = await bcrypt.compare(password,dbUser.password)
        if(isPasswordMatch === true){
           const payload = {username : username}
           const jwtToken = jwt.sign(payload, "MY_SECRET_TOKEN")
           response.send({user_id:dbUser.id,jwt_token:jwtToken})
           
        }else{
         response.status(400)
         response.send({err_msg:"Invalid Password"})
        }
 
    }

});

// GET USER TODOS API 
app.get("/user/todos", authenticateToken,async(request,response)=>{
    const {username} = request
    
    const getUserId = `SELECT id FROM user WHERE username = '${username}'`
    const responseId = await db.get(getUserId)
    let {id} = responseId
    
    const sqlQuary = `SELECT * FROM todo WHERE user_id =${id}`

    const dbResponse = await db.all(sqlQuary)
    console.log(dbResponse)
    response.send(dbResponse)

})

// INSERT NEW TODO POST API 
app.post("/todos",authenticateToken, async(request,response)=>{
    const {username} = request
    const {id,title,status,} = request.body
    const userIdQuary = `SELECT id from user WHERE username = '${username}'`
    const userIdObj = await db.get(userIdQuary)
    const userId = userIdObj["id"] 

    const insertTodo = `INSERT INTO todo(id,user_id,title,status)
    VALUES ('${id}',${userId},'${title}','${status}')`
    const dbResponse = await db.run(insertTodo)

    response.send("User Inserted successfully");
    
    
})

// UPDATE TODO PUT API 
app.put("/todos", authenticateToken, async(request,response)=>{
    const{id,status,title} = request.body 
    const updateQuary = `UPDATE todo 
    SET title = '${title}',status ='${status}'
    WHERE id = ?`
    await db.run(updateQuary,[id])
})

// DELETE API 
app.delete("/todos/:id", authenticateToken,async(request,response)=>{
    
    const {id} = request.params
    
    
    const deleteQuery = `DELETE FROM todo WHERE id = ?`;
    await db.run(deleteQuery,[id])
    response.send("Quary Deleted Successfully")
       
   
});

// PROFILE API 
app.get("/profile", authenticateToken, async(request,response)=>{
    const {username} = request
    const getIdQuary = `SELECT id FROM user WHERE username ='${username}'`
    const idObject = await db.get(getIdQuary)
    const {id} = idObject
    
    const userQuary = `SELECT * FROM user WHERE id = ${id}`
    const dbResponse = await db.get(userQuary)
    response.send(dbResponse)
})

// changePassword API 

app.put("/profile", authenticateToken, async(request,response)=>{
    const {id,currentPassword, newPassword} = request.body
    const getUser = `SELECT * FROM user WHERE id = ${id}`
    const dbUser = await db.get(getUser)
    const currentPasswordMatch = await bcrypt.compare(currentPassword, dbUser.password)
    const hashedPassword = await bcrypt.hash(newPassword,10)
    if (currentPasswordMatch === true){
        const updatePassword = `UPDATE user SET password ='${hashedPassword}' WHERE id = ${id}`
        await db.run(updatePassword)
        response.send("Password updated successfully");
        
       
    }else{
        response.status(400)
        response.send({err_msg:"Invalid Current Password"})
    }
})

// DELETE PROFILE API 
app.delete("/profile/:id",authenticateToken,async(request,response)=>{
    const {id} = request.params 
    const deleteUser = `DELETE FROM user WHERE id = ${id}`
    const userTodos = `DELETE FROM todo WHERE user_id = ${id}`
    await db.run(userTodos)
    await db.run(deleteUser)
    response.send("User Deleted Successfully")
    
})







