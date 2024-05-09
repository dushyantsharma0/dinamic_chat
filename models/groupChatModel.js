const mongoose = require('mongoose')
  
const groupchatSchma= mongoose.Schema({

    Sender_id:{
         type:mongoose.Schema.Types.ObjectId,
          ref:'User'
    },
    Group_id:{
        type:mongoose.Schema.Types.ObjectId,
         ref:'group'
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

const groupchat = mongoose.model('groupchat',groupchatSchma)

module.exports = groupchat
