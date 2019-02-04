var expect = require('chai').expect;
var sudoku = require('../models/sudoku');

describe('setValue(row, column, value)', function () {
  it('should set the value on the board', function () {
    
    // 1. ARRANGE
    var row = 1;
    var column = 5;
    var value = 8;
    var s = sudoku.api.new();
    
    // 2. ACT
    sudoku.api.setValue(s, row, column, value);
    var retValue = s.board[row][column];

    // 3. ASSERT
    expect(retValue).to.be.equal(value);

  });
});

describe('setValue(row, column, value)', function () {
  it('should not be valid if value already selected in the row', function () {
    
    // 1. ARRANGE
    var row = 0;
    var column = 4;
    var value = 8;
    var s = sudoku.api.new();
    s.board[0] = [9, 8, 7, 6, null, 4, 3, 2, 1]
    
    // 2. ACT
    var valid = sudoku.api.setValue(s, row, column, value);

    // 3. ASSERT
    expect(valid).to.be.equal(false);

  });
});

describe('setValue(row, column, value)', function () {
  it('should not be valid if value already selected in the column', function () {
    
    // 1. ARRANGE
    
    // 2. ACT

    // 3. ASSERT
    expect(true).to.be.equal(false);
  });
});

describe('setValue(row, column, value)', function () {
  it('should not be valid if value already selected in the box', function () {
    
    // 1. ARRANGE
    
    // 2. ACT

    // 3. ASSERT
    expect(true).to.be.equal(false);
  });
});

describe('setValue(row, column, value)', function () {
  it('should not be valid if index is off the board', function () {
    
    // 1. ARRANGE
    
    // 2. ACT

    // 3. ASSERT
    expect(true).to.be.equal(false);
  });
});

describe('setValue(row, column, value)', function () {
  it('should not be valid if value is not a number', function () {
    
    // 1. ARRANGE
    
    // 2. ACT

    // 3. ASSERT
    expect(true).to.be.equal(false);
  });
});

describe('setValue(row, column, value)', function () {
  it('should not be valid if value is not a number between 1 and n', function () {
    
    // 1. ARRANGE
    
    // 2. ACT

    // 3. ASSERT
    expect(true).to.be.equal(false);
  });
});

describe('isComplete(id)', function () {
  it('should be true if puzzle is solved', function () {
    
    // 1. ARRANGE
    
    // 2. ACT

    // 3. ASSERT
    expect(true).to.be.equal(false);
  });
});