import cors from "cors";
import express from "express";
import http from "http";
import { Server } from "socket.io";

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000", // Remplacez par l'URL de votre frontend
    methods: ["GET", "POST"],
  },
});

// Middleware CORS
app.use(cors());

// Plateau initial (9 cases)
let board = Array(9).fill(null); // Le plateau de jeu
let currentPlayer = "X"; // Par défaut, X commence
let gameOver = false;
let players = []; // Liste pour stocker les joueurs connectés

// Lorsqu'un joueur se connecte
io.on("connection", socket => {
  console.log("Un joueur est connecté");

  // Ajouter le joueur à la liste des joueurs connectés
  if (players.length < 2) {
    players.push(socket);
    socket.emit("init", { board, currentPlayer });

    // Si c'est le premier joueur, il commence avec X
    if (players.length === 1) {
      currentPlayer = "X"; // Le premier joueur est X
    } else {
      currentPlayer = "O"; // Le deuxième joueur est O
    }

    // Lorsqu'un joueur fait un mouvement
    socket.on("play", index => {
      // Si le jeu est terminé ou si la case est déjà prise, on ne fait rien
      if (gameOver || board[index] !== null) return;

      // Mettre à jour le plateau
      board[index] = currentPlayer;
      const winner = checkWinner(board);

      // Si un gagnant est trouvé
      if (winner) {
        io.emit("update", { board, currentPlayer });
        io.emit("gameOver", { winner });
        gameOver = true;
      } else if (!board.includes(null)) {
        // Si il n'y a plus de cases disponibles, c'est un match nul
        io.emit("update", { board, currentPlayer });
        io.emit("gameOver", { winner: "Match Nul" });
        gameOver = true;
      } else {
        // Passer au joueur suivant
        currentPlayer = currentPlayer === "X" ? "O" : "X";
        io.emit("update", { board, currentPlayer });
      }
    });

    // Lorsqu'un joueur réinitialise la partie
    socket.on("reset", () => {
      board = Array(9).fill(null);
      gameOver = false;
      currentPlayer = "X"; // Toujours commencer avec X après réinitialisation
      io.emit("init", { board, currentPlayer });
    });

    // Lorsque le joueur se déconnecte
    socket.on("disconnect", () => {
      console.log("Un joueur s'est déconnecté");
      players = players.filter(player => player !== socket); // Retirer le joueur de la liste
      if (players.length === 0) {
        // Réinitialiser le jeu si les deux joueurs se déconnectent
        board = Array(9).fill(null);
        gameOver = false;
        currentPlayer = "X"; // X recommence si tous les joueurs se déconnectent
        io.emit("init", { board, currentPlayer });
      }
    });
  } else {
    // Refuser la connexion si deux joueurs sont déjà connectés
    socket.emit("error", "La partie est complète.");
    socket.disconnect();
  }
});

// Fonction pour vérifier si un joueur a gagné
function checkWinner(board) {
  const winningCombinations = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];

  for (let combo of winningCombinations) {
    const [a, b, c] = combo;
    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      return board[a]; // Renvoie X ou O
    }
  }
  return null; // Si pas de gagnant, retourne null
}

// Démarrer le serveur sur le port 3001
server.listen(3001, () => {
  console.log("Le serveur écoute sur le port 3001");
});
    