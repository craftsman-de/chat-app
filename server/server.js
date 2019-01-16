const path = require('path');
const http = require('http');
const express = require('express');
const socketIO = require('socket.io');

const publicPath = path.join(__dirname, '../public');
const port = process.env.PORT || 3000;
const app = new express();
let server = http.createServer(app)
let io = socketIO(server);
const {generateMessage} = require('./utils/message');

app.use(express.static(publicPath));
let userCount = 0;
io.on('connection', (socket) =>{
    userCount++;
    console.log("new user connected");
    socket.emit('newMessage',generateMessage('Admin','Welcome to fossil chat'));
    socket.broadcast.emit('newMessage', generateMessage('Admin','New user connected! Usercount:'+userCount));
   
 
    
    socket.on('createMessage', (newMessage, callback) => {
        console.log('newMessage:',newMessage);
        io.emit('newMessage', generateMessage(newMessage.from,newMessage.text));
        callback('*server message*');
        // socket.broadcast.emit('newMessage', {
        //     from:newMessage.from,
        //     text:newMessage.text,
        //     createAt:new Date().getTime()
        // })
    });

    socket.on('disconnect', (socket)=>{
        userCount--;
         console.log('socket disconnected')
    });
});
server.listen(port, ()=>{
    console.log('server running on port '+port);
})