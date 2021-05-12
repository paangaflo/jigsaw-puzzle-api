const { SolutionResponse } = require('../models/solution.response.model');

function solvePuzzle(params) {
  return new SolutionResponse(null);
}

module.exports = {
  solvePuzzle,
};
