/*
sudoku.js - Sudoku puzzle class
Author: Courtney Mills
For: Orderful Technical Interview
Date: February 2019
*/
function SudokuView(grid, masked, difficulty, playerMoves, computerMoves, createdTime, solvedTime, computerSolutionTime) {
    this.grid = grid;
    this.masked = masked;
    this.difficulty = difficulty;
    this.playerMoves = playerMoves;
    this.computerMoves = computerMoves;
    this.createdTime = createdTime;
    this.solvedTime = solvedTime;
    this.computerSolutionTime = computerSolutionTime;
}
exports.SudokuView = SudokuView;
