// See https://github.com/typicode/json-server#module
const jsonServer = require("json-server");
const express = require("express");
const app = express();
const port = process.env.PORT || 3000;

const server = jsonServer.create();

const path = require("path");

// Comment out the write operations
// const fs = require('fs')
// const path = require('path')
// const filePath = path.join('db.json')
// const data = fs.readFileSync(filePath, "utf-8");
// const db = JSON.parse(data);
// const router = jsonServer.router(db)

// Ensure the router only reads from db.json
// const router = jsonServer.router("db.json");

// Use an in-memory database instead of db.json
const data = require("../db.json");
const router = jsonServer.router(data);

const middlewares = jsonServer.defaults();

// Add readonly middleware to prevent write operations
middlewares.push((req, res, next) => {
  if (
    req.method === "POST" ||
    req.method === "PUT" ||
    req.method === "PATCH" ||
    req.method === "DELETE"
  ) {
    res.sendStatus(403);
  } else {
    next();
  }
});

server.use(middlewares);

// Serve static files from the /public directory
server.use("/public", express.static(path.join(__dirname, "../public")));

// Add this before server.use(router)
server.use(
  jsonServer.rewriter({
    "/api/*": "/$1",
  })
);
server.use(router);
server.listen(3000, () => {
  console.log("JSON Server is running");
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Something broke!");
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

// Export the Server API
module.exports = server;
