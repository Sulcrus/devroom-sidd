// Environment configuration with fallbacks for safety
const config = {
  database: {
    host: process.env.MYSQL_HOST || 'localhost',
    user: process.env.MYSQL_USER || 'root',
    password: process.env.MYSQL_PASSWORD || '',
    name: process.env.MYSQL_DATABASE || 'siddharthabank',
  },
  auth: {
    jwtSecret: process.env.JWT_SECRET || 'development_only_secret',
    tokenExpiry: '7d',
  },
  server: {
    port: process.env.PORT || 3000,
    nodeEnv: process.env.NODE_ENV || 'development',
  }
};

// Warn if using default JWT secret in production
if (config.server.nodeEnv === 'production' && config.auth.jwtSecret === 'development_only_secret') {
  console.warn('WARNING: Using default JWT secret in production. Set JWT_SECRET environment variable.');
}

export default config; 