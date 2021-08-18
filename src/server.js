import express from "express";
import http from "http";
import WebSocket from "ws";

const app = express();

app.set("views", __dirname + "/views");
app.set("view engine", "pug");
app.use("/public", express.static(__dirname + "/public"));
app.get("/", (req, res) => res.render("home"));
app.get("/*", (req, res) => res.redirect("/"));

const handleListen = () => console.log("start!");

//Handle http and wss together
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

const sockets = [];

wss.on("connection", (backSocket) => {
    sockets.push(backSocket);
    backSocket["nickname"] = "Anonymous";
    console.log("Connected to browser BOOM");
    backSocket.on("close", ()=> console.log("Disconnected"));
    backSocket.on("message", (msg) => {
        const message = JSON.parse(msg);
        switch (message.type){
            case "new_message":
                sockets.forEach((aSocket) => {
                    aSocket.send(`${backSocket.nickname}: ${message.payload}`)
                });
                break;
            case "nickname":
                backSocket["nickname"] = message.payload;
                break;
        }
    });
});

//access to http server so I can create wss on top of the http server
server.listen(3000, handleListen);