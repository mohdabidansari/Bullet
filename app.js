const Bullet = require("./bullet");

const app = new Bullet();

app.route("GET", "/", (req, res) => {
  res.sendHTML("<h1>Hello World</h1>");
});

app.listen(9000, () => {
  console.log("App running on port 9000");
});
