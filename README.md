# Siddhartha Bank <img src="public/banking-hero.svg" alt="Siddhartha Bank Logo" width="30" align="center">

<div align="center">
  
  ![Next.js](https://img.shields.io/badge/Next.js%2014-000000?style=for-the-badge&logo=next.js&logoColor=white)
  ![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
  ![TailwindCSS](https://img.shields.io/badge/Tailwind%20CSS-06B6D4?style=for-the-badge&logo=tailwind-css&logoColor=white)
  ![MySQL](https://img.shields.io/badge/MySQL-4479A1?style=for-the-badge&logo=mysql&logoColor=white)
  
  <img src="public/banking-hero.svg" alt="Siddhartha Bank Logo" width="280"/>
  
  <h2>Modern Banking Platform Demo</h2>
  <p><em>Secure, responsive, and feature-rich banking experience built with cutting-edge technologies</em></p>
  
  <br />
  
  [✨ Features](#-features) • 
  [🛠️ Tech Stack](#️-tech-stack) • 
  [🚀 Getting Started](#-getting-started) • 
  [🔒 Security](#-security-features) • 
  [📱 Screenshots](#-screenshots)
  
</div>

<br />

## ✨ Features

<table>
  <tr>
    <td width="50%">
      <h3>🔐 Secure Authentication</h3>
      <ul>
        <li>JWT-based authentication</li>
        <li>Session management</li>
        <li>Password encryption</li>
      </ul>
    </td>
    <td width="50%">
      <h3>💼 Account Management</h3>
      <ul>
        <li>Multiple account types (Savings, Current)</li>
        <li>Real-time balance tracking</li>
        <li>Transaction history</li>
      </ul>
    </td>
  </tr>
  <tr>
    <td>
      <h3>💸 Money Transfers</h3>
      <ul>
        <li>Instant transfers between accounts</li>
        <li>Scheduled payments</li>
        <li>Transaction categorization</li>
      </ul>
    </td>
    <td>
      <h3>📊 Dashboard Analytics</h3>
      <ul>
        <li>Spending patterns</li>
        <li>Income tracking</li>
        <li>Category-wise analysis</li>
      </ul>
    </td>
  </tr>
</table>

<div style="background-color: #1E40AF; border-radius: 8px; padding: 15px; color: white; margin: 20px 0;">
  <h3 align="center">🎨 Modern UI/UX</h3>
  <ul align="center" style="list-style-position: inside;">
    <li>Responsive design for all devices</li>
    <li>Dark mode support</li>
    <li>Animated transitions</li>
  </ul>
</div>

<br />

## 🛠️ Tech Stack

- **Frontend**: Next.js 14, React, TypeScript, Tailwind CSS, Framer Motion
- **Backend**: Next.js API Routes
- **Database**: MySQL
- **Authentication**: JWT, bcrypt
- **State Management**: Zustand
- **Charts & UI**: Tremor, Headless UI
- **Styling**: Tailwind CSS, CSS Modules

<div style="background-color: #1E40AF; border-radius: 8px; padding: 15px; color: white; margin: 20px 0;">
  <p align="center"><em>Built with industry-standard technologies for optimal performance and scalability</em></p>
</div>

<br />

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ 
- MySQL 8.0+ or phpMyAdmin
- Git

### Setup Instructions

1. **Clone the repository**

```bash
git clone https://github.com/yourusername/siddharthabank.git
cd siddharthabank
```

2. **Install dependencies**

```bash
npm install
# or
yarn install
```

3. **Set up the database**

#### Option A: Using MySQL Command Line

Create a MySQL database and run the SQL script in `schema.sql` to set up the required tables:

```bash
mysql -u your_username -p your_database_name < schema.sql
```

#### Option B: Using phpMyAdmin

1. Open phpMyAdmin in your browser
2. Create a new database (e.g., `siddharthabank`)
3. Select the newly created database
4. Click on the "Import" tab
5. Click "Choose File" and select the `schema.sql` file from the project
6. Click "Go" to import the database schema

4. **Configure environment variables**

Create a `.env.local` file in the root directory with the following variables:

```
# IMPORTANT: Generate a unique JWT secret for your installation
# You can use this command: node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
JWT_SECRET=generate_a_unique_random_string_here

# Database Configuration - Update with your own values
MYSQL_HOST=localhost
MYSQL_USER=your_mysql_username
MYSQL_PASSWORD=your_mysql_password
MYSQL_DATABASE=siddharthabank

# Optional Configuration
NODE_ENV=development
```

> ⚠️ **IMPORTANT**: Always use a unique JWT_SECRET for each installation. Never reuse JWT secrets between different installations or environments.

5. **Run the development server**

```bash
npm run dev
# or
yarn dev
```

6. **Access the application**

Open [http://localhost:3000](http://localhost:3000) in your browser.

7. **Create a test user**

Register a new account through the application's registration page.

### Troubleshooting Common Issues

#### Database Connection Issues

If you encounter database connection errors:

1. Verify your database credentials in `.env.local`
2. Ensure your MySQL server is running
3. Check that the database exists and has the correct tables
4. If using a remote database, ensure the host allows connections from your IP

#### JWT Authentication Issues

If you experience login problems or "unauthorized" errors:

1. Make sure you're using a unique JWT_SECRET in your `.env.local` file
2. Clear your browser cookies and try logging in again
3. Check that the sessions table in your database is properly created

#### Persistent Login Issues

If you're still experiencing issues with authentication:

1. Clear your browser's local storage and cookies
2. Restart the development server
3. Ensure you're using the latest code from the repository

## 📁 Project Structure

<div style="background-color: #DBEAFE; border-radius: 8px; padding: 20px; margin: 20px 0;">

```
siddharthabank/
├── src/
│   ├── app/             # Next.js 14 App Router
│   ├── components/      # Reusable components
│   ├── lib/             # Utilities and helpers
│   ├── types/           # TypeScript types
│   └── providers/       # Context providers
├── public/              # Static assets
└── schema.sql           # Database schema
```

<p align="center"><em>Organized architecture designed for maintainability and scalability</em></p>
</div>

<br />

## 🔒 Security Features

- **Password Hashing**: All passwords are hashed using bcrypt
- **JWT Authentication**: Secure token-based authentication
- **HTTP-Only Cookies**: Prevents client-side access to tokens
- **Session Management**: Server-side session validation
- **Input Validation**: Prevents SQL injection and XSS attacks

## 🧪 Database Schema

The application uses the following main tables:

- **users**: Stores user information
- **accounts**: Manages bank accounts
- **transactions**: Records all financial transactions
- **sessions**: Handles user authentication sessions
- **notifications**: Stores user notifications

For the complete schema, refer to the `schema.sql` file.

## 📱 Screenshots

<div align="center">
  <p><em>Coming soon! The platform is currently under active development.</em></p>
</div>

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Next.js team for the amazing framework
- Tailwind CSS for the utility-first CSS framework
- Tremor for the beautiful dashboard components
- All open-source contributors whose libraries made this project possible

---

<div align="center">
  <img src="public/banking-hero.svg" alt="Siddhartha Bank Logo" width="60" />
  <h3>Siddhartha Bank</h3>
  <p>Developed with ❤️</p>
</div>