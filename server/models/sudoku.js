/*
sudoku.js - Sudoku puzzle class
Author: Courtney Mills
For: Orderful Technical Interview
Date: February 2019
*/

exports.api = (function () {
    // private variables
    // n is the dimension size
    let n = 9;
    let hint = true;

    // grid is the puzzle solution as an array of arrays
    let grid = null; 
    let maskedGrid = null;

    // diffulty level (77 >= hints >= 17 when n=9)
    const maxHints = 77;
    const minHints = 17;

    let difficulty = 50;

    let getHintValue = function(diff, min, max) 
    {
        return Math.floor( ((100 - diff) / 100) * (max - min)) + min;
    }

    // pick a valid value for the given cell
    let pickValidValue = function(row, col)
    {
        return getRandomInt(1, n);
    }

    // pick a valid value for the given cell
    let isValidValue = function(row, col)
    {
        return false;
    }

    // Get a random integer between two values (inclusive)
    let getRandomInt = function(min, max) 
    {
        return Math.floor(Math.random() * (max - min)) + min;
    }

    // mask a solved grid
    let mask = function()
    {
        let hints = getHintValue(difficulty, minHints, maxHints);
        let taken = new Object();

        for (i = 0; i < hints; i++)
        {
            let used = false;
            do {
                let x = getRandomInt(0, n);
                let y = getRandomInt(0, n);
                let key = `${x},${y}`;
                used = taken.hasOwnProperty(key);

                if (!used)
                {
                    taken[key] = [x,y];
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

    let getEmptyGrid = function(){
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

            if (hint) {
                grid = this.solve();
                maskedGrid = mask();
                return maskedGrid;
            }

            return grid;
        },
        
        // Solve the puzzle
        solve: function(rowIdx, colIdx, val)
        {
            grid = grid.map(row => row.map(col => getRandomInt(1,n)));
            return grid;
        },

        // Difficulty between 0 and 100
        hint: function(diff)
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
            }

            let hint = grid;
            return hint;

        }


    };
  }());
