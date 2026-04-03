import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: { origin: '*' },
});

// rooms: { [code]: { p1SocketId, p2SocketId, p1Moves, p2Moves } }
const rooms = {};

const ROOM_TTL_MS = 10 * 60 * 1000; // 10 minutes

function generateCode() {
  return String(Math.floor(1000 + Math.random() * 9000));
}

function cleanupRoom(code) {
  delete rooms[code];
}

io.on('connection', (socket) => {
  console.log('connected:', socket.id);

  // Host creates a room
  socket.on('create-room', (callback) => {
    let code;
    do { code = generateCode(); } while (rooms[code]);

    rooms[code] = { p1SocketId: socket.id, p2SocketId: null, p1Moves: null, p2Moves: null };
    socket.join(code);
    socket.data.code = code;
    socket.data.player = 'p1';

    // Auto-cleanup after TTL
    setTimeout(() => cleanupRoom(code), ROOM_TTL_MS);

    console.log(`Room ${code} created by ${socket.id}`);
    callback({ code });
  });

  // Guest joins a room
  socket.on('join-room', (code, callback) => {
    const room = rooms[code];

    if (!room) return callback({ error: 'Room not found.' });
    if (room.p2SocketId) return callback({ error: 'Room is full.' });

    room.p2SocketId = socket.id;
    socket.join(code);
    socket.data.code = code;
    socket.data.player = 'p2';

    // Notify P1 that opponent joined
    io.to(room.p1SocketId).emit('opponent-joined');

    console.log(`Room ${code}: P2 joined (${socket.id})`);
    callback({ ok: true });
  });

  // A player submits their moves
  socket.on('submit-moves', (moves) => {
    const code = socket.data.code;
    const player = socket.data.player;
    const room = rooms[code];

    if (!room || !Array.isArray(moves) || moves.length !== 5) return;

    room[`${player}Moves`] = moves;
    console.log(`Room ${code}: ${player} submitted moves`);

    // Both submitted — start the fight
    if (room.p1Moves && room.p2Moves) {
      io.to(code).emit('start-fight', {
        p1Moves: room.p1Moves,
        p2Moves: room.p2Moves,
      });
      console.log(`Room ${code}: fight started`);
    }
  });

  // Clean up on disconnect
  socket.on('disconnect', () => {
    const code = socket.data.code;
    if (!code || !rooms[code]) return;

    // Notify the other player
    socket.to(code).emit('opponent-disconnected');
    cleanupRoom(code);
    console.log(`Room ${code} closed (${socket.id} disconnected)`);
  });
});

const PORT = process.env.PORT || 3000;
httpServer.listen(PORT, () => console.log(`Server running on port ${PORT}`));
