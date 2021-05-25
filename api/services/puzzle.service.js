/* eslint no-param-reassign: 'error' */

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

function createMatrix(x, y) {
  const matrix = new Array(x);

  for (let i = 0; i < x; i += 1) {
    matrix[i] = new Array(y);
  }

  return matrix;
}

function permutator(elements, data, permutations) {
  let cur = data || [];
  const memo = data || [];

  for (let i = 0; i < elements.length; i += 1) {
    cur = elements.splice(i, 1);
    if (elements.length === 0) permutations.push(memo.concat([cur[0]]));
    permutator(elements.slice(), memo.concat([cur[0]]), permutations);
    elements.splice(i, 0, cur[0]);
  }

  return permutations;
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

function isPossibleLocatePieceInMatrix(point, matrix, piece, boardSize) {
  try {
    for (let i = 0; i < piece.length; i += 1) {
      const positions = piece[i].split('');

      for (let j = 0; j < positions.length; j += 1) {
        if ((point.x + i) >= boardSize) {
          return false;
        }
        if ((point.y + j) >= boardSize) {
          return false;
        }
        if (positions[j] === '*' && matrix[point.x + i][point.y + j] !== undefined) {
          return false;
        }
      }
    }

    return true;
  } catch (error) {
    return false;
  }
}

function locatePieceInMatrix(point, matrix, piece, label) {
  for (let i = 0; i < piece.length; i += 1) {
    const positions = piece[i].split('');

    for (let j = 0; j < positions.length; j += 1) {
      if (positions[j] === '*') {
        matrix[point.x + i][point.y + j] = label.toString();
      }
    }
  }
}

function getSolutionForPermutation(permutation, pieces, boardSize) {
  const matrix = createMatrix(boardSize, boardSize);

  for (let a = 0; a < permutation.length; a += 1) {
    const piece = pieces[permutation[a]];
    let located = false;

    for (let i = 0; i < boardSize; i += 1) {
      for (let j = 0; j < boardSize; j += 1) {
        const point = { x: i, y: j };

        if (isPossibleLocatePieceInMatrix(point, matrix, piece, boardSize)) {
          locatePieceInMatrix(point, matrix, piece, permutation[a]);
          located = true;
          i = boardSize;
          j = boardSize;
        }
      }
    }

    if (!located) return null;
  }

  return matrix;
}

function solvePuzzle(params) {
  try {
    validateInputRequest(params);
    const solutions = [];

    if (validateQuantitySpacesOccupies(params)) {
      const permutations = permutator([...Array(params.pieces.length).keys()], [], []);

      for (let i = 0; i < permutations.length; i += 1) {
        const solution = getSolutionForPermutation(
          permutations[i],
          params.pieces,
          params.boardSize
        );

        if (solution) {
          solution.forEach((line) => {
            solutions.push(line.toString());
          });
          break;
        }
      }
    }

    return new SolutionResponse(solutions.length > 0 ? solutions : null);
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
  createMatrix, // Only test
  permutator, // Only test
  solvePuzzle,
};
