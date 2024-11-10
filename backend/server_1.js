require("dotenv").config();

const urlPkg = require("url");
const http = require("http");
const sock = require("socket.io");
const dgram = require("dgram");

// TODO: move parsing logic to another module
const {FRONTEND_URL, SERVER_UDP_HOST} = process.env;
const PORT = parseInt(process.env.SERVER_HTTP_PORT ?? "");
const UDP_PORT = parseInt(process.env.SERVER_UDP_PORT ?? "");

if (!FRONTEND_URL) {
  console.error("Frontend URL was not specified");
  process.exit(1);
}

if (!SERVER_UDP_HOST) {
  console.error("UDP host was not specified");
  process.exit(1);
}

if (typeof PORT !== "number" || isNaN(PORT)) {
  console.error("Incorrect server port format");
  process.exit(1);
}

if (typeof UDP_PORT !== "number" || isNaN(UDP_PORT)) {
  console.error("Incorrect UDP port format");
  process.exit(1);
}

let FIREBASE_TOKEN = "";

// NOTE: should I move this to another module?
const requestHandler = (req, res) => {
  const parsedUrl = urlPkg.parse(req.url, true);
  const path = parsedUrl.pathname;
  const method = req.method;

  res.setHeader("Access-Control-Allow-Origin", FRONTEND_URL);
  res.setHeader("Access-Control-Allow-Methods", "OPTIONS, GET, POST");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  res.setHeader("Content-Type", "application/json");

  if (method === "OPTIONS") {
    res.writeHead(200);
    res.end();
    return;
  }

  if (method !== "GET" && method !== "POST") {
    res.writeHead(405);
    res.end(JSON.stringify({message: "Method Not Allowed"}));

    return;
  }

  if (path !== "/") {
    res.writeHead(404);
    res.end(JSON.stringify({message: "Page Not Found"}));

    return;
  }

  if (method === "POST") {
    let body = "";

    req.on("data", (chunk) => {
      body += chunk.toString();
    });

    req.on("end", () => {
      try {
        FIREBASE_TOKEN = JSON.parse(body).token;

        res.writeHead(200);
        res.end(JSON.stringify({}));
      } catch (err) {
        console.error(`Failed to parse request body: ${err}`);

        res.writeHead(400);
        res.end(JSON.stringify({message: "Bad Request"}));
      }
    });

    return;
  }

  res.writeHead(200);
  res.end(JSON.stringify({message: "Hello World"}));
};

const udpSocket = dgram.createSocket("udp4");
const httpServer = http.createServer(requestHandler);
const io = new sock.Server(httpServer, {
  cors: {
    origin: FRONTEND_URL, methods: ["GET", "POST"]
  }
});

io.on("connection", (socket) => {
  console.log(`${socket.id} - connected`);

  socket.on("form-message", (message) => {
    message["token"] = FIREBASE_TOKEN;
    const messageBuffer = Buffer.from(JSON.stringify(message));

    udpSocket.send(messageBuffer, UDP_PORT, SERVER_UDP_HOST);
  });

  socket.on("disconnect", () => {
    console.log(`${socket.id} - disconnected`);
  });
});

httpServer.listen(PORT, () => {
  console.log(`Server #1 is running on ${PORT} port`);
});
