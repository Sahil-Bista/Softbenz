export const globalErrorHandler = async (err, req, res, next) => {
  console.log(err.stack);

  return res.status(err.status || 500).json({
    status: 'error',
    message: err.message || 'something went wrong',
  });
};
