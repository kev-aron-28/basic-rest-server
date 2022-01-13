const { response } = require("express");

const getUsuarios = (req, res = response) => {
 
  const params = req.query
  res.json({
    msg: "api Get - controller",
    params
  });
};

const putUsuarios = (req, res = response) => {
  
  const id = req.params.id;

  res.json({
    msg: "api Put - controller",
    id
  });
};

const postUsuarios = (req, res = response) => {
  const body = req.body;
  res.json({
    msg: "api Post - controller",
    body
  });
};

const deleteUsuarios = (req, res = response) => {
  res.json({
    msg: "api Delete - controller",
  });
};

module.exports = {
  getUsuarios,
  putUsuarios,
  postUsuarios,
  deleteUsuarios
};
