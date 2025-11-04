import { ErrorRequestHandler, RequestHandler } from 'express';
import { StatusCodes } from 'http-status-codes';
import { env } from '../utils/envConfig';
import { AlchemyQueryError } from '../evm/alchemyTokenQueries';

export const PROD_ERROR_MESSAGE = "Something went wrong, try again later"

const unexpectedRequest: RequestHandler = (_req, res) => {
  res.sendStatus(StatusCodes.NOT_FOUND);
};

const addErrorToRequestLog: ErrorRequestHandler = (error, _req, res, next) => {

  if (error instanceof AlchemyQueryError) {
    // Custom logic to handle AlchemyQueryErrors
    // Not implemented during this challenge, but we could log specific details, create a monitoring alert based on the count of those errors, etc..
  }
  if (['development'].includes(env.NODE_ENV)) {
    next(error);
    return;
  }
  const status = error.status ? error.status : 500;
  const message = status === 500 ? PROD_ERROR_MESSAGE : error.message;
  const errors = error.error;
  res.status(status).send({ status, message, error: errors });

  next(error);
};

export default () => [unexpectedRequest, addErrorToRequestLog];
