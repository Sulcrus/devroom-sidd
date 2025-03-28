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
    <td width="50%" style="background-color: #DBEAFE; border-radius: 8px; padding: 15px;">
      <h3>🔐 Secure Authentication</h3>
      <ul>
        <li>JWT-based authentication</li>
        <li>Session management</li>
        <li>Password encryption</li>
      </ul>
    </td>
    <td width="50%" style="background-color: #DBEAFE; border-radius: 8px; padding: 15px;">
      <h3>💼 Account Management</h3>
      <ul>
        <li>Multiple account types (Savings, Current)</li>
        <li>Real-time balance tracking</li>
        <li>Transaction history</li>
      </ul>
    </td>
  </tr>
  <tr>
    <td style="background-color: #DBEAFE; border-radius: 8px; padding: 15px;">
      <h3>💸 Money Transfers</h3>
      <ul>
        <li>Instant transfers between accounts</li>
        <li>Scheduled payments</li>
        <li>Transaction categorization</li>
      </ul>
    </td>
    <td style="background-color: #DBEAFE; border-radius: 8px; padding: 15px;">
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

<table>
  <tr>
    <th style="background-color: #2563EB; color: white; border-radius: 8px 0 0 0;">Frontend</th>
    <th style="background-color: #2563EB; color: white;">Backend</th>
    <th style="background-color: #2563EB; color: white; border-radius: 0 8px 0 0;">Development</th>
  </tr>
  <tr>
    <td style="background-color: #DBEAFE; padding: 15px;">
      <ul>
        <li>Next.js 14</li>
        <li>TypeScript</li>
        <li>Tailwind CSS</li>
        <li>Framer Motion</li>
        <li>Tremor Charts</li>
      </ul>
    </td>
    <td style="background-color: #DBEAFE; padding: 15px;">
      <ul>
        <li>Next.js API Routes</li>
        <li>MySQL</li>
        <li>JWT Authentication</li>
        <li>bcrypt</li>
      </ul>
    </td>
    <td style="background-color: #DBEAFE; padding: 15px;">
      <ul>
        <li>ESLint</li>
        <li>Prettier</li>
        <li>Husky</li>
        <li>TypeScript</li>
      </ul>
    </td>
  </tr>
</table>

<div style="background-color: #1E40AF; border-radius: 8px; padding: 15px; color: white; margin: 20px 0;">
  <p align="center"><em>Built with industry-standard technologies for optimal performance and scalability</em></p>
</div>

<br />

## 🚀 Getting Started

<div style="background-color: #DBEAFE; border-radius: 8px; padding: 20px; margin: 20px 0;">
  <h3 align="center">Step-by-step setup guide</h3>

### 1. Clone the repository

```bash
git clone https://github.com/Sulcrus/siddharthabank.git
cd siddharthabank
```

### 2. Install dependencies

```bash
npm install
# or
yarn install
```

### 3. Set up MySQL database

```bash
# Create .env file with your database credentials
cp .env.example .env

import schema.sql in your database.
```

### 4. Run the development server

```bash
npm run dev
# or
yarn dev
```

### 5. Open [http://localhost:3000](http://localhost:3000)

</div>

<br />

## 📁 Project Structure

<div style="background-color: #DBEAFE; border-radius: 8px; padding: 20px; margin: 20px 0;">

```
siddharthabank/
├── src/
│   ├── app/             # Next.js 14 App Router
│   ├── components/      # Reusable components
│   ├── lib/            # Utilities and helpers
│   ├── types/          # TypeScript types
│   └── providers/      # Context providers
├── public/            # Static assets
└── prisma/           # Database schema
```

<p align="center"><em>Organized architecture designed for maintainability and scalability</em></p>
</div>

<br />

## 🔒 Security Features

<div style="background-color: #1E40AF; border-radius: 8px; padding: 15px; color: white; margin: 20px 0;">
  <h3 align="center">Enterprise-Grade Security</h3>
  
  <table align="center" style="margin: 0 auto; color: black;">
    <tr>
      <td align="center" style="background-color: #DBEAFE; border-radius: 8px; padding: 10px;"><h3>🔑</h3></td>
      <td style="background-color: white; border-radius: 8px; padding: 10px;">Password hashing with bcrypt</td>
      <td align="center" style="background-color: #DBEAFE; border-radius: 8px; padding: 10px;"><h3>🔒</h3></td>
      <td style="background-color: white; border-radius: 8px; padding: 10px;">JWT token authentication</td>
    </tr>
    <tr>
      <td align="center" style="background-color: #DBEAFE; border-radius: 8px; padding: 10px;"><h3>🍪</h3></td>
      <td style="background-color: white; border-radius: 8px; padding: 10px;">HTTP-only cookies</td>
      <td align="center" style="background-color: #DBEAFE; border-radius: 8px; padding: 10px;"><h3>🛡️</h3></td>
      <td style="background-color: white; border-radius: 8px; padding: 10px;">SQL injection prevention</td>
    </tr>
    <tr>
      <td align="center" style="background-color: #DBEAFE; border-radius: 8px; padding: 10px;"><h3>🔐</h3></td>
      <td style="background-color: white; border-radius: 8px; padding: 10px;">XSS protection</td>
      <td align="center" style="background-color: #DBEAFE; border-radius: 8px; padding: 10px;"><h3>🚨</h3></td>
      <td style="background-color: white; border-radius: 8px; padding: 10px;">CSRF protection</td>
    </tr>
  </table>
