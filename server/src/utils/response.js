export const sendSuccess = (res, data = {}, message = 'Operation successful', statusCode = 200) => {
  return res.status(statusCode).json({
    success: true,
    data,
    message,
  });
};

export const sendError = (
  res,
  message = 'An unexpected error occurred',
  statusCode = 500,
  code = 'INTERNAL_SERVER_ERROR',
  details = null
) => {
  return res.status(statusCode).json({
    success: false,
    code,
    message,
    details,
  });
};
