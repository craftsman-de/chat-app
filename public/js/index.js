
let socket = io();

socket.on('connect', function () {
    console.log('connected to server');
   
    let li = jQuery('<li></li>');
    li.load('wall.txt');
    jQuery('#messages').append(li);

    // socket.emit('createMessage', {
    //     from:'Dunkasaur',
    //     text:'hey this is Donk'
    // });
});

socket.on('disconnect', function ()  {
    console.log('disconnected from server');
});

socket.on('newMessage', function(message) {
    console.log('new message', message);
    let li = jQuery('<li></li>');
    li.text(message.from + ':' +message.text);
    jQuery('#messages').append(li);
});

jQuery('#message-form').on('submit',function(e) {
    e.preventDefault();
    let user = jQuery('[name=user]').val();
    socket.emit('createMessage', {
        from:user,
        text:jQuery('[name=message]').val()
    }, function(){
       jQuery('[name=message]').val("") ;
    }); 

});

var locationButton = jQuery('#send-location');
locationButton.on('click', function(){
    if(!navigator.geolocation){
        return alert('Geolocation not supported by your browser.');
    }
    navigator.geolocation.getCurrentPosition(function(position){
        console.log(position);
    }, function(){
        alert('Unable to fetch location');
    });
});