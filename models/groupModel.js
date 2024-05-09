const mongoose = require('mongoose')
  
const groupSchma= mongoose.Schema({

    creater_id:{
         type:mongoose.Schema.Types.ObjectId,
          ref:'User'
    },
    name:{
        type:String,
         require:true
   },
   image:{
    type:String,
    required:true
   },
   limit:{
    type:Number,
    required:true
   }
},
    {
        timestamps:true
    }

)

const group = mongoose.model('Group',groupSchma)

module.exports = group
