const SwaggerExpress = require('swagger-express-mw');
const swaggerUi = require('swagger-ui-express');
const yamljs = require('yamljs');

const app = require('express')();

module.exports = app;

const config = {
  appRoot: __dirname,
};

const swaggerDocument = yamljs.load('./api/swagger/swagger.yaml');

SwaggerExpress.create(config, (err, swaggerExpress) => {
  if (err) { throw err; }

  swaggerExpress.register(app);

  app.listen(process.env.PORT || 10010);
});

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
