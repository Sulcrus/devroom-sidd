export function generateAccountNumber(): string {
  // Generate a random 10-digit number
  const randomNum = Math.floor(Math.random() * 9000000000) + 1000000000;
  
  // Add bank identifier prefix (e.g., '22' for your bank)
  return `22${randomNum}`;
} 