function handleErrorResponse(controller, method, response, result) {
  response.status(409).send({
    code: 409,
    message: result.error,
    description: `Can't complete the request in ${controller}:${method}`,
  });
}

module.exports = {
  handleErrorResponse,
};
