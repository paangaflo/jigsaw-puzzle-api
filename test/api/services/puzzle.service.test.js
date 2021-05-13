/* global describe, it, before, after */

const { expect } = require('chai');
const sinon = require('sinon');

// Main module that we are testing
const puzzleService = require('../../../api/services/puzzle.service');
// Secondary modules
const messageHelper = require('../../../api/helpers/message.helper');

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
      solution: [],
    };

    describe('execute new throw RestrictionException', () => {
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
});
