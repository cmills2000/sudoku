/*
sudoku.js - Sudoku puzzle class
Author: Courtney Mills
For: Orderful Technical Interview
Date: February 2019
*/


function SudokuView(grid, masked, difficulty, playerMoves, computerMoves, createdTime, solvedTime, computerSolutionTime)
{
    this.board = grid;
    this.masked = masked;
    this.difficulty = difficulty;
    this.playerMoves = playerMoves;
    this.computerMoves = computerMoves;
    this.createdTime = createdTime;
    this.solvedTime = solvedTime;
    this.computerSolutionTime = computerSolutionTime;
}

class Sudoku {
    constructor(sudokuConfig) {

        // make sure 'new' is used
        if (!(this instanceof Sudoku)) {
            return new Sudoku(sudokuConfig);
        }
        
        // n is the dimension size
        this.n = 9;
        this.divisor = this.n / 3;
        this.hint = true;
        this.playerMoves = 0;
        this.computerMoves = 0;
        this.createdAtTime = Date.now();
        this.solvedAtTime = null;
        this.computerSolutionTime = null;
        
        // diffulty level (77 >= hints >= 17 when n=9)
        this.difficulty = 50;
        this.maxHints = 77;
        this.minHints = 17;
        
        // lookups
        this.rowLookup = [];
        this.columnLookup = [];
        this.boxLookup = [];
        
        // if configuration object was passed
        if (sudokuConfig) {
            this.n = sudokuConfig.dimensionSize || this.n;
            this.hint = sudokuConfig.hint === true || this.hint;
        }

        // get an empty grid to size n
        this.getEmptyGrid = function () {
            // row loop
            let grid = new Array(this.n);
            for (let y = 0; y < this.n; y++) {
                let row = new Array(this.n);
                grid[y] = row;
                for (let x = 0; x < this.n; x++) {
                    row[x] = null;
                }
            }
            return grid;
        };

        // board is the puzzle solution as an array of arrays
        this.sourceBoard = this.getEmptyGrid();
        this.board = this.getEmptyGrid();

        // create array of specified length
        this.createArrayOfLength = function (length, func) {
            let array = [];
            for (let i = 0; i < length; i++) {
                array.push(func());
            }
            return array;
        };
        this.rowLookup = this.createArrayOfLength(this.n, n => new Object());
        this.columnLookup = this.createArrayOfLength(this.n, n => new Object());
        this.boxLookup = this.createArrayOfLength(this.n, n => new Object());
        
        // Get a random integer between two values (inclusive)
        this.getRandomInt = function (min, max) {
            return Math.floor(Math.random() * (max - min)) + min;
        };

        //
        this.getBoxIdx = function (row, col) {
            let boxRowIdx = Math.ceil((row + 1) / this.divisor) - 1;
            let boxColIdx = Math.ceil((col + 1) / this.divisor) - 1;
            let boxIdx = boxColIdx + (this.divisor * boxRowIdx);
            return boxIdx;
        };
        
        // check value for the given cell during computer solution
        this.isValidValue = function (row, col, val, tried) {
            // check that the number has not already been tried
            if (tried.hasOwnProperty(val)) {
                return false;
            }
            // check that the number is not selected in the row
            if (this.rowLookup[row].hasOwnProperty(val)) {
                return false;
            }
            // check that the number is not selected in the column
            if (this.columnLookup[col].hasOwnProperty(val)) {
                return false;
            }
            // check that the number is not selected in the box
            let boxIdx = this.getBoxIdx(row, col);
            if (this.boxLookup[boxIdx].hasOwnProperty(val)) {
                return false;
            }
            return true;
        };

        // check value for a given cell during human solution
        this.checkValidValue = function (row, col, val) {
            if (!val)
            {
                return false;
            }


            // check that the number is not selected in the row
            for (var i = 0; i < this.n; i++) {
                let x = this.board[row][i];
                if (x === val) 
                {
                    return false;
                }
            }

            // check that the number is not selected in the column
            for (var i = 0; i < this.n; i++) {
                let x = this.board[i][col];
                if (x === val) 
                {
                    return false;
                }
            }

            // check that the number is not selected in the box
            let boxRowIdx = Math.floor(row / this.divisor) * this.divisor;
            let boxColIdx = Math.floor(col / this.divisor) * this.divisor;
            for (var y = boxRowIdx; y < boxRowIdx + this.divisor; y++)
            {
                for (var x = boxColIdx; x < boxColIdx + this.divisor; x++)
                {
                    let v = this.board[y][x];
                    if (v === val)
                    {
                        return false;
                    }
                }
            }


            return true;
        };

        this.check = function()
        {
            let valid = true;

            for (let y = 0; y < this.n; y++) {
                for (let x = 0; x < this.n; x++) {
                    valid = this.checkValidValue(y, x, this.board[y][x]);
                    if (!valid){
                        break;
                    }
                }
            }

            return valid;
        }
        
        // pick a valid value for the given cell
        this.pickValidValue = function (row, col, tried) {
            let value = null;
            let thisTried = new Object();
            let numTried = 0;
            while (!value) {
                let i = this.getRandomInt(1, this.n + 1);
                if (!thisTried.hasOwnProperty(i)) {
                    if (this.isValidValue(row, col, i, tried)) {
                        value = i;
                        break;
                    }
                    thisTried[i] = true;
                    numTried++;
                }
                if (numTried == this.n) {
                    break;
                }
            }
            return value;
        };
        
        // get a value at the specified index
        this.getOrSelectValue = function (rowIdx, colIdx, random, tried) {
            let value = null;
            if (this.board) {
                value = this.board[rowIdx][colIdx];
            }
            if (!value) {
                if (random) {
                    value = this.getRandomInt(1, this.n + 1);
                }
                else {
                    value = this.pickValidValue(rowIdx, colIdx, tried);
                }
            }
            return value;
        };

        this.setValue = function (rowIdx, colIdx, value)
        {
            value = parseInt(value);
            console.log(`value:${value}`);
            let valid = this.checkValidValue(rowIdx, colIdx, value);

            this.board[rowIdx][colIdx] = value;

            return valid;
        }
        
        // solve the puzzle dynamically
        this.solveDynamic = function (rowIdx, colIdx) {
            let value = null;
            let nextValue = null;
            // keep a record of tried numbers in case we need to backtrack
            let tried = new Object();
            let deadend = false;
            let done = false;
            this.computerMoves++;
            do {
                // If we are at the beginning, its all good, get any number between 1 and n and keep moving
                if (rowIdx == 0 && colIdx == 0) {
                    value = this.getOrSelectValue(rowIdx, colIdx, true, tried);
                }
                // If not, check that the number is valid for the cell and keep it moving
                else {
                    value = this.getOrSelectValue(rowIdx, colIdx, false, tried);
                }
                let nextRow = colIdx == this.n - 1;
                let nextColIdx = nextRow ? 0 : colIdx + 1;
                let nextRowIdx = nextRow ? rowIdx + 1 : rowIdx;
                if (nextRowIdx == this.n) {
                    done = true;
                }
                // set the value for this cell
                this.sourceBoard[rowIdx][colIdx] = value;
                // if we have a valid value add entries to the lookups and continue
                if (value) {
                    tried[value] = true;
                    this.columnLookup[colIdx][value] = true;
                    this.rowLookup[rowIdx][value] = true;
                    let boxIdx = this.getBoxIdx(rowIdx, colIdx);
                    this.boxLookup[boxIdx][value] = true;
                    
                    // get the number for the next cell
                    if (!done) {
                        nextValue = this.solveDynamic(nextRowIdx, nextColIdx);
                        if (!nextValue) {
                            delete this.columnLookup[colIdx][value];
                            delete this.rowLookup[rowIdx][value];
                            delete this.boxLookup[boxIdx][value];
                        }
                    }
                }
                // if not a valid value, this is a deadend
                else {
                    deadend = true;
                }
                // If the current number or the number returned by the child is null, it means that we're at a dead end, try another number
            } while (nextValue == null && !deadend && !done);
            return value;
        };
        
        // Solve the puzzle
        this.solve = function (rowIdx, colIdx, val) {
            let startTime = Date.now();
            this.solveDynamic(0, 0);
            let endTime = Date.now();
            this.computerSolutionTime = endTime - startTime;
            return this.sourceBoard;
        };
        
        // get the number of hints based on the difficulty level
        this.getHintValue = function (diff, min, max) {
            return Math.floor(((100 - diff) / 100) * (max - min)) + min;
        };
        
        // get a key based on coordinates
        this.getKey = function (row, col) {
            return `${row},${col}`;
        };
        
        // mask a solved grid
        this.mask = function () {
            let hints = this.getHintValue(this.difficulty, this.minHints, this.maxHints);
            let taken = new Object();
            for (let i = 0; i < hints; i++) {
                let used = false;
                do {
                    let x = this.getRandomInt(0, this.n);
                    let y = this.getRandomInt(0, this.n);
                    let key = this.getKey(y, x);
                    used = taken.hasOwnProperty(key);
                    if (!used) {
                        taken[key] = [y, x];
                        break;
                    }
                } while (used);
            }

            for (var coord in taken) {
                let x = taken[coord];
                this.board[x[1]][x[0]] = this.sourceBoard[x[1]][x[0]];
            }
            return this.board;
        };
        
        
        if (this.hint) {
            this.sourceBoard = this.solve();
            this.board = this.mask();
            this.thisGrid = this.board;
        }
        //let puzzleView = new SudokuView(this.thisGrid, this.hint, this.difficulty, this.playerMoves, this.computerMoves, this.createdAtTime, this.solvedAtTime, this.computerSolutionTime);
        //return puzzleView;
    }
}


exports.api = (function () {

    // public
    return {
        
        // Create a new sudoku puzzle
        new: function(sudokuConfig)
        {
            let puzzleView = new Sudoku(sudokuConfig);

            return puzzleView;
        },
        
        // Difficulty between 0 and 100
        refreshHint: function(diff)
        {
            // Validate diff
            if (diff && (isNaN(diff) || diff < 0 || diff > 100))
            {
                throw "difficulty must be a number between 0 and 100";
            } 
            else if (diff)
            {
                hints = getHintValue(diff, minHints, maxHints);
                difficulty = diff;
                maskedGrid = mask();
            }

            let puzzleView = new SudokuView(maskedGrid, hint, difficulty, playerMoves, computerMoves, createdAtTime, solvedAtTime, computerSolutionTime);

            return puzzleView;

        },

        setValue: function(sudoku, row, column, value)
        {
            return sudoku.setValue(row, column, value);
        },

        check: function()
        {
            return sudoku.check();
        }

    };
  }());
