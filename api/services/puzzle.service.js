const { SolutionResponse } = require('../models/solution.response.model');

const MINIMUM_LIMIT = process.env.MINIMUM_LIMIT || 1;
const MAXIMUM_LIMIT = process.env.MAXIMUM_LIMIT || 10;

function RestrictionException(message) {
  this.message = message;
}

function numberBetweenRange(value) {
  return value >= MINIMUM_LIMIT && value <= MAXIMUM_LIMIT;
}

function validateInputRequest(params) {
  if (!numberBetweenRange(params.boardSize)) {
    throw new RestrictionException(
      `boardSize attribute must be an integer between ${MINIMUM_LIMIT} and ${MAXIMUM_LIMIT}`,
    );
  }

  if (!numberBetweenRange(params.pieces.length)) {
    throw new RestrictionException(
      `The number of pieces must be between ${MINIMUM_LIMIT} and ${MAXIMUM_LIMIT}`,
    );
  }

  params.pieces.forEach((piece) => {
    if (!numberBetweenRange(piece.length)) {
      throw new RestrictionException(
        `Each piece must contain minimum ${MINIMUM_LIMIT} descriptions and maximum ${MAXIMUM_LIMIT} descriptions`,
      );
    }
    piece.forEach((description) => {
      if (!numberBetweenRange(description.length)) {
        throw new RestrictionException(
          `Each description must contain minimum ${MINIMUM_LIMIT} characters and maximum ${MAXIMUM_LIMIT} characters`,
        );
      }
      if (!(/^[.*]*$/).test(description)) {
        throw new RestrictionException(
          'Each description must contain only the following characters [.][*]',
        );
      }
      if (!description.includes('*')) {
        throw new RestrictionException(
          'Each description must contain minimum one character [*]',
        );
      }
    });
  });
}

function solvePuzzle(params) {
  try {
    validateInputRequest(params);
    return new SolutionResponse(null);
  } catch (error) {
    if (error instanceof RestrictionException) {
      return {
        error: error.message,
      };
    }

    throw error;
  }
}

module.exports = {
  solvePuzzle,
};
