/*
Sudoku.js - Sudoku puzzle class
Author: Courtney Mills
For: Orderful Technical Interview
Date: February 2019
*/

exports.api = (function () {
    // private variables
    // n is the dimension size
    let n = 9;

    // grid is the puzzle solution as an array of arrays
    let grid = null; 

    // diffulty level (77 >= hints >= 17 when n=9)
    const maxHints = 77;
    const minHints = 17;

    let difficulty = 0;

    let getHintValue = function(diff, min, max) 
    {
        return (diff / 100) * (max - min) + min;
    }

    let hints = getHintValue(difficulty, minHints, maxHints);

    let getValue = function(row, col, box)
    {
        return getRandomValue(1, n);
    }

    let getRandomValue = function(min, max) 
    {
        return Math.random() * (max - min) + min;
    }



    // public
    return {
        
        // Create a new sudoku puzzle
        new: function(sudokuConfig)
        {
            if (sudokuConfig) {
                n = sudokuConfig.dimensionSize || n;
            }
            grid = this.solve();
            return grid;
        },
        
        // Solve the puzzle
        solve: function(row, col, val)
        {
            // let grid = new Array(n).map(x => getRandomValue(1,n)).map(item =>(new Array(n).map(x => getRandomValue(1,n))));
            let grid = new Array(n).fill(null).map(item =>(new Array(n).fill(null)));
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
