"use strict";
const chalk = require("chalk");
const { Server } = require("socket.io");
module.exports = class SocketIO {
    static socketIO;
    static createInstance(server) {
        this.socketIO = new Server(server, {
            cors: {
                origin: (origin, callback) => {
                    return callback(null, true);
                },
                methods: ["GET", "POST"],
                transports: ["websocket", "polling"],
                credentials: true,
            },
            allowEIO3: true,
        });
        console.log(`${chalk.bgRedBright.black("IO")}: ${chalk.green.bold("Created Instance")}`);
        this.socketIO.on("connection", () => {
            console.log(`${chalk.bgRedBright.black("IO")}: ${chalk.blue("User Connected")}`);
        });
    }
    static get instance() {
        return SocketIO.socketIO;
    }
};
