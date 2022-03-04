const express = require("express");
const cors = require("cors");
const { dbConnection } = require("../database/config");
const fileUpload = require("express-fileupload");
class Server {
  constructor() {
    this.app = express();
    this.port = process.env.PORT;

    this.paths = {
      auth: '/api/auth',
      users: '/api/users',
      category: '/api/categories',
      product: '/api/products',
      search: '/api/search',
      uploads: '/api/uploads'
    }
    this.connectDB();
    // Middleware
    this.middleware();
    // Routes
    this.routes();
  }

  async connectDB() {
    try {
      await dbConnection();
    } catch (error) {
      console.log(error);
    }
  }

  routes() {
    this.app.use(this.paths.users, require("../routes/user"));
    this.app.use(this.paths.auth, require("../routes/auth"));
    this.app.use(this.paths.category, require("../routes/categories"));
    this.app.use(this.paths.product, require("../routes/products"));
    this.app.use(this.paths.search, require("../routes/search"));
    this.app.use(this.paths.uploads, require("../routes/uploads"));
  }

  middleware() {
    this.app.use(cors());

    this.app.use(express.json());
    this.app.use(express.static("public"));
    this.app.use(fileUpload({
      useTempFiles : true,
      tempFileDir : '/tmp/',
      createParentPath: true
    }));
  }

  listen() {
    this.app.listen(this.port, () => {
      console.log(`app in http://localhost:${this.port}/`);
    });
  }
}

module.exports = Server;
