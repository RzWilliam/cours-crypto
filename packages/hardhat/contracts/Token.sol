// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0 <0.9.0;

// Importation des bibliothèques OpenZeppelin
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract Test is ERC20, Ownable {
    constructor(uint256 initialSupply) ERC20("Test", "TOK") {
        // Appel au constructeur de base avec le nom et le symbole du token
        _mint(msg.sender, initialSupply * (10 ** decimals()));
    }
}