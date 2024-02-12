// Package yang di gunakan
// express api
const { Client, LocalAuth } = require("whatsapp-web.js");
const qrcode = require("qrcode");
const express = require("express");
var port = process.env.PORT || 3000;
var app = express();
var server = app.listen(port, function () {
  console.log("server listening at", server.address());
});
var io = require("socket.io")(server, {
  cors: {
    origin: "*",
  },
});


function conectWA(socket, folder, id) {

  const client = new Client({
    authStrategy: new LocalAuth({
      dataPath: folder,
      clientId: id
    }),
    puppeteer: {
      headless: true,
      args: [
        "--no-sandbox",
        "--disable-setuid-sandbox",
        "--disable-dev-shm-usage",
        "--disable-accelerated-2d-canvas",
        "--no-first-run",
        "--no-zygote",
        "--disable-gpu",
      ],
    },
  });

  client.on("qr", async (qr) => {
    let data_qr = await qrcode.toDataURL(qr);
    console.log("qr-send " + port);
    socket.emit("qr-message", data_qr);
  });

  //Proses Dimana Whatsapp-web.js Siap digunakan
  client.on("ready", () => {
    console.log("Ready !" + port);
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));
    app.post("/api/send", (req, res) => {
      const phone = req.body.phone;
      const message = req.body.message;
      client
        .sendMessage(phone.substring(1) + "@c.us", message)
        .then((response) => {
          res.status(200).json({
            error: false,
            data: {
              message: "success",
              meta: response,
            },
          });
        })
        .catch((error) => {
          res.status(200).json({
            error: true,
            data: {
              message: "error",
              meta: error,
            },
          });
        });
    });
  });
  client.on("disconnected", (reason) => {
    console.log("disconnect Whatsapp-bot", reason);
  });
  client.initialize();
}

io.on("connection", (socket) => {
  console.log("connected-socket" + port);
  socket.on("qr", (folder, id) => {
    conectWA(socket, folder, id);
  });
});
