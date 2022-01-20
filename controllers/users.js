const { response } = require("express");
const bcrypt = require("bcryptjs");
const User = require("../models/user");

const getUsuarios = async (req, res = response) => {
  const { limit = 5, to = 0 } = req.query;  
  const [ total, users ] = await Promise.all([
    User.countDocuments({ status: true }), 
    User.find({ status: true })
    .skip(Number(to))
    .limit(Number(limit))
  ])
  
  res.json({
    total,
    users
  });
};

const putUsuarios = async (req, res = response) => {
  const { id } = req.params;
  const { _id, password, google, email, ...user } = req.body;
  if (password) {
    const salt = bcrypt.genSaltSync();
    user.password = bcrypt.hashSync(password, salt);
  }

  const userDb = await User.findByIdAndUpdate(id, user);

  res.json(userDb);
};

const postUsuarios = async (req, res = response) => {
  const { name, email, role, password } = req.body;
  const user = new User({ name, email, password, role });

  const salt = bcrypt.genSaltSync();
  user.password = bcrypt.hashSync(password, salt);

  await user.save();

  res.json({
    user,
  });
};

const deleteUsuarios = async (req, res = response) => {
  const { id } = req.params;
  // Fisicamente
  // const user = await User.findByIdAndDelete(id);
  const user = await User.findByIdAndUpdate(id, {
     status: false
  })
  res.json(user);
};

module.exports = {
  getUsuarios,
  putUsuarios,
  postUsuarios,
  deleteUsuarios,
};
