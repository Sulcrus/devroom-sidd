import { query } from '../lib/mysql';

async function testConnection() {
  try {
    console.log('Testing database connection...');
    const result = await query({ query: 'SELECT 1 as test' });
    console.log('✅ Database connection successful!');
    console.log(result);
    process.exit(0);
  } catch (error) {
    console.error('❌ Database connection failed:');
    console.error(error);
    process.exit(1);
  }
}

testConnection(); 