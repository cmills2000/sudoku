/*
sudoku.js - Sudoku puzzle class
Author: Courtney Mills
For: Orderful Technical Interview
Date: February 2019
*/


function SudokuView(grid, masked, difficulty, playerMoves, computerMoves, createdTime, solvedTime, computerSolutionTime)
{
    this.grid = grid;
    this.masked = masked;
    this.difficulty = difficulty;
    this.playerMoves = playerMoves;
    this.computerMoves = computerMoves;
    this.createdTime = createdTime;
    this.solvedTime = solvedTime;
    this.computerSolutionTime = computerSolutionTime;
}


exports.api = (function () {
    // private variables
    // n is the dimension size
    const n = 9;
    const divisor = n / 3;
    let hint = true;
    let playerMoves = 0;
    let computerMoves = 0;
    let createdAtTime = Date.now();
    let solvedAtTime = null;
    let computerSolutionTime = null;

    // grid is the puzzle solution as an array of arrays
    let grid = null; 
    let maskedGrid = null;

    // diffulty level (77 >= hints >= 17 when n=9)
    let difficulty = 50;
    const maxHints = 77;
    const minHints = 17;
    
    // lookups
    let rowLookup = [];
    let columnLookup = [];
    let boxLookup = [];

    function createArrayOfLength(length, func)
    {
        let array = [];

        for(var i = 0; i < length; i++) {
            array.push(func());
        }

        return array;
    }

    // get the number of hints based on the difficulty level
    function getHintValue(diff, min, max) 
    {
        return Math.floor( ((100 - diff) / 100) * (max - min)) + min;
    }

    // pick a valid value for the given cell
    function pickValidValue(row, col, tried)
    {
        let value = null;
        let thisTried = new Object();
        let numTried = 0;

        while (!value) {
            let i = getRandomInt(1, n + 1);

            if (!thisTried.hasOwnProperty(i))
            {
                if (isValidValue(row, col, i, tried))
                {
                    value = i;
                    break;
                }
                thisTried[i] = true;
                numTried++;
            }

            if (numTried == n)
            {
                break;
            }
        }

        return value;
    }

    function getKey(row, col)
    {
        return `${row},${col}`;
    }

    function getBoxIdx(row, col)
    {
        let boxRowIdx = Math.ceil((row + 1) / divisor) - 1;
        let boxColIdx = Math.ceil((col + 1) / divisor) - 1;
        let boxIdx = boxColIdx + (divisor * boxRowIdx);
        return boxIdx;
    }

    // pick a valid value for the given cell
    function isValidValue(row, col, val, tried)
    {
        // check that the number has not already been tried
        if (tried.hasOwnProperty(val))
        {
            return false;
        }

        // check that the number is not selected in the row
        if (rowLookup[row].hasOwnProperty(val))
        {
            return false;
        }

        // check that the number is not selected in the column
        if (columnLookup[col].hasOwnProperty(val))
        {
            return false;
        }

        // check that the number is not selected in the box
        let boxIdx = getBoxIdx(row, col);
        if (boxLookup[boxIdx].hasOwnProperty(val))
        {
            return false;
        }

        return true;
    }

    // Get a random integer between two values (inclusive)
    function getRandomInt(min, max) 
    {
        return Math.floor(Math.random() * (max - min)) + min;
    }

    // mask a solved grid
    function mask()
    {
        let hints = getHintValue(difficulty, minHints, maxHints);
        let taken = new Object();

        for (i = 0; i < hints; i++)
        {
            let used = false;
            do {
                let x = getRandomInt(0, n);
                let y = getRandomInt(0, n);
                let key = getKey(y, x);
                used = taken.hasOwnProperty(key);

                if (!used)
                {
                    taken[key] = [y,x];
                    break;
                }

            }
            while (used);
        }

        maskedGrid = getEmptyGrid();
        for (coord in taken)
        {
            let x = taken[coord];
            maskedGrid[x[1]][x[0]] = grid[x[1]][x[0]];
        }

        return maskedGrid;
    }

    function getEmptyGrid(){
        // row loop
        let grid = new Array(n);

        for (y = 0; y < n; y++) {

            let row = new Array(n);
            grid[y] = row;

            for (x = 0; x < n; x++) {
                row[x] = null;
            }
        }

        return grid;
    }

    // get a value at the specified index
    function getOrSelectValue(rowIdx, colIdx, random, tried)
    {
        let value = null;

        if (maskedGrid)
        {
            value = maskedGrid[rowIdx][colIdx];
        }

        if (!value)
        {
            if (random)
            {
                value = getRandomInt(1, n + 1);
            } else {
                value = pickValidValue(rowIdx, colIdx, tried);
            }
        }

        return value;
    }
    
    // solve the puzzle dynamically
    function solveDynamic(rowIdx, colIdx)
    {
        let value = null;
        let nextValue = null;

        // keep a record of tried numbers in case we need to backtrack
        let tried = new Object();
        let deadend = false;
        let done = false;

        do 
        {
            // If we are at the beginning, its all good, get any number between 1 and n and keep moving
            if (rowIdx == 0 && colIdx == 0)
            {
                value = getOrSelectValue(rowIdx, colIdx, true, tried);
            } 

            // If not, check that the number is valid for the cell and keep it moving
            else 
            {
                value = getOrSelectValue(rowIdx, colIdx, false, tried);
            }

            let nextRow = colIdx == n - 1;
            let nextColIdx = nextRow ? 0 : colIdx + 1;
            let nextRowIdx = nextRow ? rowIdx + 1 : rowIdx;

            if (nextRowIdx == n)
            {
                done = true;
            }

            // set the value for this cell
            grid[rowIdx][colIdx] = value;

            // if we have a valid value add entries to the lookups and continue
            if (value) {
                tried[value] = true;
                columnLookup[colIdx][value] = true;
                rowLookup[rowIdx][value] = true;

                // get the number for the next cell
                if (!done) {
                    nextValue = solveDynamic(nextRowIdx, nextColIdx);

                    if (!nextValue)
                    {
                        delete columnLookup[colIdx][value];
                        delete rowLookup[rowIdx][value];
                    }
                }
            }
            // if not a valid value, this is a deadend
            else 
            {
                deadend = true;
            }

            // If the current number or the number returned by the child is null, it means that we're at a dead end, try another number
        } while (nextValue == null && !deadend && !done);

        return value;
    }

    // Solve the puzzle
    function solve(rowIdx, colIdx, val)
    {
        let startTime = Date.now();
        
        solveDynamic(0,0);
        
        let endTime = Date.now();

        computerSolutionTime = endTime - startTime;
        return grid;
    }


    // public
    return {
        
        // Create a new sudoku puzzle
        new: function(sudokuConfig)
        {
            if (sudokuConfig) {
                n = sudokuConfig.dimensionSize || n;
                hint = sudokuConfig.hint === true || hint; 
            }

            grid = getEmptyGrid();
            let thisGrid = grid;

            rowLookup = createArrayOfLength(n, n => new Object());
            columnLookup = createArrayOfLength(n, n => new Object());
            boxLookup = createArrayOfLength(n, n => new Object());

            if (hint) {
                grid = solve();
                maskedGrid = mask();
                thisGrid = maskedGrid;
            }

            let puzzleView = new SudokuView(thisGrid, hint, difficulty, playerMoves, computerMoves, createdAtTime, solvedAtTime, computerSolutionTime);

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

        }


    };
  }());
