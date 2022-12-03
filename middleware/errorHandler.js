const NotFound = (req, res, next) => {
  const error = new Error(`404 Page Not found - ${req.originalUrl}`);
  next(error);
};

const ErrorHandler = (err, req, res, next) => {
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;

  return res
    .status(statusCode)
    .json({ message: err.message, stack: err.stack });
};

export { NotFound, ErrorHandler };
