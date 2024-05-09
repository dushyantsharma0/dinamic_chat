 const session = require('express-session')
const user= require('../models/userModel')
const chat=require('../models/chatModel')
 const bcrypt = require('bcrypt')
const groupmodel = require('../models/groupModel')
   const Groupmembers=require('../models/groupMemberModel')
const  registerLoad =async (req,resp)=>{
    try {
          

        resp.render('register.ejs')
    } catch (error) {
         console.log(error.massige)
    }
 
}
const  register =async (req,res)=>{
    try {
        const passwordHash= await bcrypt.hash(req.body.password,10);
        const myuser=   new user({
             name:req.body.name,
             email:req.body.email,
             image:'images/'+req.file.filename,
             password:passwordHash,
          })
         
          await myuser.save()
         
          res.render('register.ejs',{massige:' Registration Success !'})
    } catch (error) {
         console.log(error.massige)
    }
}
const loadLogin =async (req,res)=>{
     try {
    res.render('login.ejs')
    } catch (error) {
         console.log(error.massige)
    }
}
const login =async (req,res)=>{
    try {
           const email= req.body.email
           const password= req.body.password
        const userData= await user.findOne({email:email})
        if(userData){
            
           const matchpassword = await bcrypt.compare(password,userData.password)
           if(matchpassword){
              
            req.session.user=userData
            res.cookie(`user`,JSON.stringify(userData))
            res.redirect('/dasboard')
            
           }else{
            res.render('login.ejs',{massige:'Invalid Email or Password'})
           }
        }else{
            res.render('login.ejs',{massige:'Invalid Email or Password'})
        }

   } catch (error) {
        console.log(error.massige)
   }
}
const logout =async (req,res)=>{
    try {
         req.session.destroy()
         res.clearCookie('user')
         res.redirect('/')
   } catch (error) {
        console.log(error.massige)
   }
}
const loadDashbord =async (req,res)=>{
    try {
      const users=  await  user.find({_id:{$nin:[req.session.user._id]}})
  
        res.render('dashbord.ejs',{user:req.session.user,users:users})
   
   } catch (error) {
        console.log(error.massige)
   }
}

const savechat=async(req,res)=>{
     try {
       var chat=    new chat({
               sender_id:req.body.sender_id,
               reciever_id:req.body.reciever_id,
               message:req.body.message
           })
            var newchat= await chat.save()
             res.status(200).send({success:true,msg:'Message Sent Successfully',data:newchat})
               console.log('AAA')
     } catch (error) {
           res.status(400).send({success:false,msg:error.message})
           console.log('BBB')
     }
}

//! start group chat here 


const loadGroups=async(req,res)=>{
     try {
        var  groups= await  groupmodel.find({creater_id:req.session.user._id})
            res.render('groups.ejs',{groups:groups})
                   
       } catch (error) {
            console.log(error.massige)
       }
}

const group =async(req,res)=>{
     try {
          var creater_id = req.session.user._id
           var groupname=req.body.groupname;
           var image='images/'+req.file.filename
           var limit=req.body.limit;
     var data = new groupmodel({
          creater_id:creater_id,
          name:groupname,
          image:image,
          limit:limit
 
     })    
     var result=await data.save()  
     console.log(result)
     var  groups= await  groupmodel.find({creater_id:req.session.user._id})
     res.render('groups.ejs',{groups:groups})
              
             

     } catch (error) {
            console.log(error.massige)
  
     }
}

const getmember =async (req,res)=>{
     try {
       let users=  await  user.find({_id:{$nin:[req.session.user._id]}})
   
         res.status.send(200).send({data:users})
    
    } catch (error) {
         console.log(error.massige)
    }
 }


 const groupchat=async (req,res)=>{
     try {
      const myGroups=await groupmodel.find({creater_id:req.session.user._id })
      const joinedGroups=await Groupmembers.find({user_id:req.session.user._id }).populate('group_id')
              console.log('my name is aman sharma',joinedGroups)
          res.render('groupchat.ejs',{myGroups:myGroups,joinedGroups:joinedGroups})     
     } catch (error) {
            console.log(error.massige)
  
     }
 }

// const edituser=async(req,res)=>{
//      try {
//           // var groupname=req.body.groupname;
//           // var image='images/'+req.file.filename
//           // var limit=req.body.limit;
//           // var id=req.body.id;
//           // console.log('this is deit id',id)
//           // // var data = groupmodel.updateOne({ _id:id }, { $set: {
//           // //      groupname: groupname,
//           // //      image: image,
//           // //      limit: limit
//           // //    }});
         
//           // // console.log(data)

//      } catch (error) {
//             console.log(error.massige)
//      }
// }

module.exports ={
    registerLoad,
    register,
    loadLogin,
    login,
    logout,
    loadDashbord,
    savechat,
    loadGroups,
     group,
     getmember,
     groupchat,
     // edituser
}