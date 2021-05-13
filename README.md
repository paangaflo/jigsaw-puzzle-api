# Jigsaw puzzle api

API REST application to solve a puzzle. It is a API that exposes and endpoint POST /api/v1/jigsaw that will take as input a jiwsaw puzzle and respond with a solution, or say that no solution exists.

## Prerequisites

Before start you need to have installed:

* [Node.js](https://nodejs.org/download/) (version 10.24.1)
* [NPM](https://www.npmjs.com/) (version ^6.14.12)

## Getting Started

Clone repository to local environment.

```bash
git clone https://github.com/paangaflo/jigsaw-puzzle-api.git
```

## Installation

Inside root folder of your project run the following command:

```bash
npm install
```

## Use local environment

Run the following command to up the server and use endpoint API:

```bash
npm run start
```

You can consume the endpoint using the tool that you prefer or you can use any of the following [postman, insomnia, etc ..].

```bash
POST 127.0.0.1:100010/api/v1/jigsaw
```

You can also use the API web interface. In this case we use swagger-ui. ___Here you will find a more friendly documentation on all the exposed methods___

```bash
http://127.0.0.1:10010/api-docs/
```

## Sample Request #1

```json
{
  "boardSize": 4,
  "pieces": [
    [
      ".*",
      "**"
    ],
    [
      "*.",
      "**"
    ],
    [
      ".***",
      "..**",
      "***.",
      "**.."
    ]
  ]
}
```

In this case there is only one way to fill a 4x4 square with the given pieces, so the only correct response is:

```json
{
  "solution": [
    "1222",
    "1122",
    "2220",
    "2200"
  ]
}
```

## Sample Request #2

```json
{
  "boardSize": 4,
  "pieces": [
    [
      "***"
    ],
    [
      "*.",
      "**"
    ],
    [
      ".***",
      "..**",
      "***.",
      "**.."
    ]
  ]
}
```

Since there is no way to arrange the pieces to fill a 4x4 square, the correct response is:

```json
{
  "solution": null
}
```

## Sample Request #3

```json
{
  "boardSize": 3,
  "pieces": [
    [
      "***"
    ],
    [
      "***",
      "**."
    ]
  ]
}
```

In this case there are not solutions since we need to fill a 3x3 board, which has 9 spaces but the 2 pieces given can only occupy 8 spaces. The correct response is:

```json
{
  "solution": null
}
```

## Restrictions

The following restrictions will be met in the requests used:

* 1 <= boardSize <= 10
* 1 <= pieces.length <= 10
* 1 <= pieces[i].length <= 10
* 1 <= pieces[i][j].length <= 10
* There will be at least one '*' in every piece.

If any of the requirements is invalid, ___HTTP STATUS CODE___ will be 409 with any of these responses:

```json
[
  {
    "code": 409,
    "message": "boardSize attribute must be an integer between 1 and 10",
    "description": "Can't complete the request in [Puzzle Controller]:getSolutionPuzzle"
  },
  {
    "code": 409,
    "message": "`The number of pieces must be between 1 and 10",
    "description": "Can't complete the request in [Puzzle Controller]:getSolutionPuzzle"
  },
  {
    "code": 409,
    "message": "Each piece must contain minimum 1 descriptions and maximum 10 descriptions",
    "description": "Can't complete the request in [Puzzle Controller]:getSolutionPuzzle"
  },
  {
    "code": 409,
    "message": "Each description must contain minimum 1 characters and maximum 10 characters",
    "description": "Can't complete the request in [Puzzle Controller]:getSolutionPuzzle"
  },
  {
    "code": 409,
    "message": "Each description must contain only the following characters [.][*]",
    "description": "Can't complete the request in [Puzzle Controller]:getSolutionPuzzle"
  },
  {
    "code": 409,
    "message": "Each description must contain minimum one character [*]",
    "description": "Can't complete the request in [Puzzle Controller]:getSolutionPuzzle"
  }
]
```

In case of finding a server error, ___HTTP STATUS CODE___ will be 500 with the following response:

```json
{
  "code": 500,
  "message": "Internal Server Error",
  "description": "Internal Application Error in [Puzzle Controller]:getSolutionPuzzle"
}
```

A saggwer functionality is used to verify that structure of input request has expected specification. Otherwise; ___HTTP STATUS CODE___ will be 400 with something like the following:

```json
{
  "message": "Response validation failed: failed schema validation",
  "code": "SCHEMA_VALIDATION_FAILED",
  "failedValidation": true,
  "results": {
    "errors": [
      {
        "code": "INVALID_TYPE",
        "message": "Expected type number but found type string",
        "path": [
          "code"
        ]
      }
    ],
    "warnings": []
  },
  "originalResponse": "..."
}
```

## Demo

The project is deployed in a cloud environment on the Heroku platform. These are the links:

```bash
API  https://jigsaw-puzzle-api.herokuapp.com/api/v1/jigsaw
DOCS https://jigsaw-puzzle-api.herokuapp.com/api-docs/
```

## Unit test

Run unit tests with the following command:

```bash
npm run test
```
![alt text](https://github.com/paangaflo/jigsaw-puzzle-ap/blob/master/images/capture_test.png?raw=true)

## Coverage unit test

To see percentage of code coverage on unit tests use the following command:

```bash
npm run cover
```
![alt text](https://github.com/paangaflo/jigsaw-puzzle-ap/blob/master/images/capture_coverage.png?raw=true)

## Eslint

To improve code style, ESLint. Use following command:

```bash
npm run cover
```
![alt text](https://github.com/paangaflo/jigsaw-puzzle-ap/blob/master/images/capture_lint.png?raw=true)

## Prettier

To improve code formatter, Prettier. Use following command:

```bash
npm run format
```
![alt text](https://github.com/paangaflo/jigsaw-puzzle-ap/blob/master/images/capture_format.png?raw=true)

## Built With

* [Node.js](https://nodejs.org/download/)
* [NPM](https://www.npmjs.com/)

## External dependencies

* [express](https://www.npmjs.com/package/express)
* [lodash.isundefined](https://www.npmjs.com/package/lodash.isundefined)
* [swagger-express-mw](https://www.npmjs.com/package/swagger-express-mw)
* [swagger-ui-express](https://www.npmjs.com/package/swagger-ui-express)
* [yamljs]https://www.npmjs.com/package/yamljs)

## Authors

* **Pablo Galvis** - [paangaflo](https://github.com/paangaflo)

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details
