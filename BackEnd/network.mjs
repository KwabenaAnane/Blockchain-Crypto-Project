import { WebSocket, WebSocketServer } from 'ws';
import { SOCKET_PORT } from './utilities/config.mjs';
import {MEMBER_NODES} from './utilities/config.mjs';

// const SOCKET_PORT = process.env.SOCKET_PORT || 3001;
const NODES = process.env.MEMBER_NODES
  ? process.env.MEMBER_NODES.split(',')
  : [];

export default class Network {
  constructor({ blockchain, transactionPool, wallet }) {
    this.blockchain = blockchain;
    this.transactionPool = transactionPool;
    this.wallet = wallet;
    this.nodes = [];
  }

  listen() {
    const server = new WebSocketServer({ port: SOCKET_PORT });

    server.on('connection', (socket) => {
      this.connectNode(socket);
    });

    this.connectToOtherNodes();

    console.log(`WebSocket listening on port ${SOCKET_PORT}`);
  }

  connectToOtherNodes() {
    NODES.forEach((node) => {
      const socket = new WebSocket(node);
      socket.on('open', () => {
        this.connectNode(socket);
      });
    });
  }

  connectNode(socket) {
    this.nodes.push(socket);
    console.log('New node connected');

    this.messageHandler(socket);

    // Sync chain on connection
    const message = {
      type: 'CHAIN',
      data: this.blockchain.chain,
    };
    socket.send(JSON.stringify(message));
  }

  messageHandler(socket) {
    socket.on('message', (message) => {
      const parsed = JSON.parse(message);
      const { type, data } = parsed;

      console.log(`Message received: ${type}`, data);

      switch (type) {
        case 'CHAIN':
          this.blockchain.replaceChain(data, () => {
            this.transactionPool.clearBlockTransactions({ chain: data });
          });
          break;

        case 'TRANSACTION':
          if (
            !this.transactionPool.transactionExists({
              address: this.wallet.publicKey,
            })
          ) {
            this.transactionPool.addTransaction(data);
          }
          break;

        default:
          console.warn(`Unknown message type: ${type}`);
      }
    });
  }

  broadcastChain() {
    const message = JSON.stringify({
      type: 'CHAIN',
      data: this.blockchain.chain,
    });

    this.broadcast(message);
  }

  broadcastTransaction(transaction) {
    const message = JSON.stringify({
      type: 'TRANSACTION',
      data: transaction,
    });

    this.broadcast(message);
  }

  broadcast(message) {
    this.nodes.forEach((socket) => {
      if (socket.readyState === WebSocket.OPEN) {
        socket.send(message);
      }
    });
  }
}
