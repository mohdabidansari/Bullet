const Bullet = require("../bullet");
const { POSTS, USERS, SESSIONS } = require("./data");
const app = new Bullet();

app.beforeEach((req, res, next) => {
  console.log("FIRST MIDDLEWARE");
  next();
});

app.beforeEach((req, res, next) => {
  setTimeout(() => {
    console.log("SECOND MIDDLEWARE");
    next();
  }, 2000);
});

app.beforeEach((req, res, next) => {
  console.log("THIRD MIDDLEWARE");
  next();
});

// -------------------- FILES ROUTES ------------------------
app.route("GET", "/", (req, res) => {
  res.sendFile("./public/index.html", "text/html");
});
app.route("GET", "/login", (req, res) => {
  res.sendFile("./public/index.html", "text/html");
});
app.route("GET", "/profile", (req, res) => {
  res.sendFile("./public/index.html", "text/html");
});

// -------------------- JSON ROUTES ------------------------
app.route("GET", "/api/posts", (req, res) => {
  const posts = POSTS.map((post) => {
    const user = USERS.find((user) => user.id === post.userId);
    post.author = user.name;
    return post;
  });
  res.json(posts);
});

app.route("POST", "/api/login", (req, res) => {
  let body = "";
  req.on("data", (chunk) => {
    body += chunk.toString("utf-8");
  });

  req.on("end", () => {
    body = JSON.parse(body);
    const { username, password } = body;

    if (!username || !password) {
      return res.status(400).json({
        error: "Username and password is required",
      });
    }

    const user = USERS.find(
      (u) => u.username === username && u.password === password
    );

    if (user) {
      const token = Math.floor(Math.random() * 1000000000).toString();

      SESSIONS.push({
        userId: user.id,
        token,
      });

      res.setHeader("Set-Cookie", `token=${token}; path=/`);

      res.status(200).json({ message: "User logged in sucessfully!" });
    } else {
      res.status(401).json({ error: "Username and password is required" });
    }
  });
});

app.route("GET", "/api/user", (req, res) => {
  const token = req.headers.cookie?.split("=")[1];

  if (!token) {
    res.status(401).json({ message: "Please login" });
  }

  const session = SESSIONS.find((session) => session.token === token);

  if (session) {
    const user = USERS.find((user) => user.id === session.userId);
    res.json(user);
  } else {
    res.status(401).json({ message: "Please login" });
  }
});

app.route("DELETE", "/api/logout", (req, res) => {});

app.route("PUT", "/api/user", (req, res) => {});

app.route("POST", "/api/posts", (req, res) => {});

const PORT = 9000;
app.listen(PORT, () => {
  console.log(`App running on port ${PORT}`);
});
