(function($) {

	"use strict";

	var fullHeight = function() {

		$('.js-fullheight').css('height', $(window).height());
		$(window).resize(function(){
			$('.js-fullheight').css('height', $(window).height());
		});

	};
	fullHeight();

	$('#sidebarCollapse').on('click', function () {
      $('#sidebar').toggleClass('active');
  });

})(jQuery);

// ------------------------------------------------ start dinamic chat ------------------------------

// decode karna ka lea use karta hai  
function getCookie(name) {
	let matches = document.cookie.match(new RegExp(
		"(?:^|; )" + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + "=([^;]*)"
	));
	return matches ? decodeURIComponent(matches[1]) : undefined;
}

  // this is global variable
        var userdata =JSON.parse(getCookie('user'))
		console.log(userdata._id)
  var sender_id =userdata._id;
  var reciver_id
  var global_group_id;
  var socket=   io('/user-namespace',{
	  auth:{
		  token:userdata._id
	  }
  });
  

  $(document).ready(function(){
	   $('.user-list').click(function(){
		 var userid=  $(this).attr('data-id')
			 reciver_id=userid

		  $('.start-head').hide();
		  $('.chat-section').show();
		  socket.emit('existchat',{sender_id:sender_id,reciver_id:reciver_id});
	   })    
  })
   
   socket.on('getonlineuser',function(data){
			 $('#'+data.userID+'-status').text('Online');
			 $('#'+data.userID+'-status').removeClass('ofline-status')
			 $('#'+data.userID+'-status').addClass('online-status')
			 scrollchat()
   })
   socket.on('getoflineuser',function(data){
			 $('#'+data.userID+'-status').text('ofline');
			 $('#'+data.userID+'-status').removeClass('online-status')
			 $('#'+data.userID+'-status').addClass('ofline-status')

   })

  //  chat save of user 

$('#chat-form').submit(function(event) {
  event.preventDefault();
  var massige = $('#massige').val();
	socket.emit('senddata',{sender_id:sender_id, reciver_id:reciver_id ,messige:massige})
	socket.on('sucess',(data)=>{
   
	 var id=data.data._id
	 console.log(id)
	  let chat =massige
	  let html=`<div class="current-user-chat">
		  <h5>${chat} <i class="fa fa-trash" aria-hidden="true"  data_id='${id}' '></i>
			<i class="fa fa-edit   data_id='${id}'"></i>
			</h5>
		  </div>`
		  $('.chat-container').append(html)
		  $('#massige').val('');
		  massige=""
		  scrollchat()
	})
	
});
		
socket.on('loadchat',function(data){
 
  if(sender_id==data.data.reciver_id&&reciver_id==data.data.sender_id){
	let chat =data.data.messige
	console.log(chat)
  let html=`<div class="distance-user-chat">
		  <h5><span>${chat}</span></h5>
		  </div>`
		  $('.chat-container').append(html)
  }
  scrollchat()
})
	   
	   //chat load 
	   socket.on('allchatload',function(data){
			 $('.chat-container').html('');
			 var chat =data.chat
			 console.log(chat)
			 let html='';
			 
			 for(let i=0;i<chat.length;i++){
			  let allClass=''
			  if(chat[i]['Sender_id']==sender_id){
				allClass='current-user-chat'
			  }else{
				allClass='distance-user-chat'
			  }
			  html+=`<div class=${allClass} id='${chat[i]["_id"]}'
		  <h5> <span>${chat[i]['massige']}</span>`
		  if(chat[i]['Sender_id']==sender_id){
			html+=`  <i class="fa fa-trash" aria-hidden="true"  data_id='${chat[i]["_id"]} '></i>
			<i class="fa fa-edit "  data_id='${chat[i]["_id"]}' ></i>
			`
		  }
		  html+=`
		</h5>
		  </div>`
		  
			 }
		   
			 $('.chat-container').append(html)
			 scrollchat()
	   })
	   function scrollchat(){
		$('.chat-container').animate({
		  scrollTop:$('.chat-container').offset().top+$('.chat-container')[0].scrollHeight
		},0)
	   }
	  
	$(document).on('click','.fa-trash',function(){
	  // server tak bauchana ka lea dleat requrest ko 
			  console.log('dleat',$(this)) // console.log('dleat',$(this).attr('data_id'))
	  var msg =$(this).parent().text()
	  let userResponse = confirm(`are you want to delete this  msg? \n\n ${msg}`);
		   if(userResponse){
			 
			socket.emit('dleatmsg',$(this).attr('data_id'))

			$(this).parent().remove()
		   }
	   
   
	}) 
		  socket.on('sendmsgtoalldleat',function(data){
				  $('#'+data).remove()
		  })
		 

		  //chat edit system set
			 $(document).on('click','.fa-edit',function(){
			 let id=$(this).attr('data_id')
			  var msg =$(this).parent().text()
			  let userResponse = prompt(`are you want to edit this  msg?`,msg);
			 if(userResponse !== null){
			   socket.emit('editmsg',{id:id,msg:userResponse})
			   $('#'+id).html(`<div class="current-user-chat">
		  <h6><span> ${userResponse}</span>
		  <i class="fa fa-trash" aria-hidden="true"  data_id='${id} '></i>
			<i class="fa fa-edit "  data_id='${id}' ></i>
		  </h6>
		  </div>`)
			 }

			 })

			 socket.on('sendmsgtoalledit',function(data){
									   console.log(data[0]._id)
								  
								 
									  $('#'+data[0]._id).html(`${data[1]}`)
									
										  
			 })



			// ! -----------------------start multi chat ----------------------
       // !todo> -----------------------start multi chat ----------------------          
