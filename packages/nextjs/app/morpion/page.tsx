"use client";

// pages/index.js
import { useEffect, useState } from "react";
import { io } from "socket.io-client";

export default function Home() {
  const [socket, setSocket] = useState(null);
  const [board, setBoard] = useState(Array(9).fill(null));
  const [currentPlayer, setCurrentPlayer] = useState("X");
  const [gameOver, setGameOver] = useState(false);
  const [winner, setWinner] = useState(null);
  const [waitingForPlayer, setWaitingForPlayer] = useState("X"); // 'X' commence
  const [errorMessage, setErrorMessage] = useState(""); // Pour gérer les erreurs (ex: trop de joueurs)

  useEffect(() => {
    const socket = io("http://localhost:3001"); // Connexion au serveur Socket.io
    setSocket(socket);

    socket.on("init", data => {
      setBoard(data.board);
      setCurrentPlayer(data.currentPlayer);
      setWaitingForPlayer(data.currentPlayer); // Mise à jour du joueur attendu
    });

    socket.on("update", data => {
      setBoard(data.board);
      setCurrentPlayer(data.currentPlayer);
      setWaitingForPlayer(data.currentPlayer); // Mise à jour du joueur attendu
    });

    socket.on("gameOver", data => {
      setWinner(data.winner);
      setGameOver(true);
    });

    socket.on("error", message => {
      setErrorMessage(message); // Gérer les erreurs, par exemple, si trop de joueurs sont connectés
    });

    return () => {
      socket.disconnect(); // Déconnexion lors du démontage du composant
    };
  }, []);

  const handleClick = index => {
    // Empêche un joueur de jouer si ce n'est pas son tour ou si le jeu est terminé
    if (board[index] !== null || gameOver || waitingForPlayer !== currentPlayer) return;
    socket.emit("play", index);
  };

  const handleReset = () => {
    socket.emit("reset");
    setGameOver(false);
    setWinner(null);
    setErrorMessage(""); // Réinitialiser le message d'erreur en cas de réinitialisation
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-base-200">
      <h1 className="text-4xl font-bold mb-4">Jeu de Morpion (Tic-Tac-Toe)</h1>

      {errorMessage && (
        <div className="text-red-500 mb-4">{errorMessage}</div> // Affichage de l'erreur si un message est présent
      )}

      <div className="grid grid-cols-3 gap-2 mb-4">
        {board.map((value, index) => (
          <div
            key={index}
            className={`w-24 h-24 flex items-center justify-center text-4xl font-bold border-2 border-gray-200 cursor-pointer bg-blue-950 transition-all ${value === "X" ? "bg-green-600" : value === "O" ? "bg-orange-600" : "hover:bg-gray-200"}`}
            onClick={() => handleClick(index)}
          ></div>
        ))}
      </div>

      <h2 className="text-2xl">
        {gameOver
          ? winner === "Match Nul"
            ? "Match Nul !"
            : `Le joueur ${winner} a gagné !`
          : `Tour du joueur : ${currentPlayer === "X" ? "Vert" : "Orange"}`}
      </h2>

      <button onClick={handleReset} className="mt-4 px-6 py-2 bg-blue-500 text-white rounded-full hover:bg-blue-700">
        Réinitialiser le jeu
      </button>
    </div>
  );
}