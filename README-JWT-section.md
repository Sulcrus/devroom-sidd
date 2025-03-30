## Authentication Setup

This application uses JWT (JSON Web Tokens) for authentication.

### Setting up JWT

1. Generate a secure JWT secret:
   ```bash
   # Option 1: Using the provided script
   node scripts/generate-jwt-secret.js
   
   # Option 2: Using Node.js directly
   node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
   
   # Option 3: Using OpenSSL
   openssl rand -hex 32
   ```

2. Add the generated secret to your `.env.local` file:
   ```
   JWT_SECRET=your_generated_secret_here
   ```

3. Configure JWT expiration times (optional):
   ```
   JWT_EXPIRES_IN=1d
   REFRESH_TOKEN_EXPIRES_IN=7d
   ```

For more detailed instructions, see [JWT_SETUP.md](JWT_SETUP.md). 