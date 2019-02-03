// api controller to manage interaction with sudoku
var sudokuRepo = require('../models/sudokuRepo');
var express = require('express');
var router = express.Router();

var repo = sudokuRepo.repo;

router.get('/', function(req, res, next) {
  res.json({ title: 'Sudoku' });
});

router.post('/new', function(req, res, next) {
    res.json(repo.new());
});

router.post('/get/:id(\\d+)', function(req, res, next) {
    let id = req.params.id;
    let puzzle = repo.get(id);

    if (!puzzle){
        res.status(404).json({ error: true, message: `puzzle with id(${id}) not found` });
    }

    res.json(puzzle);
});

module.exports = router;