var group_id;
	   $('.grpid').hover(function(){
		group_id=$(this).attr('group_id');
		// console.log(group_id)
	});

	    

            //  groop ma mabers jodna ka lea member ki list 
			var secondsocket  =io('/groupsusers')
			secondsocket.on('getusernames',(data)=>{
				console.log(data)
 for (let i = 0; i< data.userID.length; i++) {
	   var names=data.userID[i].name
	   var id=data.userID[i]._id
	   var ismemmberofgroup=data.userID[i].member.length>0?true:false
         html=` <tr class='innershowusers'>
		 <td class="td chbox" userIds='${id}'><input type="checkbox" ${ismemmberofgroup?'checked':''}></td>
		 <td class="td">${names}</td>
		 </tr> `
		 $('.addname').append(html)
 }
    
  })

$('.cancil').click(function(){
	$('.showusers').addClass('d-none')
	$('.innershowusers').html('')
	
})
   
    $(document).ready(function(){
        $('.btnshow').click(function(){
           $('.my').removeClass('d-none')
           $('.btnshow').addClass('d-none')
              
        })
    })

	$('.btnshowname').click(function(){
	            secondsocket.emit('showwuusseerr',group_id)
		$('.showusers').removeClass('d-none')
	 })


 $(document).on('click','.savegroup',function(){
    if($('#image').val()!==''&&$('#groupname').val()!==''&&$('#limit').val()!==''){
        $('.my').addClass('d-none')
           $('.btnshow').removeClass('d-none')
           var groupname=$('#groupname').val()
           var limit=$('#limit').val()
           var image = $('#image').val()
          
                       $('#groupname').val('')
                       $('#limit').val('')
                       $('#image').val('')
       }else{
        alert('please fill all fields')
       }
 })


 

    $('.cancil').click(function(){
        $('.my').addClass('d-none')
           $('.btnshow').removeClass('d-none')
    });



var other_id=[]
	//todo: save group menbers
	$('.svebtn').click(function(){
		
		$('.chbox').each(function(index, element) {
		  if ($(element).find('input[type="checkbox"]').is(':checked')) {
            //  other_id.push($(element).attr('userIds'))
        
			other_id.push($(element).attr('userIds'))
			
		  
			
		  }
		  
		});
		console.log(other_id)
		secondsocket.emit('membersList',{other_id:other_id,group_id:group_id})
		other_id=[]
		$('.showusers').addClass('d-none')
		$('.innershowusers').html('')
	  });






	//   ??---------------------show users karna ka lea code start ---------------------------------



	$('.datashowall').click(function(){
            secondsocket.emit('usersListUsers',group_id)
			$('.mbox').removeClass('d-none')
		
	})
	secondsocket.on('sendgroupuserlist',(data)=>{
		console.log(data)
		$('.namelist').html('')
		for (let i= 0; i < data.length; i++) {
			var newHtml =`
               
			<h4 style="font-size: 20px;">${data[i]} </h4>
			`
			
			$('.namelist').append(newHtml)
		}
		
	})
	
	$('.okaybtn').click(function(){
		$('.mbox').addClass('d-none')
	})





	// _________________________groupchat start here________________________________________
// *________________________groupchat start here________________________________________
// ?________________________groupchat start here________________________________________
// !________________________groupchat start here________________________________________
// !todo:___________________groupchat start here________________________________________


//   group dleat karna ke lea 
$('.groupdleat').click(function(){
	var name=$(this).attr('username');
	const confirmation = confirm(`Are you want to dleat (${name}) group`);
     if(confirmation) {
var  id=$(this).attr('userid')
	  secondsocket.emit('dleatgroupid',id)
	  alert(`---${name}--- group deleat successfully`)
	  location.reload();
	 }
	
})


// group edit karna ka lea 
// var names;
// var img;
// var id;
// var limit;
// $('.groupedit').click(function(){
// 	names=$(this).attr('username');
// 	 img=$(this).attr('image')
// 	 id=$(this).attr('userid')
// 	 limit=$(this).attr('limit')
// 	 $('.editmy').removeClass('d-none')
// 	 $('.imageedit').attr('src','http://localhost:3000/'+img)
// 	 $('#groupnameedit').val(names)
// 	 $('#limitedit').val(limit)
// 	 $('#ids').val(id)

// })


$('.canciledit').click(function(){
	$('.editmy').addClass('d-none')
})