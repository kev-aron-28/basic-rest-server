const express = require("express");
const cors = require("cors");
const { dbConnection } = require('../database/config');
class Server {
  constructor() {
    this.app = express();
    this.port = process.env.PORT;
    this.usersPath = '/api/users'
    this.connectDB()
    // Middleware
    this.middleware();
    // Routes
    this.routes();
  }


  async connectDB(){
    try {
      await dbConnection();
    } catch (error) {
      console.log(error);
    }
  }

  routes() {
    this.app.use(this.usersPath, require('../routes/user'))
  }

  middleware() {
    this.app.use(cors());
    
    this.app.use(express.json());
    this.app.use(express.static("public"));

  }

  listen() { 
    this.app.listen(this.port, () => {
      console.log(`app in http://localhost:${this.port}/`);
    });
  }
}

module.exports = Server;
