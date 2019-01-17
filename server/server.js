const path = require('path');
const http = require('http');
const express = require('express');
const socketIO = require('socket.io');
const fs = require('fs');


const publicPath = path.join(__dirname, '../public');
const port = process.env.PORT || 3000;
const app = new express();
const server = http.createServer(app)
const io = socketIO(server);
const {generateMessage,generateLocationMessage} = require('./utils/message');
const {isRealString} = require('./utils/validation');
const {Users} = require('./utils/users');

let users = new Users();


app.use(express.static(publicPath));

io.on('connection', (socket) =>{
    console.log("new user connected");
    
    socket.on('join', (params, callback)=>{

        if(!isRealString(params.name) || !isRealString(params.room)){
            callback('Name and room name are required.');
        }

        socket.join(params.room);
        users.removeUser(socket.id);
        users.addUser(socket.id,params.name,params.room);

        io.to(params.room).emit('updateUserList', users.getUserList(params.room));
        socket.emit('newMessage',generateMessage('Admin','Welcome to fossil chat.'));
      //  console.log(params.name);
        socket.broadcast.to(params.room).emit('newMessage', generateMessage('Admin' , params.name+' has joined the room'));
   
        callback();
    });

    socket.on('createMessage', (newMessage, callback) => {
       fs.appendFileSync(__dirname +'/../public/wall.txt', newMessage.from + ':' +newMessage.text + '<br>' +'\n');
        let user = users.getUser(socket.id);
        if(user && isRealString(newMessage.text)){
            io.to(user.room).emit('newMessage', generateMessage(user.name,  newMessage.text));
        }
       callback('');
        // socket.broadcast.emit('newMessage', {
        //     from:newMessage.from,
        //     text:newMessage.text,
        //     createAt:new Date().getTime()
        // })
    });

 
    socket.on('createLocationMessage', coords => {
        let user = users.getUser(socket.id);
        if(user){
            io.to(user.room).emit('newLocationMessage', generateLocationMessage(user.name, coords.latitude , coords.longitude));
        }

        
    })

    socket.on('disconnect', (dsocket)=>{
        let user = users.removeUser(socket.id); 
        if(user){
            io.to(user.room).emit('updateUserList', users.getUserList(user.room));
            io.to(user.room).emit('newMessage', generateMessage('Admin', user.name+' has left the building'));
        }
    });
});
server.listen(port, ()=>{
    console.log('server running on port '+port);
})