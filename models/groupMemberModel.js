const mongoose =require('mongoose');

const groupMembers = mongoose.Schema({
    group_id:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Group'
        
    },
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        unique: true, // 'user_id' field must be unique
        // Other properties for the 'user_id' field
      },

}, 
    {
        timestamps:true
    }
)

const GroupMember = mongoose.model('Groupmembers',groupMembers)

module.exports = GroupMember