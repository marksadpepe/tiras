require("dotenv").config();

const urlPkg = require("url");
const http = require("http");

const PORT = parseInt(process.env.SERVER_PORT ?? "");
if (typeof PORT !== "number" || isNaN(PORT)) {
  console.error("Incorrect server port format");
  process.exit(1);
}

const requestHandler = (req, res) => {
  const parsedUrl = urlPkg.parse(req.url, true);
  const path = parsedUrl.pathname;
  const method = req.method;

  res.setHeader("Content-Type", "application/json");

  let data = {message: "Hello World"};
  let status = 200;

  if (method !== "GET") {
    status = 405;
    data.message = "Method Not Allowed";
  } else if (path !== "/") {
    status = 404;
    data.message = "Page Not Found";
  }

  res.writeHead(status);
  res.end(JSON.stringify(data));
};

const httpServer = http.createServer(requestHandler);

httpServer.listen(PORT, () => {
  console.log(`Server is running on ${PORT} port`);
});
