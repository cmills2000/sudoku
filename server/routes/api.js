// api controller to manage interaction with sudoku
const sudokuModule = require('../models/sudoku');
var express = require('express');
var router = express.Router();

var sudoku = sudokuModule.api;

router.get('/', function(req, res, next) {
  res.json({ title: 'Sudoku' });
});

router.post('/new', function(req, res, next) {
    res.json(sudoku.new());
});

module.exports = router;
