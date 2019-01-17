

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
    let formattedTime = new moment(message.createdAt).format('h:mm a')
    let li = jQuery('<li></li>');
    li.text(message.from + ':' +message.text + ' sent at ' +formattedTime);
    jQuery('#messages').append(li);
});
socket.on('newLocationMessage', function(message) {
    let formattedTime = new moment(message.createdAt).format('h:mm a')
    let li = jQuery('<li></li>');
    let a = jQuery('<a target=\"_blank\">My current Location</a>');
    li.text(message.from +':');
    a.attr('href', message.url);
    li.append(a).append(' sent at ' +formattedTime);
    
    jQuery('#messages').append(li);
})
let messageTextbox = jQuery('[name=message]');
let nameTextbox = jQuery('[name=user]');

jQuery('#message-form').on('submit',function(e) {
    e.preventDefault();
    let user = nameTextbox.val();
    if(user == ''){
        user ='Unknown Dinosaur';
        nameTextbox.val(user);
    }
    socket.emit('createMessage', {
        from:user,
        text:messageTextbox.val()
    }, function(){
        messageTextbox.val("") ;
    }); 

});

var locationButton = jQuery('#send-location');

locationButton.on('click', function(){
    if(!navigator.geolocation){
        return alert('Geolocation not supported by your browser.');
    }
    locationButton.attr('disabled','disabled').text('Sending Location..');
    navigator.geolocation.getCurrentPosition(function(position){
        
        let user = jQuery('[name=user]').val();
        if(user == ''){
            user ='Unknown Dinosaur';
            jQuery('[name=user]').val(user);
        }
      
        socket.emit('createLocationMessage', {
            name:user,
            latitude:position.coords.latitude,
            longitude:position.coords.longitude
        });
        locationButton.removeAttr('disabled').text('Send Location');

        
    }, function(){
        locationButton.removeAttr('disabled').text('Send Location');
        alert('Unable to fetch location');
    });
});