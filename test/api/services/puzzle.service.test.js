/* global describe, it, before, after */

const { expect } = require('chai');
const sinon = require('sinon');

const puzzleService = require('../../../api/services/puzzle.service');

describe('Puzzle Service Tests', () => {
  describe('solvePuzzle Tests', () => {
    const puzzleToSolve = {
      boardSize: 4,
      pieces: [
        [
          '.*',
          '**',
        ],
        [
          '*.',
          '**',
        ],
        [
          '.***',
          '..**',
          '***.',
          '**..',
        ],
      ],
    };

    const puzzleSolved = {
      solution: [
        '1222',
        '1122',
        '2220',
        '2200'
      ]
    };

    describe('execute puzzle solution without RestrictionException', () => {
      let myStub;

      before((done) => {
        myStub = sinon.stub(puzzleService, 'solvePuzzle').returns(puzzleSolved);
        done();
      });

      after((done) => {
        myStub.restore();
        done();
      });

      it('SolvePuzzle Successfully', (done) => {
        const result = puzzleService.solvePuzzle(puzzleToSolve);
        const expectedResult = puzzleSolved;

        expect(result).to.deep.equal(expectedResult);

        done();
      });
    });
  });

  describe('validateInputRequest Tests', () => {
    describe('execute new throw RestrictionException', () => {
      it(`boardSize attribute must be an integer between ${puzzleService.MINIMUM_LIMIT} and ${puzzleService.MAXIMUM_LIMIT}`, () => {
        expect(() => puzzleService.validateInputRequest({
          boardSize: 0,
          pieces: [],
        })).to.throw(puzzleService.RestrictionException);
      });

      it(`The number of pieces must be between ${puzzleService.MINIMUM_LIMIT} and ${puzzleService.MAXIMUM_LIMIT}`, () => {
        expect(() => puzzleService.validateInputRequest({
          boardSize: 1,
          pieces: [],
        })).to.throw(puzzleService.RestrictionException);
      });

      it(`Each piece must contain minimum ${puzzleService.MINIMUM_LIMIT} descriptions and maximum ${puzzleService.MAXIMUM_LIMIT} descriptions`, () => {
        expect(() => puzzleService.validateInputRequest({
          boardSize: 1,
          pieces: [
            [],
          ],
        })).to.throw(puzzleService.RestrictionException);
      });

      it(`Each description must contain minimum ${puzzleService.MINIMUM_LIMIT} characters and maximum ${puzzleService.MAXIMUM_LIMIT} characters`, () => {
        expect(() => puzzleService.validateInputRequest({
          boardSize: 1,
          pieces: [
            [''],
          ],
        })).to.throw(puzzleService.RestrictionException);
      });

      it('Each description must contain only the following characters [.][*]', () => {
        expect(() => puzzleService.validateInputRequest({
          boardSize: 1,
          pieces: [
            ['*$.+d*f6'],
          ],
        })).to.throw(puzzleService.RestrictionException);
      });

      it('Each description must contain minimum one character [*]', () => {
        expect(() => puzzleService.validateInputRequest({
          boardSize: 1,
          pieces: [
            ['......'],
          ],
        })).to.throw(puzzleService.RestrictionException);
      });
    });
  });

  describe('validateQuantitySpacesOccupies Tests', () => {
    // In this case there are not solutions since we need to fill a 3x3 board,
    // which has 9 spaces but the 2 pieces given can only occupy 8 spaces.
    it('Solve board without spaces', () => {
      expect(puzzleService.validateQuantitySpacesOccupies({
        boardSize: 3,
        pieces: [
          [
            '***',
          ],
          [
            '***',
            '***',
          ],
        ],
      })).to.equal(true);
    });

    it('Solve board with spaces', () => {
      expect(puzzleService.validateQuantitySpacesOccupies({
        boardSize: 3,
        pieces: [
          [
            '***',
          ],
          [
            '***',
            '**.',
          ],
        ],
      })).to.equal(false);
    });
  });

  describe('permutator Tests', () => {
    it('Build permutation for 1 piece', () => {
      const permutations = puzzleService.permutator([0], [], []);
      expect(permutations).to.have.lengthOf(1);
    });

    it('Build permutation for 3 pieces', () => {
      const permutations = puzzleService.permutator([0, 1, 2], [], []);
      expect(permutations).to.have.lengthOf(6);
    });
  });

  describe('createMatrix Tests', () => {
    it('Build matrix for 1 piece', () => {
      const matrix = puzzleService.createMatrix(1, 1);
      expect(matrix[0]).to.have.lengthOf(1);
    });

    it('Build matrix for 3 pieces', () => {
      const matrix = puzzleService.createMatrix(3, 3);
      expect(matrix[0]).to.have.lengthOf(3);
      expect(matrix[1]).to.have.lengthOf(3);
      expect(matrix[2]).to.have.lengthOf(3);
    });

    it('Build matrix for 10 pieces', () => {
      const matrix = puzzleService.createMatrix(10, 10);
      expect(matrix[0]).to.have.lengthOf(10);
      expect(matrix[1]).to.have.lengthOf(10);
      expect(matrix[2]).to.have.lengthOf(10);
      expect(matrix[3]).to.have.lengthOf(10);
      expect(matrix[4]).to.have.lengthOf(10);
      expect(matrix[5]).to.have.lengthOf(10);
      expect(matrix[6]).to.have.lengthOf(10);
      expect(matrix[7]).to.have.lengthOf(10);
      expect(matrix[8]).to.have.lengthOf(10);
      expect(matrix[9]).to.have.lengthOf(10);
    });
  });
});
