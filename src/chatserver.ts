const express = require("express");
import * as http from "http";
import * as WebSocket from "ws";
const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });
app.use(express.static("public"));
app.get("/", (req: any, res: any) => {
  res.send("fine");
});
wss.on("connection", () => {
  console.log("connection");
});
server.listen(1000, () => {
  console.log(`Server started on port 1000`);
});
