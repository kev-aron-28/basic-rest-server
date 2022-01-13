const express = require("express");
const cors = require("cors");

class Server {
  constructor() {
    this.app = express();
    this.port = process.env.PORT;
    this.usersPath = '/api/users'
    // Middleware
    this.middleware();

    // Routes
    this.routes();
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
