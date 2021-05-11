'use strict';

function handleErrorResponse(controller, method, response) {
  response.status(500).send({
    code: 500,
    message: 'Internal Server Error',
    description: `Internal Application Error in ${controller}:${method}`
  });
}

module.exports = {
  handleErrorResponse
};
