const { SESSIONS, USERS } = require("./poster/data");

exports.bodyParser = (req, res, next) => {
  if (req.headers["content-type"] === "application/json") {
    let body = "";
    req.on("data", (chunk) => {
      body += chunk.toString("utf-8");
    });

    req.on("end", () => {
      body = JSON.parse(body);
      req.body = body;
      next();
    });
  } else {
    next();
  }
};

exports.auth = (routesToAuth) => {
  return (req, res, next) => {
    // console.log(`${req.method} ${req.url}`);
    // console.log(routesToAuth.indexOf(`${req.method} ${req.url}`));

    if (routesToAuth.indexOf(`${req.method} ${req.url}`) !== -1) {
      if (req.headers.cookie) {
        const token = req.headers.cookie.split("=")[1];

        if (!token) {
          res.status(401).json({ message: "Please login" });
        }

        const session = SESSIONS.find((session) => session.token === token);

        if (session) {
          const user = USERS.find((user) => user.id === session.userId);
          //   console.log({ user });
          req.user = user;
          next();
        } else {
          res.status(401).json({ message: "Please login" });
        }
      } else {
        res.status(401).json({ message: "Please login" });
      }
    } else {
      next();
    }
  };
};
