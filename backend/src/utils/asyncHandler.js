// Wraps async route handlers to forward errors to the global error handler
export const asyncHandler = (requestHandler) => (req, res, next) => {
  Promise.resolve(requestHandler(req, res, next)).catch(next);
};
