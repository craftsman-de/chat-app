let socket = io();

socket.on("connect", function() {
    console.log("connected to login");
    socket.on("roomList", function(rooms){
        console.log(rooms);
        if(rooms.length  > 0){
            jQuery('#dropdown-label').html('<label>OR join an existing room</label>');
            let ddl = jQuery('<select></select');
            ddl.attr('id','joining-room')
     
            
            
            
            rooms.forEach(room =>{
                ddl.append(jQuery('<option></option>').val(room).text(room));
            });
            jQuery('#dropdown').html(ddl);
        }
   
    } );

});

jQuery("#userinfo").submit(function(){
    if(jQuery('#create-room').val() =='')
         jQuery('#joining-room').attr('name','room');
});

