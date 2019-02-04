/*
SudokuRepo.js - Sudoku puzzle repo class
Author: Courtney Mills
For: Orderful Technical Interview
Date: February 2019
*/

// api controller to manage interaction with sudoku
var sudokuModule = require('./sudoku');

exports.repo = (function () {
    // private variables
    let db = new Object();
    let counter = 0;

    // public
    return {
        
        // Create a new sudoku puzzle
        new: function(sudokuConfig)
        {
            let id = counter + 1;
            counter = id;

            let puzzle = sudokuModule.api.new(sudokuConfig);
            db[id] = puzzle;

            return {
                id: id,
                sudoku: puzzle
            };
        },
        
        get: function(id)
        {
            return db[id];
        },

        delete: function(id)
        {
            return db[id] = null;
        },

    };
  }());
