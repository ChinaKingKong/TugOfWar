import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import sqlite3 from 'sqlite3';

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: 'http://localhost:5173',
    methods: ['GET', 'POST'],
  },
});

const db = new sqlite3.Database('./tugofwar.db');

db.serialize(() => {
  db.run(`CREATE TABLE IF NOT EXISTS games (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT,
    result TEXT,
    difference REAL,
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
  )`);
});

let gameState = {
  status: 'waiting',
  ropePosition: 50,
  leftTeam: [],
  rightTeam: [],
  countdown: null,
  winner: null,
};

const GAME_DURATION = 30000; // 30 seconds
const COUNTDOWN_DURATION = 5000; // 5 seconds
let gameInterval;
let countdownInterval;

function resetGame() {
  gameState = {
    status: 'waiting',
    ropePosition: 50,
    leftTeam: [],
    rightTeam: [],
    countdown: null,
    winner: null,
  };
  clearInterval(gameInterval);
  clearInterval(countdownInterval);
}

function startCountdown() {
  gameState.status = 'countdown';
  gameState.countdown = 5;
  io.emit('gameState', gameState);

  countdownInterval = setInterval(() => {
    gameState.countdown--;
    if (gameState.countdown <= 0) {
      clearInterval(countdownInterval);
      startGame();
    } else {
      io.emit('gameState', gameState);
    }
  }, 1000);
}

function startGame() {
  gameState.status = 'playing';
  gameState.countdown = null;
  io.emit('gameState', gameState);

  const startTime = Date.now();
  gameInterval = setInterval(() => {
    const elapsedTime = Date.now() - startTime;
    if (elapsedTime >= GAME_DURATION) {
      endGame();
    } else {
      io.emit('gameState', gameState);
    }
  }, 100);
}

function endGame() {
  gameState.status = 'finished';
  clearInterval(gameInterval);

  if (gameState.ropePosition < 50) {
    gameState.winner = 'left';
  } else if (gameState.ropePosition > 50) {
    gameState.winner = 'right';
  } else {
    gameState.winner = 'tie';
  }

  const difference = Math.abs(gameState.ropePosition - 50);

  // Save game results to the database
  gameState.leftTeam.forEach((username) => {
    const result = gameState.winner === 'left' ? 'win' : 'loss';
    db.run(
      'INSERT INTO games (username, result, difference) VALUES (?, ?, ?)',
      [username, result, difference]
    );
  });

  gameState.rightTeam.forEach((username) => {
    const result = gameState.winner === 'right' ? 'win' : 'loss';
    db.run(
      'INSERT INTO games (username, result, difference) VALUES (?, ?, ?)',
      [username, result, difference]
    );
  });

  io.emit('gameState', gameState);

  setTimeout(resetGame, 5000);
}

io.on('connection', (socket) => {
  socket.on('login', (username) => {
    socket.username = username;
  });

  socket.on('joinTeam', (team) => {
    if (team === 'left') {
      gameState.leftTeam.push(socket.username);
    } else if (team === 'right') {
      gameState.rightTeam.push(socket.username);
    }

    if (gameState.leftTeam.length >= 1 && gameState.rightTeam.length >= 1 && gameState.status === 'waiting') {
      startCountdown();
    }

    io.emit('gameState', gameState);
  });

  socket.on('pull', (team) => {
    if (gameState.status === 'playing') {
      const pullStrength = 0.5;
      if (team === 'left') {
        gameState.ropePosition = Math.max(0, gameState.ropePosition - pullStrength);
      } else if (team === 'right') {
        gameState.ropePosition = Math.min(100, gameState.ropePosition + pullStrength);
      }

      if (gameState.ropePosition <= 0 || gameState.ropePosition >= 100) {
        endGame();
      }
    }
  });

  socket.on('disconnect', () => {
    gameState.leftTeam = gameState.leftTeam.filter((username) => username !== socket.username);
    gameState.rightTeam = gameState.rightTeam.filter((username) => username !== socket.username);
    io.emit('gameState', gameState);
  });
});

app.get('/history/:username', (req, res) => {
  const { username } = req.params;
  db.all(
    'SELECT * FROM games WHERE username = ? ORDER BY timestamp DESC LIMIT 10',
    [username],
    (err, rows) => {
      if (err) {
        res.status(500).json({ error: 'Error fetching game history' });
      } else {
        res.json(rows);
      }
    }
  );
});

const PORT = 3001;
httpServer.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});