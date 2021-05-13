/* global describe, it, before, after */
/* eslint no-shadow: ['error', { 'allow': ['done'] }] */

const supertest = require('supertest');
const { expect } = require('chai');
const should = require('chai').should();
const sinon = require('sinon');
const app = require('../../../app');

const puzzleController = require('../../../api/controllers/puzzle.controller');
const controllerHelper = require('../../../api/helpers/controller.helper');
const messageHelper = require('../../../api/helpers/message.helper');
const puzzleService = require('../../../api/services/puzzle.service');

describe('Puzzle Controller Tests', () => {
  let request = null;
  let server = null;

  before((done) => {
    server = app.listen(done);
    request = supertest.agent(server);
    puzzleService.MINIMUM_LIMIT = 1;
    puzzleService.MAXIMUM_LIMIT = 10;
  });

  after((done) => {
    server.close(done);
  });

  describe('getSolutionPuzzle Tests', () => {
    // In this case there is only one way to fill a 4x4 square with the given pieces
    describe('POST /api/v1/jigsaw Succesfully with solution', () => {
      let myStub;

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

      before((done) => {
        myStub = sinon.stub(puzzleService, 'solvePuzzle').returns(puzzleSolved);
        done();
      });

      after((done) => {
        myStub.restore();
        done();
      });

      it('POST /api/v1/jigsaw Succesfully', (done) => {
        request
          .post('/api/v1/jigsaw')
          .send(puzzleToSolve)
          .set('Accept', 'application/json')
          .expect('Content-Type', /json/)
          .expect(200)
          .end((err, res) => {
            if (err) {
              done(err);
            } else {
              should.not.exist(err);
              expect(res.body).to.deep.equal(puzzleSolved);
              done();
            }
          });
      });
    });

    // In this case is no way to arrange the pieces to fill a 4x4 square
    describe('POST /api/v1/jigsaw Succesfully without solution', () => {
      let myStub;

      const puzzleToSolve = {
        boardSize: 4,
        pieces: [
          [
            '***',
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
        solution: [], // TODO: When the solution is complete, it must be changed to null
      };

      before((done) => {
        myStub = sinon.stub(puzzleService, 'solvePuzzle').returns(puzzleSolved);
        done();
      });

      after((done) => {
        myStub.restore();
        done();
      });

      it('POST /api/v1/jigsaw Succesfully', (done) => {
        request
          .post('/api/v1/jigsaw')
          .send(puzzleToSolve)
          .set('Accept', 'application/json')
          .expect('Content-Type', /json/)
          .expect(200)
          .end((err, res) => {
            if (err) {
              done(err);
            } else {
              should.not.exist(err);
              expect(res.body).to.deep.equal(puzzleSolved);
              done();
            }
          });
      });
    });

    // In this case there are not solutions since we need to fill a 3x3 board,
    // which has 9 spaces but the 2 pieces given can only occupy 8 spaces.
    describe('POST /api/v1/jigsaw Succesfully without solution for having less space to occupy on the board', () => {
      let myStub;

      const puzzleToSolve = {
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
      };

      const puzzleSolved = {
        solution: null,
      };

      before((done) => {
        myStub = sinon.stub(puzzleService, 'solvePuzzle').returns(puzzleSolved);
        done();
      });

      after((done) => {
        myStub.restore();
        done();
      });

      it('POST /api/v1/jigsaw Succesfully', (done) => {
        request
          .post('/api/v1/jigsaw')
          .send(puzzleToSolve)
          .set('Accept', 'application/json')
          .expect('Content-Type', /json/)
          .expect(200)
          .end((err, res) => {
            if (err) {
              done(err);
            } else {
              should.not.exist(err);
              expect(res.body).to.deep.equal(puzzleSolved);
              done();
            }
          });
      });
    });

    describe('POST /api/v1/jigsaw Failed with Exception 500', () => {
      let myStub;

      const puzzleToSolve = {
        boardSize: 1,
        some_name: [],
      };

      const expErrMsg = controllerHelper.buildErrorResponse(puzzleController.CONTROLLER_NAME, 'getSolutionPuzzle');

      before((done) => {
        myStub = sinon.stub(puzzleService, 'solvePuzzle').throws(new Error('error'));
        done();
      });

      after((done) => {
        myStub.restore();
        done();
      });

      it('POST /api/v1/jigsaw Failed with Exception', (done) => {
        request
          .post('/api/v1/jigsaw')
          .send(puzzleToSolve)
          .set('Accept', 'application/json')
          .expect('Content-Type', /json/)
          .expect(500)
          .end((err, res) => {
            if (err) {
              done(err);
            } else {
              should.not.exist(err);
              expect(res.body).to.deep.equal(expErrMsg);
              done();
            }
          });
      });
    });

    describe('POST /api/v1/jigsaw Failed with Exception 409', () => {
      let myStub;

      const expErrMsg = messageHelper.buildErrorResponse(
        puzzleController.CONTROLLER_NAME,
        'getSolutionPuzzle',
        {
          error: `boardSize attribute must be an integer between ${puzzleService.MINIMUM_LIMIT} and ${puzzleService.MAXIMUM_LIMIT}`,
        },
      );

      before((done) => {
        myStub = sinon.stub(puzzleService, 'solvePuzzle').returns({
          error: `boardSize attribute must be an integer between ${puzzleService.MINIMUM_LIMIT} and ${puzzleService.MAXIMUM_LIMIT}`,
        });
        done();
      });

      after((done) => {
        myStub.restore();
        done();
      });

      it(`POST /api/v1/jigsaw boardSize attribute must be greater than or equal ${puzzleService.MINIMUM_LIMIT}`, (done) => {
        request
          .post('/api/v1/jigsaw')
          .send({
            boardSize: 0,
            pieces: [],
          })
          .set('Accept', 'application/json')
          .expect('Content-Type', /json/)
          .expect(409)
          .end((err, res) => {
            if (err) {
              done(err);
            } else {
              should.not.exist(err);
              expect(res.body).to.deep.equal(expErrMsg);
              done();
            }
          });
      });

      it(`POST /api/v1/jigsaw boardSize attribute must be less than or equal ${puzzleService.MAXIMUM_LIMIT}`, (done) => {
        request
          .post('/api/v1/jigsaw')
          .send({
            boardSize: 11,
            pieces: [],
          })
          .set('Accept', 'application/json')
          .expect('Content-Type', /json/)
          .expect(409)
          .end((err, res) => {
            if (err) {
              done(err);
            } else {
              should.not.exist(err);
              expect(res.body).to.deep.equal(expErrMsg);
              done();
            }
          });
      });
    });

    describe('POST /api/v1/jigsaw Failed with Exception 409', () => {
      let myStub;

      const expErrMsg = messageHelper.buildErrorResponse(
        puzzleController.CONTROLLER_NAME,
        'getSolutionPuzzle',
        {
          error: `The number of pieces must be between ${puzzleService.MINIMUM_LIMIT} and ${puzzleService.MAXIMUM_LIMIT}`,
        },
      );

      before((done) => {
        myStub = sinon.stub(puzzleService, 'solvePuzzle').returns({
          error: `The number of pieces must be between ${puzzleService.MINIMUM_LIMIT} and ${puzzleService.MAXIMUM_LIMIT}`,
        });
        done();
      });

      after((done) => {
        myStub.restore();
        done();
      });

      it(`POST /api/v1/jigsaw number of pieces must be greater than or equal ${puzzleService.MINIMUM_LIMIT}`, (done) => {
        request
          .post('/api/v1/jigsaw')
          .send({
            boardSize: 1,
            pieces: [],
          })
          .set('Accept', 'application/json')
          .expect('Content-Type', /json/)
          .expect(409)
          .end((err, res) => {
            if (err) {
              done(err);
            } else {
              should.not.exist(err);
              expect(res.body).to.deep.equal(expErrMsg);
              done();
            }
          });
      });

      it(`POST /api/v1/jigsaw number of pieces must be greater than or equal ${puzzleService.MAXIMUM_LIMIT}`, (done) => {
        request
          .post('/api/v1/jigsaw')
          .send({
            boardSize: 1,
            pieces: [
              [], [], [], [], [], [], [], [], [], [], [],
            ],
          })
          .set('Accept', 'application/json')
          .expect('Content-Type', /json/)
          .expect(409)
          .end((err, res) => {
            if (err) {
              done(err);
            } else {
              should.not.exist(err);
              expect(res.body).to.deep.equal(expErrMsg);
              done();
            }
          });
      });
    });

    describe('POST /api/v1/jigsaw Failed with Exception 409', () => {
      let myStub;

      const expErrMsg = messageHelper.buildErrorResponse(
        puzzleController.CONTROLLER_NAME,
        'getSolutionPuzzle',
        {
          error: `Each piece must contain minimum ${puzzleService.MINIMUM_LIMIT} descriptions and maximum ${puzzleService.MAXIMUM_LIMIT} descriptions`,
        },
      );

      before((done) => {
        myStub = sinon.stub(puzzleService, 'solvePuzzle').returns({
          error: `Each piece must contain minimum ${puzzleService.MINIMUM_LIMIT} descriptions and maximum ${puzzleService.MAXIMUM_LIMIT} descriptions`,
        });
        done();
      });

      after((done) => {
        myStub.restore();
        done();
      });

      it(`POST /api/v1/jigsaw number of descriptions for each piece must be greater than or equal ${puzzleService.MINIMUM_LIMIT}`, (done) => {
        request
          .post('/api/v1/jigsaw')
          .send({
            boardSize: 1,
            pieces: [
              [],
            ],
          })
          .set('Accept', 'application/json')
          .expect('Content-Type', /json/)
          .expect(409)
          .end((err, res) => {
            if (err) {
              done(err);
            } else {
              should.not.exist(err);
              expect(res.body).to.deep.equal(expErrMsg);
              done();
            }
          });
      });

      it(`POST /api/v1/jigsaw number of pieces must be less than or equal ${puzzleService.MAXIMUM_LIMIT}`, (done) => {
        request
          .post('/api/v1/jigsaw')
          .send({
            boardSize: 1,
            pieces: [
              ['.*', '.*', '.*', '.*', '.*', '.*', '.*', '.*', '.*', '.*', '.*'],
            ],
          })
          .set('Accept', 'application/json')
          .expect('Content-Type', /json/)
          .expect(409)
          .end((err, res) => {
            if (err) {
              done(err);
            } else {
              should.not.exist(err);
              expect(res.body).to.deep.equal(expErrMsg);
              done();
            }
          });
      });
    });

    describe('POST /api/v1/jigsaw Failed with Exception 409', () => {
      let myStub;

      const expErrMsg = messageHelper.buildErrorResponse(
        puzzleController.CONTROLLER_NAME,
        'getSolutionPuzzle',
        {
          error: `Each description must contain minimum ${puzzleService.MINIMUM_LIMIT} characters and maximum ${puzzleService.MAXIMUM_LIMIT} characters`,
        },
      );

      before((done) => {
        myStub = sinon.stub(puzzleService, 'solvePuzzle').returns({
          error: `Each description must contain minimum ${puzzleService.MINIMUM_LIMIT} characters and maximum ${puzzleService.MAXIMUM_LIMIT} characters`,
        });
        done();
      });

      after((done) => {
        myStub.restore();
        done();
      });

      it(`POST /api/v1/jigsaw number of characters for each description must be greater than or equal ${puzzleService.MINIMUM_LIMIT}`, (done) => {
        request
          .post('/api/v1/jigsaw')
          .send({
            boardSize: 1,
            pieces: [
              [''],
            ],
          })
          .set('Accept', 'application/json')
          .expect('Content-Type', /json/)
          .expect(409)
          .end((err, res) => {
            if (err) {
              done(err);
            } else {
              should.not.exist(err);
              expect(res.body).to.deep.equal(expErrMsg);
              done();
            }
          });
      });

      it(`POST /api/v1/jigsaw number of characters for each description must be less than or equal ${puzzleService.MAXIMUM_LIMIT}`, (done) => {
        request
          .post('/api/v1/jigsaw')
          .send({
            boardSize: 1,
            pieces: [
              ['.*.*****...***'],
            ],
          })
          .set('Accept', 'application/json')
          .expect('Content-Type', /json/)
          .expect(409)
          .end((err, res) => {
            if (err) {
              done(err);
            } else {
              should.not.exist(err);
              expect(res.body).to.deep.equal(expErrMsg);
              done();
            }
          });
      });
    });

    describe('POST /api/v1/jigsaw Failed with Exception 409', () => {
      let myStub;

      const expErrMsg = messageHelper.buildErrorResponse(
        puzzleController.CONTROLLER_NAME,
        'getSolutionPuzzle',
        {
          error: 'Each description must contain only the following characters [.][*]',
        },
      );

      before((done) => {
        myStub = sinon.stub(puzzleService, 'solvePuzzle').returns({
          error: 'Each description must contain only the following characters [.][*]',
        });
        done();
      });

      after((done) => {
        myStub.restore();
        done();
      });

      it('POST /api/v1/jigsaw each description must contain only the following characters [.][*]', (done) => {
        request
          .post('/api/v1/jigsaw')
          .send({
            boardSize: 1,
            pieces: [
              ['*$.+d*f6'],
            ],
          })
          .set('Accept', 'application/json')
          .expect('Content-Type', /json/)
          .expect(409)
          .end((err, res) => {
            if (err) {
              done(err);
            } else {
              should.not.exist(err);
              expect(res.body).to.deep.equal(expErrMsg);
              done();
            }
          });
      });
    });

    describe('POST /api/v1/jigsaw Failed with Exception 409', () => {
      let myStub;

      const expErrMsg = messageHelper.buildErrorResponse(
        puzzleController.CONTROLLER_NAME,
        'getSolutionPuzzle',
        {
          error: 'Each description must contain minimum one character [*]',
        },
      );

      before((done) => {
        myStub = sinon.stub(puzzleService, 'solvePuzzle').returns({
          error: 'Each description must contain minimum one character [*]',
        });
        done();
      });

      after((done) => {
        myStub.restore();
        done();
      });

      it('POST /api/v1/jigsaw each description must contain minimum one character [*]', (done) => {
        request
          .post('/api/v1/jigsaw')
          .send({
            boardSize: 1,
            pieces: [
              ['......'],
            ],
          })
          .set('Accept', 'application/json')
          .expect('Content-Type', /json/)
          .expect(409)
          .end((err, res) => {
            if (err) {
              done(err);
            } else {
              should.not.exist(err);
              expect(res.body).to.deep.equal(expErrMsg);
              done();
            }
          });
      });
    });
  });
});
