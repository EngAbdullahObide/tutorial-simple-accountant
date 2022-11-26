const jsonwebtoken =require ("jsonwebtoken");
const models = require('../models');

const isLoggedIn = async (req, res, next) => {
    try{
        if (!req.headers.authorization){
            return res.status(400).json({
                message: 'You are not logged in'
            });
        }
        const token = req.headers.authorization.split(" ")[1];
        const decoded = jsonwebtoken.verify(token, process.env.JWT_SECRET); // فك تشفير  للحصول علئ الاسم الايمل الخ
        req.currentUser = decoded;
        next();
    }catch(e){
        res.status(500).json(e.message);
    }

}

module.exports= isLoggedIn;