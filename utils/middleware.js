const logger = require("./logger");

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: "unknown endpoint" });
};

const loggerHandler = (req, res, next) => {
  logger.info("------------------------------------");
  logger.info(`Method: ${req.method}`);
  logger.info(`Path: "${req.path}"`);
  logger.info(`Body: ${JSON.stringify(req.body)}`);
  next();
};

const errorHandler = (error, req, res, next) => {
  logger.error("Error: ===> " + error.message);

  if (error.name === "CastError") {
    return res.status(400).send({ error: "malformatted id" });
  }

  if (error.name === "ValidationError") {
    return res.status(400).json({ error: error.message });
  }

  next(error);
};

module.exports = { unknownEndpoint, loggerHandler, errorHandler };
