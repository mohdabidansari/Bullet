const Bullet = require("./bullet");

const app = new Bullet();

// app.route("GET", "/", (req, res) => {
//   res.send("Hello World");
// });

app.listen(9000, () => {
  console.log("App running on port 9000");
});
