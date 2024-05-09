const mongoose = require('mongoose')
  
const chatSchma= mongoose.Schema({

    Sender_id:{
         type:mongoose.Schema.Types.ObjectId,
          ref:'User'
    },
    Receiver_id:{
        type:mongoose.Schema.Types.ObjectId,
         ref:'User'
   },
   massige:{
    type:String,
    required:true
   }
},
    {
        timestamps:true
    }

)

const Chat = mongoose.model('Chat',chatSchma)

module.exports = Chat
