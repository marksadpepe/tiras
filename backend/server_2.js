require("dotenv").config();

const dgram = require("dgram");

const {SERVER_UDP_PORT, SERVER_UDP_HOST} = process.env;
const port = parseInt(SERVER_UDP_PORT ?? "");

if (!SERVER_UDP_HOST) {
  console.error("UDP host was not specified");
  process.exit(1);
}

if (typeof port !== "number" || isNaN(port)) {
  console.error("Incorrect UDP port format");
  process.exit(1)
}

const socket = dgram.createSocket("udp4");

socket.on("message", (buf) => {
  const {title, body} = JSON.parse(buf.toString());
});

socket.bind(port, SERVER_UDP_HOST, () => {
  console.log(`Server #2 is running on ${port} port`);
});
