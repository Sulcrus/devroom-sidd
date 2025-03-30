/**
 * Script to generate a secure JWT secret
 * Run with: node scripts/generate-jwt-secret.js
 */

const crypto = require('crypto');

// Generate a random 32-byte (256-bit) hex string
const jwtSecret = crypto.randomBytes(32).toString('hex');

console.log('\n=== JWT Secret Generator ===');
console.log('\nGenerated JWT Secret:');
console.log(jwtSecret);
console.log('\nAdd this to your .env.local file:');
console.log(`JWT_SECRET=${jwtSecret}`);
console.log('\n===========================\n'); 