function buildErrorResponse(nameController, nameMethod) {
  const jsonResultFailed = {
    code: 500,
    message: 'Internal Server Error',
    description: `Internal Application Error in ${nameController}:${nameMethod}`,
  };
  return jsonResultFailed;
}

function handleErrorResponse(nameController, nameMethod, response) {
  const jsonResultFailed = buildErrorResponse(nameController, nameMethod);
  response.status(500).send(jsonResultFailed);
}

module.exports = {
  buildErrorResponse, // Only test
  handleErrorResponse,
};
