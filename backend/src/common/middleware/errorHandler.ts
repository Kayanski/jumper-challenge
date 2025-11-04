import { ErrorRequestHandler, RequestHandler } from 'express';
import { StatusCodes } from 'http-status-codes';
import { env } from '../utils/envConfig';

const unexpectedRequest: RequestHandler = (_req, res) => {
  res.sendStatus(StatusCodes.NOT_FOUND);
};

const addErrorToRequestLog: ErrorRequestHandler = (error, _req, res, next) => {
  if (env.NODE_ENV === 'development') {
    next(error);
    return;
  }
  const status = error.status ? error.status : 500;
  const message = status === 500 ? 'Something went wrong, try again later' : error.message;
  const errors = error.error;
  res.status(status).send({ status, message, error: errors });

  next(error);
};

export default () => [unexpectedRequest, addErrorToRequestLog];
