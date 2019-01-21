const path = require('path');
const http = require('http');
const express = require('express');
const socketIO = require('socket.io');
const fs = require('fs');
const axios = require('axios');


const publicPath = path.join(__dirname, '../public');
const port = process.env.PORT || 3000;
let key;

//console.log(process.env.NODE_ENV);
const app = new express();
const server = http.createServer(app)
const io = socketIO(server);
const {generateMessage,generateLocationMessage} = require('./utils/message');
const {isRealString} = require('./utils/validation');
const {Users} = require('./utils/users');

let users = new Users();
let rooms = [];
let env = process.env.NODE_ENV || 'development';
if(env == 'development' || env == 'test' ){
     key = require('./utils/keys').mapquestKey;
 }else
     key = process.env.MAPQUESTKEY;
    //  const app = next({ 
    //     dev: process.env.NODE_ENV !== 'production'
    //   })
app.use(express.static(publicPath));

io.on('connection', (socket) =>{
    console.log("new user connected");
    
    let rooms = users.getRooms();
    socket.emit('roomList', rooms);

    socket.on('join', (params, callback)=>{

        if(!isRealString(params.name) || !isRealString(params.room)){
            callback('Name and room name are required.');
        }
        
        socket.join(params.room);

        users.removeUser(socket.id);
        users.addUser(socket.id,params.name,params.room);

        io.to(params.room).emit('updateUserList', users.getUserList(params.room));
        socket.emit('newMessage',generateMessage('Admin','Welcome to the '+params.room + ' room'));
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

 
    socket.on('createLocationMessage', async coords => {
        let user = users.getUser(socket.id);
        if(user){
            let url = 'http://www.mapquestapi.com/geocoding/v1/reverse?key='+key+ '&location='+coords.latitude+','+coords.longitude;
            try{
                let geoInfo = await axios.get(url);
                
                let country = geoInfo.data.results[0].locations[0].adminArea1;
                
                let countryInfo = await axios.get('https://restcountries.eu/rest/v2/alpha/' +country );
              //  console.log(countryInfo);
                let flagurl = countryInfo.data.flag;

                io.to(user.room).emit('newLocationMessage', generateLocationMessage(user.name, flagurl));

            }catch(e){
                console.log(e);
            }
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