</div>

<br />

## 🎨 UI Components

<div style="background-color: #DBEAFE; border-radius: 8px; padding: 20px; margin: 20px 0;">
  <h3 align="center">Premium UI Components</h3>

  <ul align="center" style="list-style-position: inside;">
    <li><strong>Forms</strong>: Custom, responsive form components with validation</li>
    <li><strong>Navigation</strong>: Adaptive navigation with mobile support</li>
    <li><strong>Charts</strong>: Interactive financial data visualization</li>
    <li><strong>States</strong>: Elegant loading states and transitions</li>
    <li><strong>Notifications</strong>: Context-aware toast notifications</li>
    <li><strong>Modals</strong>: Accessible dialog components</li>
  </ul>
</div>

<br />

## 📱 Screenshots

<div style="background-color: #1E40AF; border-radius: 8px; padding: 15px; color: white; margin: 20px 0;">
  <div align="center">
    <h3>Visual Preview</h3>
    <p><em>Coming soon! The platform is currently under active development.</em></p>
  </div>
</div>

<br />

## 🧪 Trial Project Information

<div style="background-color: #DBEAFE; border-radius: 8px; padding: 20px; margin: 20px 0;">
  <div align="center">
    <h3>About This Project</h3>
    <p><em>A comprehensive demonstration of modern banking application development</em></p>
  </div>

  <p>This project was developed as a trial project for DevRoom, demonstrating:</p>

  <ul>
    <li>✅ Modern web development practices</li>
    <li>✅ Clean code architecture</li>
    <li>✅ Secure authentication implementation</li>
    <li>✅ Responsive UI/UX design</li>
    <li>✅ Real-time data handling</li>
    <li>✅ Database management</li>
  </ul>
</div>

<br />

## 📄 License

<div style="background-color: #DBEAFE; border-radius: 8px; padding: 15px; margin: 20px 0;">
  <p align="center">This project is licensed under the MIT License - see the <a href="LICENSE">LICENSE</a> file for details.</p>
</div>

<br />

## 🙏 Acknowledgments

<div style="background-color: #1E40AF; border-radius: 8px; padding: 20px; color: white; margin: 20px 0;">
  <div align="center">
    <h3>Special Thanks</h3>
    <p><em>With appreciation to the technologies that made this project possible</em></p>
    <a href="https://nextjs.org/" target="_blank" rel="noopener noreferrer">
      <img src="https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=next.js&logoColor=white" alt="Next.js" height="30" />
    </a>
    <a href="https://tailwindcss.com/" target="_blank" rel="noopener noreferrer">
      <img src="https://img.shields.io/badge/Tailwind%20CSS-06B6D4?style=for-the-badge&logo=tailwind-css&logoColor=white" alt="Tailwind CSS" height="30" />
    </a>
    <a href="https://www.tremor.so/" target="_blank" rel="noopener noreferrer">
      <img src="https://img.shields.io/badge/Tremor-3178C6?style=for-the-badge&logoColor=white" alt="Tremor" height="30" />
    </a>
    <a href="https://www.mysql.com/" target="_blank" rel="noopener noreferrer">
      <img src="https://img.shields.io/badge/MySQL-4479A1?style=for-the-badge&logo=mysql&logoColor=white" alt="MySQL" height="30" />
    </a>
  </div>
</div>

<br />

---

<div align="center" style="background-color: #DBEAFE; border-radius: 8px; padding: 20px; margin: 20px 0;">
  <img src="public/banking-hero.svg" alt="Siddhartha Bank Logo" width="60" />
  <h3>Siddhartha Bank</h3>
  <p>Developed with ❤️ by <a href="https://github.com/Sulcrus">Sulcrus</a></p>
  <p><em>Trial Project for DevRoom | Last Updated: 2025-03-15</em></p>
</div>
