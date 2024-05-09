




function getCookie(name) {
	let matches = document.cookie.match(new RegExp(
		"(?:^|; )" + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + "=([^;]*)"
	));
	return matches ? decodeURIComponent(matches[1]) : undefined;
}

  // this is global variable
        var userdata =JSON.parse(getCookie('user'))
		console.log(userdata._id)

		function scrollchatgroup(){
			$('.group-chat-container').animate({
			  scrollTop:$('.group-chat-container').offset().top+$('.group-chat-container')[0].scrollHeight
			},0)
		   }


var thirdsocket = thirdsocket || io('/chatgroup');
var mysender_id;
thirdsocket.on('senderid',(data) => {
    // console.log('Received senderid:', data);
    mysender_id = data; // Update the sender_id when received
})
var global_group_id;
	$('.group-list').click(function(){
		// $('.group-chat-container').empty();
		$('.group-chat-section').show();
		$('.group-start-head').hide();
		global_group_id = $(this).attr('data-id');
		console.log(global_group_id);
		thirdsocket.emit('groupid', global_group_id);
       
         thirdsocket.on('allgroupmsgs',(data)=>{
			$('.group-chat-container').empty();
            console.log(data)
             for (let i = 0; i < data.groupmsg.length; i++) {
                      var msg=data.groupmsg[i].massige;
					 
                      if(data.groupmsg[i].Sender_id==mysender_id){
                        var html = `<div  class="group-current-user-chat">
                        <h5>${msg} <i class="fa fa-trash" aria-hidden="true" data_id=''></i>
                        <i class="fa fa-edit" data_id=''></i>
                        </h5>
                      </div>`;
                      $('.group-chat-container').append(html);
                      }else{
                        var html = `<div  class="group-distance-user-chat">
                        <h5>${msg} 
                        
                        </h5>
                      </div>`;
					  
                      $('.group-chat-container').append(html);
					  scrollchatgroup()
					  
                      }

                      
    
                
             }
         })

	  });
	  
	  $('.groupmsg').click(function(e){
            
             
		var message = $('.grpmsgvalue').val();
       
		thirdsocket.emit('sendgroupid', {mysender_id:userdata, message: message });
		$('.grpmsgvalue').val('');
	  
		var html = `<div class="group-current-user-chat">
		  <h5>${message} <i class="fa fa-trash" aria-hidden="true" data_id='${userdata}'></i>
		  <i class="fa fa-edit" data_id='${userdata}'></i>
		  </h5>
		</div>`;
		$('.group-chat-container').append(html);
		scrollchatgroup()
	  });
	  
	
	  thirdsocket.on('allusermsg', (data) => {
		// Handle the data received from the server
		if(global_group_id==data.group_id){
            var msg=data.userdata.message;
		var html = `<div class="group-distance-user-chat">
		  <h5>${msg} </h5>
		</div>`;
		$('.group-chat-container').append(html);
		scrollchatgroup()
        }
	  });



	