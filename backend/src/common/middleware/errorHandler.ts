import { ErrorRequestHandler, RequestHandler } from 'express';
import { StatusCodes } from 'http-status-codes';
import { env } from '../utils/envConfig';

export const PROD_ERROR_MESSAGE = "Something went wrong, try again later"

const unexpectedRequest: RequestHandler = (_req, res) => {
  res.sendStatus(StatusCodes.NOT_FOUND);
};

const addErrorToRequestLog: ErrorRequestHandler = (error, _req, res, next) => {
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
