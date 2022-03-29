const bcrypt = require("bcryptjs");
const { response, request } = require("express");
const { generateJWT } = require("../helpers/generateJWT");
const { googleVerify } = require("../helpers/google_verify");
const User = require('../models/user')

const login = async (req, res = response) => {
    
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });
        if(!user) {
            return res.status(400).json({
                msg: 'User not exist'
            })
        }

        if(!user.status) {
            return res.status(400).json({
                msg: 'User not active'
            })
        }

        const validPassword = bcrypt.compareSync(password, user.password);

        if(!validPassword) {
            return res.status(400).json({
                msg: 'User password incorrect'
            }) 
        }

        const token = await generateJWT(user.id);

        return res.json({
            user,
            token
        })

    } catch (error) {
        console.log(error);
        res.status(500).json({
          msg: 'Algo salio mal'
        })
    }
    
};

const googleSignIn = async (req = request, res = response) => {
    const { id_token } = req.body;

    try {
        const { name, picture:img , email } = await googleVerify(id_token);

        let user = await User.findOne({ email });
        if(!user){
            const data = { 
                name,
                email,
                password: 'algo',
                img,
                google: true,
                role: 'USER_ROLE'
            };
            user = new User(data);
            await user.save()
        }

        if(!user.status) {
            return res.status(401).json({
                msg: 'Hable con el admin, user bloqueado'
            })
        }

        const token = await generateJWT(user.id);

        res.json({
            msg: 'OK',
            token,
            user
        });
    } catch (error) {
        res.status(400).json({
            ok: false,
            msg: 'El token no se pudo verificar',
            error
        })
    }

}

const renovateJWT = async (req = request, res = response) => {
    const { user } = req;
    const token = await generateJWT(user.id);
    res.json({
        user,
        token
    })
}

module.exports = {
    login,
    googleSignIn,
    renovateJWT
}