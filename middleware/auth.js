
const isLogin= async (req, res,next) =>{
    try {
        if(req.session.user){
                 
        }else{
            res.redirect('/')
        }
        next()
    } catch (error) {
         console.log(error.massige)
    }
}
const isLogout= async (req, res,next) =>{
    try {
        if(req.session.user){
                   res.redirect('/dasboard')
        }
        next()
    } catch (error) {
         console.log(error.massige)
    }
}

module.exports ={
    isLogin,
    isLogout
}