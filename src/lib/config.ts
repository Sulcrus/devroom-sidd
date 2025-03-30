// Configuration variables for the application
const config = {
  // Database configuration
  database: {
    url: process.env.DATABASE_URL,
    host: process.env.DATABASE_HOST || 'localhost',
    port: parseInt(process.env.DATABASE_PORT || '3306', 10),
    name: process.env.DATABASE_NAME || 'banking_app',
    user: process.env.DATABASE_USER || 'root',
    password: process.env.DATABASE_PASSWORD || 'password',
  },
  
  // JWT configuration
  jwt: {
    secret: process.env.JWT_SECRET || 'your-256-bit-secret',
    expiresIn: process.env.JWT_EXPIRES_IN || '1d',
    refreshTokenExpiresIn: process.env.REFRESH_TOKEN_EXPIRES_IN || '7d',
  },
  
  // API configuration
  api: {
    url: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api',
  },
};

export default config; 