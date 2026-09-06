import morgan from 'morgan';

/**
 * Standard HTTP request logger middleware
 */
export const requestLogger = morgan('dev');
