const { SolutionResponse } = require('../models/solution.response.model');
const { RestrictionException } = require('../exeptions/restriction.exception');

const MINIMUM_LIMIT = process.env.MINIMUM_LIMIT || 1;
const MAXIMUM_LIMIT = process.env.MAXIMUM_LIMIT || 10;

function countCharacterInString(value, regex) {
  return (value.match(regex) || []).length;
}

function numberBetweenRange(value) {
  return value >= MINIMUM_LIMIT && value <= MAXIMUM_LIMIT;
}

function validateInputRequest(params) {
  if (!numberBetweenRange(params.boardSize)) {
    throw new RestrictionException(
      `boardSize attribute must be an integer between ${MINIMUM_LIMIT} and ${MAXIMUM_LIMIT}`
    );
  }

  if (!numberBetweenRange(params.pieces.length)) {
    throw new RestrictionException(
      `The number of pieces must be between ${MINIMUM_LIMIT} and ${MAXIMUM_LIMIT}`
    );
  }

  params.pieces.forEach((piece) => {
    if (!numberBetweenRange(piece.length)) {
      throw new RestrictionException(
        `Each piece must contain minimum ${MINIMUM_LIMIT} descriptions and maximum ${MAXIMUM_LIMIT} descriptions`
      );
    }
    piece.forEach((description) => {
      if (!numberBetweenRange(description.length)) {
        throw new RestrictionException(
          `Each description must contain minimum ${MINIMUM_LIMIT} characters and maximum ${MAXIMUM_LIMIT} characters`
        );
      }
      if (!/^[.*]*$/.test(description)) {
        throw new RestrictionException(
          'Each description must contain only the following characters [.][*]'
        );
      }
      if (!description.includes('*')) {
        throw new RestrictionException(
          'Each description must contain minimum one character [*]'
        );
      }
    });
  });
}

function validateQuantitySpacesOccupies(params) {
  const matrizlength = params.boardSize * params.boardSize;
  let spacesOccupies = 0;

  params.pieces.forEach((piece) => {
    piece.forEach((description) => {
      spacesOccupies = countCharacterInString(description, /\*/g) + spacesOccupies;
    });
  });

  return matrizlength === spacesOccupies;
}

function createPiece(piece, label) {
  const rows = [];

  for (let i = 0; i < piece.length; i += 1) {
    const characters = piece[i].split('' || []);
    const cols = [];
    for (let j = 0; j < characters.length; j += 1) {
      cols[j] = characters[j] === '*' ? label : 'x';
    }
    rows.push(cols);
  }

  return rows;
}

function calculeSolution(pieces, puzzle, boardSize) {
  return [];
}

function buildPuzzle(params) {
  const puzzle = [];
  const pieces = [];

  for (let i = 0; i < params.pieces.length; i += 1) {
    pieces[i] = createPiece(params.pieces[i], i);
  }

  return calculeSolution(pieces, puzzle, params.boardSize);
}

function solvePuzzle(params) {
  try {
    validateInputRequest(params);

    if (validateQuantitySpacesOccupies(params)) {
      return new SolutionResponse(buildPuzzle(params));
    }

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
  MAXIMUM_LIMIT, // Only test
  MINIMUM_LIMIT, // Only test
  validateQuantitySpacesOccupies, // Only test
  validateInputRequest, // Only test
  solvePuzzle,
};
