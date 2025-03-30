-- Users table
CREATE TABLE IF NOT EXISTS users (
  id VARCHAR(36) PRIMARY KEY,
  username VARCHAR(50) UNIQUE NOT NULL,
  first_name VARCHAR(50) NOT NULL,
  last_name VARCHAR(50) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  phone VARCHAR(20),
  date_of_birth DATE,
  gender ENUM('male', 'female', 'other'),
  marital_status ENUM('single', 'married', 'divorced', 'widowed'),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Addresses table
CREATE TABLE IF NOT EXISTS addresses (
  id VARCHAR(36) PRIMARY KEY,
  user_id VARCHAR(36) NOT NULL,
  street VARCHAR(255),
  city VARCHAR(100),
  state VARCHAR(100),
  postal_code VARCHAR(20),
  country VARCHAR(100) DEFAULT 'Nepal',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Accounts table
CREATE TABLE IF NOT EXISTS accounts (
  id VARCHAR(36) PRIMARY KEY,
  user_id VARCHAR(36) NOT NULL,
  account_number VARCHAR(20) UNIQUE NOT NULL,
  account_type ENUM('savings', 'checking', 'business') NOT NULL,
  balance DECIMAL(15, 2) NOT NULL DEFAULT 0.00,
  currency VARCHAR(3) NOT NULL DEFAULT 'USD',
  status ENUM('active', 'inactive', 'frozen') NOT NULL DEFAULT 'active',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Monthly Statistics table
CREATE TABLE IF NOT EXISTS monthly_statistics (
  id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
  user_id VARCHAR(36) NOT NULL,
  type ENUM('income', 'spending') NOT NULL,
  amount DECIMAL(15, 2) NOT NULL DEFAULT 0,
  month INT NOT NULL,
  year INT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Transaction Categories table
CREATE TABLE IF NOT EXISTS transaction_categories (
  id VARCHAR(36) PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  icon VARCHAR(50),
  color VARCHAR(50),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Notifications table
CREATE TABLE IF NOT EXISTS notifications (
  id VARCHAR(36) PRIMARY KEY,
  user_id VARCHAR(36) NOT NULL,
  title VARCHAR(255) NOT NULL,
  message TEXT NOT NULL,
  type ENUM('success', 'warning', 'error', 'info') NOT NULL,
  `read` BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Transactions table
CREATE TABLE IF NOT EXISTS transactions (
  id VARCHAR(36) PRIMARY KEY,
  from_account_id VARCHAR(36),
  to_account_id VARCHAR(36),
  amount DECIMAL(15, 2) NOT NULL,
  type ENUM('transfer', 'deposit', 'withdrawal') NOT NULL,
  status ENUM('pending', 'completed', 'failed') NOT NULL DEFAULT 'pending',
  description TEXT,
  reference_number VARCHAR(20) NOT NULL,
  category_id VARCHAR(36),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (from_account_id) REFERENCES accounts(id) ON DELETE SET NULL,
  FOREIGN KEY (to_account_id) REFERENCES accounts(id) ON DELETE SET NULL,
  FOREIGN KEY (category_id) REFERENCES transaction_categories(id) ON DELETE SET NULL
);

-- Transfers table
CREATE TABLE IF NOT EXISTS transfers (
  id VARCHAR(36) PRIMARY KEY,
  from_account_id VARCHAR(36) NOT NULL,
  to_account_id VARCHAR(36) NOT NULL,
  amount DECIMAL(15, 2) NOT NULL,
  status ENUM('pending', 'completed', 'failed') NOT NULL DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (from_account_id) REFERENCES accounts(id) ON DELETE CASCADE,
  FOREIGN KEY (to_account_id) REFERENCES accounts(id) ON DELETE CASCADE
);

-- Payments table
CREATE TABLE IF NOT EXISTS payments (
  id VARCHAR(36) PRIMARY KEY,
  user_id VARCHAR(36) NOT NULL,
  account_id VARCHAR(36) NOT NULL,
  amount DECIMAL(15, 2) NOT NULL,
  type VARCHAR(50) NOT NULL,
  reference_number VARCHAR(20) NOT NULL,
  status ENUM('pending', 'completed', 'failed') NOT NULL DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (account_id) REFERENCES accounts(id) ON DELETE CASCADE
);

-- Refresh Tokens table
CREATE TABLE IF NOT EXISTS refresh_tokens (
  id VARCHAR(36) PRIMARY KEY,
  user_id VARCHAR(36) NOT NULL,
  token VARCHAR(255) NOT NULL,
  expires_at TIMESTAMP NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Insert default transaction categories
INSERT IGNORE INTO transaction_categories (id, name, icon, color) VALUES
  (UUID(), 'Food & Dining', 'utensils', 'emerald'),
  (UUID(), 'Shopping', 'shopping-bag', 'rose'),
  (UUID(), 'Housing', 'home', 'amber'),
  (UUID(), 'Transportation', 'car', 'blue'),
  (UUID(), 'Entertainment', 'film', 'indigo'),
  (UUID(), 'Healthcare', 'heart', 'purple'),
  (UUID(), 'Education', 'book', 'cyan'),
  (UUID(), 'Utilities', 'lightbulb', 'yellow'),
  (UUID(), 'Travel', 'plane', 'green'),
  (UUID(), 'Other', 'ellipsis-h', 'gray'); 