# JWT Authentication Setup

This application uses JSON Web Tokens (JWT) for authentication. Follow these steps to set up JWT properly:

## Generating a Secure JWT Secret

You need a secure random string as your JWT secret. Here are several ways to generate one:

### Option 1: Using the provided script

```bash
node scripts/generate-jwt-secret.js
```

### Option 2: Using Node.js directly

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### Option 3: Using OpenSSL

```bash
openssl rand -hex 32
```

## Setting up your JWT Secret

1. Copy the generated secret
2. Open your `.env.local` file
3. Set the JWT_SECRET variable:

```
JWT_SECRET=your_generated_secret_here
```

## JWT Configuration Options

In your `.env.local` file, you can also configure:

- `JWT_EXPIRES_IN`: How long access tokens are valid (default: "1d" - one day)
- `REFRESH_TOKEN_EXPIRES_IN`: How long refresh tokens are valid (default: "7d" - seven days)

Example:
```
JWT_EXPIRES_IN=1h
REFRESH_TOKEN_EXPIRES_IN=30d
```

## Testing JWT Authentication

To test if your JWT setup is working:

1. Start the application
2. Try to log in with valid credentials
3. If you can access protected routes, your JWT setup is working correctly 