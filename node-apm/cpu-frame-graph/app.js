"use strict";

const restify = require("restify");
const server = restify.createServer();

function a() {
    for (let i = 0; i < 1e8; i++) { }
}
function b() {
    for (let i = 0; i < 2e8; i++) { }
}
server.get("/", function handle(req, res, next) {
    a();
    b();
    res.send({});
    next();
});

server.listen(3000, () => {
    console.log("listen at: http://127.0.0.1:3000/");
});

process.on("SIGINT", function () {
    console.error("Caught SIGINT, shutting down.");
    server.close();
});