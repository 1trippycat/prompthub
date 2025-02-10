// Custom error class for API errors
class APIError extends Error {
 constructor(statusCode, message) {
   super(message);
   this.statusCode = statusCode;
   this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
   this.isOperational = true;

   Error.captureStackTrace(this, this.constructor);
 }
}

// Global error handling middleware
const errorHandler = (err, req, res, next) => {
 err.statusCode = err.statusCode || 500;
 err.status = err.status || 'error';

 if (process.env.NODE_ENV === 'development') {
   return res.status(err.statusCode).json({
     status: err.status,
     error: err,
     message: err.message,
     stack: err.stack
   });
 }

 // Production error handling
 if (err.isOperational) {
   // Operational errors - send message to client
   return res.status(err.statusCode).json({
     status: err.status,
     message: err.message
   });
 }

 // Programming or unknown errors - don't leak error details
 console.error('ERROR 💥:', err);
 return res.status(500).json({
   status: 'error',
   message: 'Something went wrong'
 });
};

// Not Found error handler
const notFound = (req, res, next) => {
 const err = new APIError(404, `Route ${req.originalUrl} not found`);
 next(err);
};

// MongoDB error handler
const handleMongoError = (err) => {
 if (err.name === 'CastError') {
   return new APIError(400, `Invalid ${err.path}: ${err.value}`);
 }
 if (err.code === 11000) {
   const value = err.errmsg.match(/(["'])(\\?.)*?\1/)[0];
   return new APIError(400, `Duplicate field value: ${value}`);
 }
 if (err.name === 'ValidationError') {
   const errors = Object.values(err.errors).map(el => el.message);
   return new APIError(400, `Invalid input data. ${errors.join('. ')}`);
 }
 return err;
};

// Rate limiting error handler
const handleRateLimitError = (err) => {
 if (err.status === 429) {
   return new APIError(429, 'Too many requests. Please try again later.');
 }
 return err;
};

export { 
 APIError, 
 errorHandler, 
 notFound, 
 handleMongoError, 
 handleRateLimitError 
};