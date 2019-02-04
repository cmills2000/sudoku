// api controller to manage interaction with sudoku
var sudokuRepo = require('../models/sudokuRepo');
var express = require('express');
var router = express.Router();

var repo = sudokuRepo.repo;

router.get('/', function(req, res, next) {
  res.json({ title: 'Sudoku' });
});

// POST: /api/sudoku/new
router.post('/new', function(req, res, next) {
    res.json(repo.new());
});

// POST: /api/sudoku/get/:id
router.post('/get/:id(\\d+)', function(req, res, next) {
    let id = req.params.id;
    let puzzle = repo.get(id);

    if (!puzzle){
        res.status(404).json({ error: true, message: `puzzle with id(${id}) not found` });
    }

    res.json(puzzle);
});

// POST: /api/sudoku/check/:id
router.post('/check/:id(\\d+)', function(req, res, next) {
    let id = req.params.id;
    let puzzle = repo.get(id);

    if (!puzzle){
        res.status(404).json({ error: true, message: `puzzle with id(${id}) not found` });
    }

    let valid = puzzle.check();

    res.json({isvalid:valid});
});

// POST: /api/sudoku/setvalue/:id/:row/:col/:val (We should probably post to the body here, just not enough time to configure middlleware)
router.post('/setvalue/:id(\\d+)/:row(\\d+)/:col(\\d+)/:val(\\d+)', function(req, res, next) {
    let id = req.params.id;
    let row = req.params.row;
    let col = req.params.col;
    let val = req.params.val;
    let puzzle = repo.get(id);

    if (!puzzle){
        res.status(404).json({ error: true, message: `puzzle with id(${id}) not found` });
    }

    let valid = puzzle.setValue(row, col, val)

    res.json({isvalid:valid});
});

module.exports = router;
