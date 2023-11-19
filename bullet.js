const http = require("node:http");

class Bullet {
  constructor() {
    this.server = http.createServer();
    this.registeredRoutes = {};

    this.server.on("request", (request, response) => {
      response.sendHTML = function (html) {
        response.setHeader("Content-Type", "text/html");
        response.end(html);
      };

      response.status = function (code) {
        response.statusCode = code;
        return response;
      };

      const handler = this.registeredRoutes[request.method + request.url];
      if (!handler) {
        return response.end(`Cannot ${request.method} ${request.url}`);
      }
      handler(request, response);
    });
  }

  listen(port, cb) {
    this.server.listen(port, cb);
  }

  route(method, url, cb) {
    this.registeredRoutes[method.toUpperCase() + url] = cb;
  }
}

module.exports = Bullet;
