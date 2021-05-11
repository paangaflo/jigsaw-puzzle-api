'use strict';

const { SolutionResponse }  = require('../models/solution.response.model');

function solvePuzzle(params) {
    let solution = new SolutionResponse(
        null
    );

    return solution;
}

module.exports = {
    solvePuzzle
};
