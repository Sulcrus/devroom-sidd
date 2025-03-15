# Siddhartha Bank <img src="public/banking-hero.svg" alt="Siddhartha Bank Logo" width="30" align="center">

<div align="center">
  
  ![Next.js](https://img.shields.io/badge/Next.js%2014-000000?style=for-the-badge&logo=next.js&logoColor=white)
  ![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
  ![TailwindCSS](https://img.shields.io/badge/Tailwind%20CSS-06B6D4?style=for-the-badge&logo=tailwind-css&logoColor=white)
  ![MySQL](https://img.shields.io/badge/MySQL-4479A1?style=for-the-badge&logo=mysql&logoColor=white)
  
  <img src="public/banking-hero.svg" alt="Siddhartha Bank Logo" width="280"/>
  
  <h2>Modern Banking Platform Demo</h2>
  <p><em>"Managing your finances with the precision of Ichikawa's thoughts"</em></p>
  
  <br />
  
  [✨ Features](#-features) • 
  [🛠️ Tech Stack](#️-tech-stack) • 
  [🚀 Getting Started](#-getting-started) • 
  [🔒 Security](#-security-features) • 
  [📱 Screenshots](#-screenshots)
  
</div>

<br />

<div style="background-color: #1E40AF; border-radius: 8px; padding: 20px; color: white; margin: 20px 0;">
  <h2 align="center">💙 Our Banking Philosophy 💙</h2>
  <p align="center"><em>"Like Yamada's smile brightening Ichikawa's day, we aim to make your financial journey just as heartwarming."</em></p>
</div>

## ✨ Features

<table>
  <tr>
    <td width="50%" style="background-color: #DBEAFE; border-radius: 8px; padding: 15px;">
      <h3>🔐 Secure Authentication</h3>
      <ul>
        <li>JWT-based authentication as reliable as Ichikawa's feelings for Yamada</li>
        <li>Session management that never wavers</li>
        <li>Password encryption stronger than Yamada's determination</li>
      </ul>
    </td>
    <td width="50%" style="background-color: #DBEAFE; border-radius: 8px; padding: 15px;">
      <h3>💼 Account Management</h3>
      <ul>
        <li>Multiple account types (as versatile as the library committee)</li>
        <li>Real-time balance tracking (more accurate than Ichikawa's observations)</li>
        <li>Transaction history that never forgets</li>
      </ul>
    </td>
  </tr>
  <tr>
    <td style="background-color: #DBEAFE; border-radius: 8px; padding: 15px;">
      <h3>💸 Money Transfers</h3>
      <ul>
        <li>Instant transfers between accounts (faster than Ichikawa's heartbeat near Yamada)</li>
        <li>Scheduled payments (more reliable than the bookstore schedule)</li>
        <li>Transaction categorization (organized like Yamada's photoshoots)</li>
      </ul>
    </td>
    <td style="background-color: #DBEAFE; border-radius: 8px; padding: 15px;">
      <h3>📊 Dashboard Analytics</h3>
      <ul>
        <li>Spending patterns (clearer than Ichikawa's internal monologues)</li>
        <li>Income tracking (more consistent than Nanjou's mood)</li>
        <li>Category-wise analysis (detailed as Adachi's manga drawings)</li>
      </ul>
    </td>
  </tr>
</table>

<div style="background-color: #1E40AF; border-radius: 8px; padding: 15px; color: white; margin: 20px 0;">
  <h3 align="center">🎨 Modern UI/UX</h3>
  <p align="center"><em>"Our interface transitions are smoother than Ichikawa's journey from dark thoughts to wholesome love."</em></p>
  <ul align="center" style="list-style-position: inside;">
    <li>Responsive design (adapts like Yamada to any situation)</li>
    <li>Dark mode support (for your inner Ichikawa)</li>
    <li>Animated transitions (as heartwarming as BokuYaba's character development)</li>
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
  <p align="center"><em>"Our code is as neat as the library when Ichikawa and Yamada are on duty."</em></p>
</div>

<br />

## 🚀 Getting Started

<div style="background-color: #DBEAFE; border-radius: 8px; padding: 20px; margin: 20px 0;">
  <h3 align="center">Step-by-step setup guide</h3>
  <p align="center"><em>"Follow these steps as carefully as Ichikawa follows Yamada's social media updates!"</em></p>

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

# Run migrations
npx prisma migrate dev
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

<p align="center"><em>"Our project structure is more organized than the bookstore where Ichikawa first met Yamada."</em></p>
</div>

<br />

## 🔒 Security Features

<div style="background-color: #1E40AF; border-radius: 8px; padding: 15px; color: white; margin: 20px 0;">
  <h3 align="center">Security You Can Trust</h3>
  <p align="center"><em>"Our security is as intense as Ichikawa's protective instincts around Yamada."</em></p>
  
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
  <h3 align="center">Beautiful Components</h3>
  <p align="center"><em>"Our UI components are as aesthetically pleasing as Yamada's modeling photos."</em></p>

  <ul align="center" style="list-style-position: inside;">
    <li><strong>Forms</strong>: Custom, responsive form components with validation (as meticulous as Ichikawa's book organization)</li>
    <li><strong>Navigation</strong>: Adaptive navigation with mobile support (as reliable as Yamada appearing at the bookstore)</li>
    <li><strong>Charts</strong>: Interactive financial data visualization (more colorful than Adachi's illustrations)</li>
    <li><strong>States</strong>: Elegant loading states and transitions (smoother than Ichikawa's character development)</li>
    <li><strong>Notifications</strong>: Context-aware toast notifications (as timely as Moe's commentary)</li>
    <li><strong>Modals</strong>: Accessible dialog components (as engaging as Yamada and Ichikawa's conversations)</li>
  </ul>
</div>

<br />

## 📱 Screenshots

<div style="background-color: #1E40AF; border-radius: 8px; padding: 15px; color: white; margin: 20px 0;">
  <div align="center">
    <h3>Visual Preview</h3>
    <p><em>"Coming soon! The platform is currently under active development - we're drawing it with the care Adachi puts into her manga!"</em></p>
  </div>
</div>

<br />

## 🧪 Trial Project Information

<div style="background-color: #DBEAFE; border-radius: 8px; padding: 20px; margin: 20px 0;">
  <div align="center">
    <h3>About This Project</h3>
    <p><em>"This project evolved like Ichikawa's feelings - from simple concepts to something beautiful."</em></p>
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
  <p align="center"><em>"Our licensing is straightforward - no hidden feelings like early-series Ichikawa."</em></p>
</div>

<br />

## 🙏 Acknowledgments

<div style="background-color: #1E40AF; border-radius: 8px; padding: 20px; color: white; margin: 20px 0;">
  <div align="center">
    <h3>Special Thanks</h3>
    <p><em>"Supporting this project like the library committee supports the school."</em></p>

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
    <p>And to "The Dangers in My Heart" for inspiring our development philosophy!</p>
  </div>
</div>

<br />

---

<div align="center" style="background-color: #DBEAFE; border-radius: 8px; padding: 20px; margin: 20px 0;"> <img src="public/banking-hero.svg" alt="Siddhartha Bank Logo" width="60" /> <h3>Siddhartha Bank</h3> <p>Developed with ❤️ by <a href="https://github.com/Sulcrus">Sulcrus</a></p> <p><em>"Creating financial solutions with the same dedication that Ichikawa shows in the library committee"</em></p> <p>Trial Project for DevRoom | Last Updated: 2025-03-15</p> <p style="font-style: italic; margin-top: 20px;"> "Just as Yamada and Ichikawa found unexpected connections in everyday moments,<br> we hope our platform creates meaningful connections between you and your finances." </p> </div> <div style="background-color: #1E40AF; border-radius: 8px; padding: 15px; color: white; margin: 20px 0;"> <p align="center"> <strong>Fun Fact:</strong> Like how Ichikawa carefully arranges books in the library,<br> our code repositories are meticulously organized for optimal performance! </p> </div>