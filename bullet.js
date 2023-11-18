const http = require("node:http");

class Bullet {
  constructor() {
    this.server = http.createServer();
  }

  listen(port, cb) {
    this.server.listen(port, cb);
  }
}

module.exports = Bullet;
