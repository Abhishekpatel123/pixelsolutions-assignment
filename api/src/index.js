import axios from "axios";
import { createServer } from "http";
import { Server } from "socket.io";
import FormData from "form-data";
import express from "express";

const PORT = 5000;

const app = express();

const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: "*",
});

const URL = "https://dev.pixelsoftwares.com/api.php";

io.on("connection", (socket) => {
  // ...
  setInterval(() => {
    const formData = new FormData();
    formData.append("symbol", "BTCUSDT");
    axios
      .post(URL, formData, {
        headers: { token: "ab4086ecd47c568d5ba5739d4078988f" },
      })
      .then((response) => socket.emit("data", response.data.data))
      .catch((err) => console.log(err, "error "));
  }, 6 * 1000);
});

httpServer.listen(PORT, () => console.log(`Listening on Port ${PORT}`));
