const exp = require("express");
const app = exp();
const { db } = require("./db");
const apiRouter = require("./routes/api").route;
const dotenv = require("dotenv");
dotenv.config();
const path = require("path");

app.use(exp.json());
app.use(exp.urlencoded({  extended: true }));
app.use(exp.static(path.join(__dirname, "build")));

// routes
app.use("/api", apiRouter);

// app.get("/*", function (req, res) {
//   res.sendFile(path.join(__dirname, "build", "index.html"));
// });

db.sync().then(() => {
  app.listen(process.env.port || 8080, () => {
    console.log("server-started");
  });
});