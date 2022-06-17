import * as io from 'socket.io-client';
export default class SocketClient {
    static connectionString = `http://localhost:2343`;
    static ioInstance;
    static get instance() {
        if (!SocketClient.ioInstance) {
            SocketClient.ioInstance = io.connect(SocketClient.connectionString);
        }
        return SocketClient.ioInstance;
    }
}
//# sourceMappingURL=SocketIOClient.js.map