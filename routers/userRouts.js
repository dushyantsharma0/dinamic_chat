const express = require('express');

const userRoute = express();
 const bodyParser = require('body-parser')

 const path = require('path');
 const multer = require('multer');
const section =require('express-session')
const {SECTION_SECRATE} =process.env;
 
  userRoute.use(section({secret:SECTION_SECRATE, resave: false, // Add this line to address the deprecation warning
  saveUninitialized: true,}))
  const cookieParser = require('cookie-parser');
          userRoute.use(cookieParser());
 userRoute.use(bodyParser.json());

 userRoute.use(bodyParser.urlencoded({ extended: true }));

 userRoute.set('view engine','ejs');
 userRoute.set('views','./views');
 userRoute.use(express.static('public'));

const storage= multer.diskStorage({
    destination:(req,file,cb)=>{
        cb(null,path.join(__dirname,'../public/images'))
    },
    filename:(req,file,cb)=>{
         const name= Date.now()+'-'+file.originalname;
            cb(null,name)

    }
})

const upload= multer({storage:storage})


const usercontrole=require('../controllers/usercontrole')
 const auth=require('../middleware/auth')

userRoute.get('/register',auth.isLogout,usercontrole.registerLoad)
 
 userRoute.post('/register',upload.single('image'),usercontrole.register)

 userRoute.get('/' ,auth.isLogout,usercontrole.loadLogin)
 userRoute.post('/' ,usercontrole.login)
 userRoute.get('/logout',auth.isLogin,usercontrole.logout)
 userRoute.get('/dasboard',auth.isLogin ,usercontrole.loadDashbord)
 userRoute.post('/savechat',usercontrole.savechat)
 userRoute.get('/groups',auth.isLogin,usercontrole.loadGroups)
 userRoute.post('/groups',upload.single('image'),auth.isLogin,usercontrole.group)
 userRoute.get('/getmember',auth.isLogin,usercontrole.getmember)
 userRoute.get('/groupchat',auth.isLogin,usercontrole.groupchat)
//  userRoute.post('/groupchat',upload.single('image'),auth.isLogin,usercontrole.edituser)

 userRoute.get('*', function(req ,res){
    res.redirect('/')
 });




module.exports =userRoute
  






