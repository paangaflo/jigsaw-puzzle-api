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

function permutator(input) {
  const result = [];

  function permute(arr, data) {
    var cur, memo = data || [];

    for (let i = 0; i < arr.length; i += 1) {
      cur = arr.splice(i, 1)[0];
      if (arr.length === 0) result.push(memo.concat([cur]));
      permute(arr.slice(), memo.concat([cur]));
      arr.splice(i, 0, cur);
    }

    return result;
  }

  return permute(input);
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

function findFreeSpaceInRow(matrix, row, boardSize) {
  for (let j = 0; j < boardSize; j += 1) {
    if (matrix[row][j] === undefined) return { x: row, y: j };
  }

  return null;
}

function locatePieceInRow(point, matrix, line, label) {
  try {
    const positions = line.split('');

    for (let i = 0; i < positions.length; i += 1) {
      if (positions[i] === '*') matrix[point.x][point.y + i] = label.toString();
    }

    return true;
  } catch (error) {
    return false;
  }
}

function getSolutionForPermutation(permutation, pieces, boardSize) {
  const matrix = createMatrix(boardSize, boardSize);

  for (let i = 0; i < permutation.length; i += 1) {
    for (let j = 0; j < boardSize; j += 1) {
      if (pieces[permutation[i]][j]) {
        const point = findFreeSpaceInRow(matrix, j, boardSize);

        const isPossible = locatePieceInRow(point, matrix, pieces[permutation[i]][j], 'X');
        if (!isPossible) return null;
      }
    }
  }

  return matrix;
}

function solvePuzzle(params) {
  try {
    validateInputRequest(params);
    const solutions = [];

    if (validateQuantitySpacesOccupies(params)) {
      const permutations = permutator([...Array(params.pieces.length).keys()]);

      for (let i = 0; i < permutations.length; i += 1) {
        const solution = getSolutionForPermutation(
          permutations[i],
          params.pieces,
          params.boardSize
        );

        if (solution) solution.push(solution);
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
  solvePuzzle,
};
