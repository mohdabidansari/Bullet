const http = require("node:http");
const fs = require("node:fs/promises");
const mime = require("./mime");

class Bullet {
  constructor() {
    this.server = http.createServer();
    this.registeredRoutes = {};

    this.server.on("request", async (request, response) => {
      response.sendHTML = function (html) {
        response.setHeader("Content-Type", "text/html");
        response.end(html);
      };

      response.sendFile = async function (filePath, mimeType) {
        const fileHandle = await fs.open(filePath, "r");
        const fileStream = fileHandle.createReadStream();
        response.setHeader("Content-Type", mimeType);
        fileStream.pipe(response);
      };

      response.json = function (body) {
        response.setHeader("Content-Type", "application/json");
        response.end(JSON.stringify(body));
      };

      response.status = function (code) {
        response.statusCode = code;
        return response;
      };

      const handler = this.registeredRoutes[request.method + request.url];
      if (!handler) {
        try {
          const m = request.url.substring(request.url.lastIndexOf(".") + 1);
          // console.log(m);
          // console.log(mime[m]);
          if (!m || !mime[m]) {
            throw new Error("Not a file");
          }
          return response.sendFile(`./public/${request.url}`, mime[m]);
        } catch (error) {
          return response
            .status(400)
            .end(`Cannot ${request.method} ${request.url}`);
        }
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
