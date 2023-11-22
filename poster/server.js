const Bullet = require("../bullet");
const { bodyParser, auth } = require("../middleware");
const { POSTS, USERS, SESSIONS } = require("./data");
const app = new Bullet();

const routesToAuth = [
  "GET /api/user",
  "PUT /api/user",
  "POST /api/posts",
  "DELETE /api/logout",
];

app.beforeEach(auth(routesToAuth));

app.beforeEach(bodyParser);

app.beforeEach((req, res, next) => {
  const routes = ["/", "/login", "/profile", "/new-post"];
  if (req.method === "GET" && routes.indexOf(req.url) !== -1) {
    return res.sendFile("./public/index.html", "text/html");
  }
  next();
});

app.route("GET", "/api/posts", (req, res) => {
  const posts = POSTS.map((post) => {
    const user = USERS.find((user) => user.id === post.userId);
    post.author = user.name;
    return post;
  });
  res.json(posts);
});

app.route("POST", "/api/login", (req, res) => {
  const { username, password } = req.body;
  console.log({ username, password });

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

app.route("GET", "/api/user", (req, res) => {
  console.log(req.user);
  res.json(req.user);
});

app.route("DELETE", "/api/logout", (req, res) => {});

app.route("PUT", "/api/user", (req, res) => {});

app.route("POST", "/api/posts", (req, res) => {});

const PORT = 9000;
app.listen(PORT, () => {
  console.log(`App running on port ${PORT}`);
});
