const bcrypt = require("bcryptjs");
const { response } = require("express");
const generateJWT = require("../helpers/generateJWT");
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


module.exports = {
    login
}