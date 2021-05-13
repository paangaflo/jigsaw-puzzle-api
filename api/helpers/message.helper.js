function buildErrorResponse(nameController, nameMethod, result) {
  const jsonResultError = {
    code: 409,
    message: result.error,
    description: `Can't complete the request in ${nameController}:${nameMethod}`,
  };
  return jsonResultError;
}

function handleErrorResponse(nameController, nameMethod, response, result) {
  const jsonResultFailed = buildErrorResponse(nameController, nameMethod, result);
  response.status(409).send(jsonResultFailed);
}

module.exports = {
  buildErrorResponse, // Only test
  handleErrorResponse,
};
