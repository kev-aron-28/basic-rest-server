const { request, response } = require("express");
const jwt = require("jsonwebtoken");
const User = require("../models/user");

const validateJWT = async (req = request, res = response, next) => {
  const token = req.header("x-token");

  if (!token) {
    return res.status(401).json({
      msg: "No hay token de acceso",
    });
  }

  try {
    const { uid } = jwt.verify(token, process.env.SECRETORPRIVATEKEY);
    const user = await User.findById(uid);
    if(!user) {
        return res.status(401).json({
            msg: 'User not exist in db'
        })
    }
    req.user = user;
    if(!user.status) {
        return res.status(401).json({
            msg: 'Token no valido - usuario con estado en false'
        })
    }
    next();
  } catch (error) {
    console.log(error);
    res.status(401).json({
      msg: "Token invalido",
    });
  }
};

module.exports = {
  validateJWT,
};
