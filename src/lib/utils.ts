export function generateAccountNumber(): string {
  const bankCode = '1234'; // Your bank's code
  const branchCode = '001'; // Branch code
  const random = Math.floor(Math.random() * 100000000).toString().padStart(8, '0');
  const accountNumber = `${bankCode}${branchCode}${random}`;
  
  // Add check digit using Luhn algorithm
  let sum = 0;
  let isEven = false;
  
  for (let i = accountNumber.length - 1; i >= 0; i--) {
    let digit = parseInt(accountNumber[i]);
    
    if (isEven) {
      digit *= 2;
      if (digit > 9) {
        digit -= 9;
      }
    }
    
    sum += digit;
    isEven = !isEven;
  }
  
  const checkDigit = ((Math.floor(sum / 10) + 1) * 10 - sum) % 10;
  return `${accountNumber}${checkDigit}`;
}

export function generateUsername(firstName: string, lastName: string): string {
  // Remove special characters and spaces
  const cleanFirst = firstName.toLowerCase().replace(/[^a-z0-9]/g, '');
  const cleanLast = lastName.toLowerCase().replace(/[^a-z0-9]/g, '');
  
  // Create base username
  const baseUsername = `${cleanFirst}${cleanLast}`;
  
  // Add random number if needed
  const randomNum = Math.floor(Math.random() * 1000);
  return `${baseUsername}${randomNum}`;
}

export function generateReferenceNumber(): string {
  const prefix = 'TXN';
  const timestamp = Date.now().toString().slice(-6);
  const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
  return `${prefix}${timestamp}${random}`;
} 