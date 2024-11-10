require("dotenv").config();

const dgram = require("dgram");
const admin = require("firebase-admin");
const serviceAccount = require("./serviceAccountKey.json");

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

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});
const socket = dgram.createSocket("udp4");

socket.on("message", async (buf) => {
  const data = JSON.parse(buf.toString());
  const message = {
    token: data.token,
    notification: {title: data.title, body: data.body},
  }

  try {
    const response = await admin.messaging().send(message);
    console.log(`FCM message sent: ${response}`);
  } catch (err) {
    console.error(`Failed to send FCM: ${err}`);
  }

});

socket.bind(port, SERVER_UDP_HOST, () => {
  console.log(`Server #2 is running on ${port} port`);
});
