import bcrypt from 'bcrypt' 
import jsonwebtoken from "jsonwebtoken";
import models from "../models";

export const register = async (req, res) => {
   const { name, email, password} = req.body; //bodyParser packge.json
   try {
    const isEmailUsed = await models.User.findOne({where: {email}});

    if(isEmailUsed) {
        return res.status(401).json({
            message: "Email already in use"
        });
    }
       const hashPassword = await bcrypt.hash(password, 10); 
       const user = await models.User.create({
           name,
           email,
           password: hashPassword,
       })
       const token = jsonwebtoken.sign({id: user.id, name: user.name, email: user.email},process.env.JWT_SECRET);
            res.status(200).json({accessToken: token});
       
   }catch(e) {
       console.log(e);
       res.status(500).json(e);
   }
}

export const login = async(req, res) => {
    const {email, password} = req.body;

    try {
        const user = await models.User.findOne({where: {email}});

        if(!user) {
            return res.status(401).json({
                message: "email or password is not corect"
            });
        }

        const authSuccess = await bcrypt.compare(password, user.password);

        if(authSuccess){
            const token = jsonwebtoken.sign({id: user.id, name: user.name, email: user.email},process.env.JWT_SECRET);
            res.status(200).json({accessToken: token});
        }
        if(!authSuccess) {
            return res.status(401).json({
                message: "email or password is not corect"
            });
        }

    }catch (e) {
        res.status(500).json(e);
    }
};

export const me = (req, res) =>{
    const user = req.currentUser;
    res.json(user);
};
