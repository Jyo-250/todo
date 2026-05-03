const jwt = require("jsonwebtoken");

function authmiddleware(req,res,next){
    const token = req.headers.token;
    const decoded = jwt.verify(token,"Jyothsna123");
    if(decoded.userId){
        req.userId = parseInt(decoded.userId);
        next()
    } else{
        res.status(403).josn({
            message: "Token invalid or not found"
        })
    }
}
module.exports ={
    authmiddleware: authmiddleware
}