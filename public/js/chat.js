let socket = io();


function scrollToBottom () {
    let message = jQuery('#messages');
    let newMessage = message.children('li:last-child');
    let clientHeight = message.prop('clientHeight');
    let scrollTop = message.prop('scrollTop');
    let scrollHeight = message.prop('scrollHeight');
    let newMessageHeight = newMessage.innerHeight();
    let lastMessageHeight = newMessage.prev().innerHeight();

    if( clientHeight+scrollTop+newMessageHeight+lastMessageHeight
        >= scrollHeight){
        message.scrollTop(scrollHeight);
    }
}

socket.on('connect', function () {
    console.log('connected to server');
   let params = jQuery.deparam(window.location.search);
   

   socket.emit('join',params, function(err) {
        if(err){
           alert(err); 
           window.location.href='/'; 
        }else{
            console.log('No error');
        }
     });
});
  //  let li = jQuery('<li></li>');
   // li.load('wall.txt');
   // jQuery('#messages').append(li);

    // socket.emit('createMessage', {
    //     from:'Dunkasaur',
    //     text:'hey this is Donk'
    // });


socket.on('disconnect', function ()  {
    console.log('disconnected from server');
});
socket.on('updateUserList', function(users){
    let ol = jQuery('<ol></ol>');

    users.forEach(function(user){
        ol.append(jQuery('<li></li>').text(user));
    });
    jQuery('#users').html(ol);
});
socket.on('newMessage', function(message) {
    let formattedTime = new moment(message.createdAt).format('h:mm a')
    let template = jQuery('#message-template').html();
    let html = Mustache.render(template, {
       from:message.from,
       text:message.text,
       createdAt:formattedTime
   });
   jQuery('#messages').append(html);
   scrollToBottom();

    // console.log('new message', message);
    // 
    // let li = jQuery('<li></li>');
    // li.text(message.from + ':' +message.text + ' sent at ' +formattedTime);
    // jQuery('#messages').append(li);
});
socket.on('newLocationMessage', function(message) {

    jQuery(".chat__main").css('background-image', 'url('+message.url+')');
  
  
   
    scrollToBottom();

})
let messageTextbox = jQuery('[name=message]');
let nameTextbox = jQuery('[name=user]');

jQuery('#message-form').on('submit',function(e) {
    e.preventDefault();
     socket.emit('createMessage', {
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