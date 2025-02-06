const PORT = 8000;
const express = require("express");
const app = express();
app.use(express.json());
const fs = require("fs");
const liveReload = require("livereload");
const connectLiveReload = require("connect-livereload");

const liveReloadServer = liveReload.createServer();
liveReloadServer.watch("./app/");
liveReloadServer.watch("./public/");
app.use(connectLiveReload());

app.use("/js", express.static("./public/scripts"));
app.use("/css", express.static("./public/css"));
app.use("/assets", express.static("./public/assets"));
app.use("/html", express.static("./app/html"));
app.use("/data", express.static("./app/data"));

app.get("/", function (request, response) {
  response.send(fs.readFileSync("./app/html/index.html", "utf8"));
});

app.get("/reservations", (request, response) => {
  const reservations = fs.readFileSync("./app/data/reservations.json", "utf8");

  console.log("sending reservations");
  response.send(reservations);
});

app.post("/reservations", (request, response) => {
  try {
    const reservationsFile = fs.readFileSync("./app/data/reservations.json", "utf8");
    const reservations = JSON.parse(reservationsFile);
    const { name, email, date, time, table } = request.body;

    //if table has not been reserved at all, create entry for it
    reservations[table][date] ||= [];
    reservations[table][date].push(parseInt(time));

    fs.writeFileSync("./app/data/reservations.json", JSON.stringify(reservations), "utf8");
    console.log("Updated reservations");
    response.send("Updated reservation");
  } catch (error) {
    console.log(error.name, error);
    response.send(`Server side ${error.name}`, error);
  }
});

// for resoure not found (404)
app.use(function (request, response, next) {
  response.status(404).send(fs.readFileSync("./app/html/404.html", "utf8"));
});

app.listen(PORT, function () {
  console.log(`The Prime Cut is listening on ${PORT}!`);
});
