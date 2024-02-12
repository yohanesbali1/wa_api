// Package yang di gunakan
// express api
const { Client, LocalAuth } = require("whatsapp-web.js");
const qrcode = require("qrcode");
const port = 4000;

const express = require("express");
const app = express();
const http = require("http");
const server = http.createServer(app);
const io = require("socket.io")(port, {
  cors: {
    origin: "*",
  },
});
// const io = new Server(server, {
//   cors: {
//     origin: "*",
//   },
// });

const client = new Client({
  authStrategy: new LocalAuth({
    dataPath: "test",
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

function conectWA(socket) {
  client.on("qr", async (qr) => {
    let data_qr = await qrcode.toDataURL(qr);
    console.log("test");
    socket.emit("qr-message", data_qr);
  });

  //Proses Dimana Whatsapp-web.js Siap digunakan
  client.on("ready", () => {
    console.log("Ready !");
    // app.use(express.json());
    // app.use(express.urlencoded({ extended: true }));
    // app.post("/api/send", (req, res) => {
    //   // res.send('Hello World, from express');
    //   const phone = req.body.phone;
    //   const message = req.body.message;
    //   client
    //     .sendMessage(phone.substring(1) + "@c.us", message)
    //     .then((response) => {
    //       res.status(200).json({
    //         error: false,
    //         data: {
    //           message: "success",
    //           meta: response,
    //         },
    //       });
    //     })
    //     .catch((error) => {
    //       res.status(200).json({
    //         error: true,
    //         data: {
    //           message: "error",
    //           meta: error,
    //         },
    //       });
    //     });
    // });
    // app.listen(port, () =>
    //   console.log(`Hello world app listening on port ${port}!`)
    // );
  });
  client.on("disconnected", (reason) => {
    console.log("disconnect Whatsapp-bot", reason);
  });
  client.initialize();
}

io.on("connection", (socket) => {
  console.log("a user connected");
  socket.on("qr", () => {
    conectWA(socket);
  });
});

// server.listen(3000, () => {
//   console.log("server running at http://localhost:3000");
// });

// BOT Autorespon
// define var
// var currentChatLocation;
// // Proses Dimana Ketika Pesan masuk ke bot
// client.on('message', async message => {
//     //Mengecek Pesan yang masuk sama dengan Menu jika benar balas dengan Haii!!
//     if (message.body.toLowerCase() === 'menu') {
//         // Membalas Pesan
//         currentChatLocation = 'menu';
//         message.reply('=== MENU UTAMA ===\n\nUntuk memilih menu, ketik angka yang tersedia dalam pilihan menu !\n1. Apa itu *Intprism* dan *Computing ID* ?\n2. Layanan apa saja yang disediakan?')
//     }
//     if (currentChatLocation == 'menu') {
//         if (message.body.toLocaleLowerCase() === '1'){
//             message.reply('*PT Intprism Computing Technology* memiliki beberapa brand yakni: *Intprism* dan *Computing ID*\n\n *Intprism* fokus memberikan layanan sistem informasi kepada kamu untuk membuat aplikasi berbasis web maupun mobile termasuk android dan IOS.\n\n*Computing ID* fokus memberikan layanan insfratruktur kepada kamu yang membutuhkan layanan terkait server dan sejenisnya antara lain: Hosting, Domain, Cloud Server, Colocation Server, Internet of Things dan Interconnection.\n\n\nPosisi kamu sekarang ada di: '+currentChatLocation+' ketik *Menu* untuk kembali ke menu utama');
//         }
//         if (message.body.toLocaleLowerCase() === '2'){
//             message.reply('Layanan yang kami berikan yakni:\n\n*Intprism*\n- Sistem informasi custom\n- Aplikasi berbasis\n- Aplikasi mobile android\n- Aplikasi mobile IOS.\n\n*Computing ID* \n- Hosting cPanel\n- Domain\n- Cloud Server\n- Colocation Server\n- Internet of Things\n- Interconnection.\n\n\nPosisi kamu sekarang ada di: '+currentChatLocation+' ketik *Menu* untuk kembali ke menu utama');
//         }

//     }
// })

//Proses Dimana klient disconnect dari Whatsapp-web
