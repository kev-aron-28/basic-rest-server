const { response } = require("express");
const fs = require("fs");
const cloudinary = require("cloudinary").v2;
cloudinary.config(process.env.CLOUDINARY_URL);
const path = require("path");
const { uploadFile: uploadFileHelper } = require("../helpers");
const { User, Product } = require("../models");

const uploadFile = async (req, res = response) => {
  try {
    const name = await uploadFileHelper(req.files, undefined, "img");
    res.json({
      name,
    });
  } catch (error) {
    res.status(400).json({
      error,
    });
  }
};

const updateFile = async (req, res = response) => {
  const { id, collection } = req.params;
  let model;

  switch (collection) {
    case "users":
      model = await User.findById(id);
      if (!model) {
        return res.status(400).json({
          msg: "No existe el usuario",
        });
      }
      break;
    case "products":
      model = await Product.findById(id);
      if (!model) {
        return res.status(400).json({
          msg: "No existe el product",
        });
      }
      break;
    default:
      return res.status(500).json({ msg: "Internal server error" });
  }

  try {
    if (model.img) {
      const pathImage = path.join(
        __dirname,
        "../uploads",
        collection,
        model.img
      );
      if (fs.existsSync(pathImage)) {
        fs.unlinkSync(pathImage);
      }
    }
    const name = await uploadFileHelper(req.files, undefined, collection);
    model.img = name;
    await model.save();
    res.json({
      model,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      msg: "Internal server error",
    });
  }
};

const showImage = async (req, res) => {
  const { id, collection } = req.params;
  switch (collection) {
    case "users":
      model = await User.findById(id);
      if (!model) {
        return res.status(400).json({
          msg: "No existe el usuario",
        });
      }
      break;
    case "products":
      model = await Product.findById(id);
      if (!model) {
        return res.status(400).json({
          msg: "No existe el product",
        });
      }
      break;
    default:
      return res.status(500).json({ msg: "Internal server error" });
  }

  try {
    if (model.img) {
      const pathImage = path.join(
        __dirname,
        "../uploads",
        collection,
        model.img
      );
      if (fs.existsSync(pathImage)) {
        return res.sendFile(pathImage);
      }
    } else {
      const pathImage = path.join(__dirname, "../uploads", "no-image.jpg");
      return res.sendFile(pathImage);
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      msg: "Internal server error",
    });
  }
};


const updateFileCloudinary = async (req, res = response) => {
  const { id, collection } = req.params;
  let model;

  switch (collection) {
    case "users":
      model = await User.findById(id);
      if (!model) {
        return res.status(400).json({
          msg: "No existe el usuario",
        });
      }
      break;
    case "products":
      model = await Product.findById(id);
      if (!model) {
        return res.status(400).json({
          msg: "No existe el product",
        });
      }
      break;
    default:
      return res.status(500).json({ msg: "Internal server error" });
  }

  try {
    if (model.img) {
      const namer = model.img.split('/');
      const idName = namer[namer.length - 1];
      const [ publicId ] = idName.split('.');
      cloudinary.uploader.destroy(publicId);
    }
    const { tempFilePath } = req.files.file;
    
    const { secure_url } = await cloudinary.uploader.upload(tempFilePath)
    model.img = secure_url;
    await model.save(); 
    res.json({
      model,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      msg: "Internal server error",
    });
  }
};

module.exports = {
  uploadFile,
  updateFile,
  showImage,
  updateFileCloudinary
};
