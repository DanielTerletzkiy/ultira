import * as io from 'socket.io-client'

export default class SocketClient {
    static connectionString = `${window.location.protocol}//${window.location.hostname}:2343`
    static ioInstance: io.Socket

    static get instance() {
        if (!SocketClient.ioInstance) {
            SocketClient.ioInstance = io.connect(SocketClient.connectionString)
        }
        return SocketClient.ioInstance
    }
}
