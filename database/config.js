const mongoose = require("mongoose");

const dbConnection = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_ATLAS, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    });
    console.log('Base de datos online');
  } catch (error) {
    throw new Error("Error al iniciar la base de datos", error);
  }
};

module.exports = {
  dbConnection,
};
