const path = require("path");
const http = require("http");
const express = require("express");
const socketio = require("socket.io");
const Filter = require("bad-words");
const {generateMessage}=require("./utils/messages")
const  { addUser,removeUser,getUser,getUsersInRoom,}=require('./utils/users')

const app = express();
const server=http.createServer(app);
const io=socketio(server);

const publicPath = path.join(__dirname, "../public");
app.use(express.static(publicPath));


//socket.emit ,io.emit,socket.broadcast.emit
//io.to.emit,socket.broadcast.to.emit

io.on('connection',(socket)=>{

    console.log(" New web socket connection established ");
  
    socket.on('join', ({username,room},callback)=>{
        const {error,user}=addUser({id:socket.id,username,room})
        if(error) {
            return callback(error);
        }

        socket.join(user.room)
        socket.emit('message',generateMessage('Admin','Welcome'))   
        socket.broadcast.to(user.room).emit('message',generateMessage('Admin',`${user.username} has joined`))
       
        io.to(user.room).emit('roomData',{
            room: user.room,
            users:getUsersInRoom(user.room),
            createdAt:new Date().getTime()

        })

        callback()
    })

    socket.on("sendMessage",(message,callback)=>{
        const user=getUser(socket.id)
    
        const filter=new Filter()
        if(filter.isProfane(message)){
            return callback("Profanity not allowed")
        }
        io.to(user.room).emit('message',generateMessage(user.username,message))
        callback()
    }) 

    socket.on('disconnect',()=>{
        const user=removeUser(socket.id)
        if(user){
            io.to(user.room).emit('message',generateMessage('Admin',`${user.username} left `))

            io.to(user.room).emit('roomData',{
                room: user.room,
                users:getUsersInRoom(user.room)
            })
        }
    })
})


const port = process.env.PORT || 8000;

server.listen(port, () => {
    console.log(" server is running on port ", port);
  });