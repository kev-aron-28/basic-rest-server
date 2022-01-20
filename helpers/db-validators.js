const Role = require("../models/role");
const User = require('../models/user');

const validRole = async (role = '') => {
    const exists = await Role.findOne({role});
    if(!exists) {
        throw new Error(`El role ${role}, no esta registrado`)
    }
}

const existsEmail = async (email = '') => {
  const existsEmail = await User.findOne({ email });
  if(existsEmail) {
    throw new Error('El email ya existe');
  }
}

const userByIdExists = async (id = '') => {
  const existsUser = await User.findById( id );
  if(!existsUser) {
    throw new Error('El id no existe');
  }
}

module.exports = {
    validRole,
    existsEmail,
    userByIdExists
}