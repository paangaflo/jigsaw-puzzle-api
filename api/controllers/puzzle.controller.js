const isUndefined = require('lodash.isundefined');
const controllerHelper = require('../helpers/controller.helper');
const messageHelper = require('../helpers/message.helper');
const puzzleService = require('../services/puzzle.service');

const CONTROLLER_NAME = '[Puzzle Controller]';

function getSolutionPuzzle(request, response) {
  try {
    const params = request.body;
    const result = puzzleService.solvePuzzle(params);

    if (!isUndefined(result) && isUndefined(result.error)) {
      response.status(200).json(result);
    } else {
      messageHelper.handleErrorResponse(CONTROLLER_NAME, 'getSolutionPuzzle', response, result);
    }
  } catch (error) {
    controllerHelper.handleErrorResponse(CONTROLLER_NAME, 'getSolutionPuzzle', response);
  }
}

module.exports = {
  getSolutionPuzzle,
  CONTROLLER_NAME,
};
