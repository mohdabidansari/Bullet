const Bullet = require("./bullet");

const app = new Bullet();

app.route("GET", "/", (req, res) => {
  res.sendHTML("<h1>Hello World</h1>");
});

app.route("GET", "/json", (req, res) => {
  // res.json({ name: "App" });
  res.json(null);
});

app.route("GET", "/image", (req, res) => {
  res.sendFile("./public/img.png", "image/png");
});

app.route("GET", "/app", (req, res) => {
  res.sendFile("./public/index.html", "text/html");
});

app.listen(9000, () => {
  console.log("App running on port 9000");
});
