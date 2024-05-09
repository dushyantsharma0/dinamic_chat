require('dotenv').config()
const userModel = require('./models/userModel')
var mongoose =require('mongoose')
mongoose.connect(process.env.Mongoose_Connection)
const chatModel=require('./models/chatModel')
const app = require('express')()
const groupMemberModel = require('./models/groupMemberModel')
const group = require('./models/groupModel')
const groupChat=require('./models/groupChatModel')
const server = require('http').Server(app)

const userRout=require('./routers/userRouts')
const { Socket } = require('socket.io')
app.use('/',userRout)
const io= require('socket.io')(server)
var iduser;
const usp=io.of('/user-namespace')
usp.on('connection',async(socket)=>{
    console.log('a user connected')
    iduser=socket.handshake.auth.token
    console.log('starting save',iduser)
  var   userID=socket.handshake.auth.token
    await userModel.findByIdAndUpdate({_id:userID},{$set:{is_online:'1'}})
    //todo: useronline aya chuka hai sabhi ko batanana ka lea
    socket.broadcast.emit('getonlineuser',{userID:userID})
           
    // todo: massige save with sender_id and reciever_id 
    socket.on('senddata', async function(data){
        var chat=   new chatModel({
            Sender_id:data.sender_id,
            Receiver_id:data.reciver_id,
            massige:data.messige
        })
        
          await chat.save()
          socket.emit('sucess',{data:chat})
          console.log(data.messige)
        socket.broadcast.emit('loadchat',{data:data})
    })
    
    socket.on('existchat', async function(data){
           var chat=   await chatModel.find({$or:[
                    {Sender_id:data.sender_id,Receiver_id:data.reciver_id},
                    {Sender_id:data.reciver_id,Receiver_id:data.sender_id}
                ]})
                console.log(chat)
                socket.emit('allchatload',{chat:chat})
    })
    // todo: msg dleat karna ka lea 
    socket.on('dleatmsg',async(data)=>{
        
        try {
            // Trim the ID value to remove any leading or trailing spaces
            const trimmedId = data.trim();
         
            // Use the trimmed ID value in the deleteOne method
            const result = await chatModel.deleteOne({ _id: trimmedId });
            console.log(result); // Log the result for debugging
            // Handle the deletion success
            socket.broadcast.emit('sendmsgtoalldleat',trimmedId)
          } catch (error) {
            console.error('Error occurred during deletion:', error); // Log the error for debugging
            // Handle the error, e.g., return an error response
          }
    })  
     //todo: msg edit karna ka lea

     socket.on('editmsg', async(data)=>{
        let trimdata=data.msg.split("\n");
        let  id=data.id
        console.log(id)
        console.log(trimdata[0])
        let result= await chatModel.findByIdAndUpdate({_id:id},{$set:{massige:trimdata[0]}})
         socket.broadcast.emit('sendmsgtoalledit',[result,trimdata[0]])   

     })

    socket.on('disconnect',async()=>{
        console.log('user disconnected')
        var   userID=socket.handshake.auth.token
         await userModel.findByIdAndUpdate({_id:userID},{$set:{is_online:'0'}})
            //todo: userofline aya chuka hai sabhi ko batanana ka lea
         socket.broadcast.emit('getoflineuser',{userID:userID})
    })
})


//! ------------------start group chatt---------------
 
     const gua=io.of('/groupsusers')
     gua.on('connection',async(socket)=>{
     
 //todo: khud ko chod kar sabhi users ka name send kiya hai 
        
        socket.on('showwuusseerr',async(data)=>{
          var grop_id=data
          let users=  await  userModel.aggregate([
            {
              $lookup: {
                from: "groupmembers",
                localField: "_id",
                foreignField: "user_id",
                pipeline:[
                  {
                    $match: {
                      $expr: {
                        $and: [
                          { $eq: ["$group_id",new mongoose.Types.ObjectId(grop_id)] },
                          // { $eq: ["$user_id", "$$user_id"] }
                        ]
                      }
                    }
                  }
                ],
                as: "member"
              }
            },
            { $match:{"_id":
            {$nin:[new  mongoose.Types.ObjectId(iduser)]
            }
          }}
          ])
          console.log(users)
           socket.emit('getusernames',{userID:users}) 
        })
      
var grop_ids;
      // Handling 'membersList' Event
// Handling 'membersList' Event
socket.on('membersList', async (data) => {
  try {
   
    grop_ids=data.group_id
   
    await groupMemberModel.deleteMany({ group_id: data.group_id });
    const bulkOps = data.other_id.map(user_id => ({
      updateOne:{
        filter:{group_id:data.group_id,user_id:user_id},
        update:{$setOnInsert:{group_id:data.group_id,user_id:user_id}},
        upsert:true
      }
    }));

    if(bulkOps.length > 0){
      await groupMemberModel.bulkWrite(bulkOps, { ordered: false });
    }
  } catch (error) {
    // Handle any potential errors, such as duplicate key errors
    console.error("Error occurred while inserting members:", error);
  }
});

// Handling 'usersListUsers' Event
socket.on('usersListUsers', async (data) => {
  try {
    const usersname = await groupMemberModel.find({ group_id: data });
    const userIDs = usersname.map(entry => entry.user_id);
    const users = await userModel.find({ _id: { $in: userIDs } });
    const userNames = users.map(user => user.name);
    console.log(userNames); // Verify the retrieved user names
    // Use the userNames array as needed
    socket.emit('sendgroupuserlist', userNames);
  } catch (error) {
    // Handle any potential errors
    console.error("Error occurred while retrieving user names:", error);
  }
});
       
socket.on('dleatgroupid', async (data) => {
  try {
    var dleatgropu = await group.deleteOne({ _id: data }); // Assuming 'group' is the model for the group collection
    console.log(dleatgropu);
  } catch (error) {
    console.error(error);
  }
});
 
      //todo: disconnect started
      socket.on('disconnect',()=>{
        
      })
     })






// _________________________groupchat start here________________________________________
// *________________________groupchat start here________________________________________
// ?________________________groupchat start here________________________________________
// !________________________groupchat start here________________________________________
// !todo:___________________groupchat start here________________________________________


var gct = io.of('/chatgroup');
var group_id = ''; // Initialize group_id outside the connection event

gct.on('connection', async (socket) => {
  console.log('chatgroup_connected');

// senderidsend to group user 
socket.emit('senderid',iduser)


  socket.on('groupid', async(data) => {
    console.log('Received groupid:', data);
    group_id = data; // Update the group_id when received
    var allgroupmsg= await groupChat.find({Group_id:group_id})
       socket.emit('allgroupmsgs',{groupmsg:allgroupmsg})
  });

  socket.on('sendgroupid', async (data) => {
    console.log('Received data for sendgroupid:', data);
    
    
    var message = data.message;
      var mysender_id=data.mysender_id
      
    // Broadcast the message to all users in the group
    socket.broadcast.emit('allusermsg', { group_id: group_id, userdata: data }); // Use gct.emit instead of socket.broadcast.emit
              console.log('after save',iduser)
    try {
      var groupmsg = new groupChat({
        Group_id: group_id,
        Sender_id:mysender_id,
        massige: message
      });
      console.log('this is sender id ',mysender_id)
      var result = await groupmsg.save();
      console.log('Message saved:', result);
    } catch (error) {
      console.error('Error saving message:', error);
    }
  });

  // Handle disconnection
  socket.on('disconnect', () => {
    console.log('chatgroup_disconnected');
  });
});
server.listen(3000,()=>{
    console.log('Server is running on port 3000')
})