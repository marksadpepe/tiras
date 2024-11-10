const {join} = require("path");

const envPath = join(__dirname, "..", ".env");

require("dotenv").config({path: envPath});

const {
  SERVER_UDP_PORT,
  SERVER_UDP_HOST,
  SERVER_HTTP_PORT,
  FRONTEND_URL
} = process.env;

if (!FRONTEND_URL) {
  console.error("Frontend URL was not specified");
  process.exit(1);
}

if (!SERVER_UDP_HOST) {
  console.error("UDP host was not specified");
  process.exit(1);
}

const parsedUdpPort = parseInt(SERVER_UDP_PORT ?? "");
const parsedHttpPort = parseInt(SERVER_HTTP_PORT ?? "");

if (typeof parsedUdpPort !== "number" || isNaN(parsedUdpPort)) {
  console.error("Incorrect UDP port format");
  process.exit(1);
}

if (typeof parsedHttpPort !== "number" || isNaN(parsedHttpPort)) {
  console.error("Incorrect HTTP port format");
  process.exit(1);
}

module.exports = {
  FRONTEND_URL,
  SERVER_UDP_HOST,
  UDP_PORT: parsedUdpPort,
  HTTP_PORT: parsedHttpPort,
};
