// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

// Importation nécessaire uniquement si vous n’avez pas encore déployé le contrat
import "./Token.sol";

contract MorpionGame {
    Token public token; // Référence au contrat Token

    struct Game {
        address player1;
        address player2;
        uint256 betAmount;
        address winner;
        bool isActive;
    }

    mapping(uint256 => Game) public games;
    uint256 public gameCounter;

    event GameCreated(uint256 gameId, address player1, uint256 betAmount);
    event GameJoined(uint256 gameId, address player2);
    event GameFinished(uint256 gameId, address winner);

    constructor(address tokenAddress) {
        token = Token(tokenAddress);
    }

    // Création d'une nouvelle partie
    function createGame(uint256 betAmount) external {
        require(betAmount > 0, "Bet amount must be greater than zero");
        require(token.transferFrom(msg.sender, address(this), betAmount), "Token transfer failed");

        gameCounter++;
        games[gameCounter] = Game({
            player1: msg.sender,
            player2: address(0),
            betAmount: betAmount,
            winner: address(0),
            isActive: true
        });

        emit GameCreated(gameCounter, msg.sender, betAmount);
    }

    // Rejoindre une partie existante
    function joinGame(uint256 gameId) external {
        Game storage game = games[gameId];
        require(game.isActive, "Game is not active");
        require(game.player2 == address(0), "Game already has two players");
        require(token.transferFrom(msg.sender, address(this), game.betAmount), "Token transfer failed");

        game.player2 = msg.sender;

        emit GameJoined(gameId, msg.sender);
    }

    // Terminer une partie et désigner le gagnant
    function finishGame(uint256 gameId, address winner) external {
        Game storage game = games[gameId];
        require(game.isActive, "Game is not active");
        require(msg.sender == game.player1 || msg.sender == game.player2, "Only participants can finish the game");
        require(winner == game.player1 || winner == game.player2, "Invalid winner");

        game.winner = winner;
        game.isActive = false;

        uint256 totalBet = game.betAmount * 2;
        require(token.transfer(winner, totalBet), "Token transfer failed");

        emit GameFinished(gameId, winner);
    }
}