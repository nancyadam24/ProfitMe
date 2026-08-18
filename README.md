💰 ProfitMe

<p align="center">
  <strong>A modern personal finance management application built with Angular & TypeScript.</strong>
</p>
<p align="center">
  Track your income and expenses, understand your financial activity, set monthly goals and get smart financial forecasts — all from a clean, mobile-first dashboard.
</p>

⸻

📱 App Preview

<p align="center">
  <img src="screenshots/dashboard.jpeg" width="30%" alt="ProfitMe Dashboard" />
  &nbsp;&nbsp;
  <img src="screenshots/analytics.png" width="30%" alt="ProfitMe Financial Analytics" />
  &nbsp;&nbsp;
  <img src="screenshots/transactions.png" width="30%" alt="ProfitMe Transactions" />
</p>
<p align="center">
  <i>Dashboard • Financial Analytics • Transaction Management</i>
</p>

⸻

🚀 About ProfitMe

ProfitMe is a personal finance management application designed to provide a simple and intuitive way to understand your financial activity.

Instead of just recording transactions, ProfitMe automatically calculates monthly financial performance and presents it through a visual dashboard.

Users can monitor their:

* 💵 Monthly income
* 💳 Monthly expenses
* 💰 Net profit
* 📈 Month-over-month performance
* 🎯 Monthly financial goals
* 🔮 Next-month financial forecast
* 📊 Spending and income categories
* 🧾 Transaction history

The application follows a mobile-first design and stores financial data locally using IndexedDB.

⸻

✨ Features

💰 Financial Dashboard

The main dashboard provides an immediate overview of the user’s financial situation for the current month.

It includes:

* Total monthly income
* Total monthly expenses
* Automatic net profit calculation
* Month-over-month comparison
* Monthly revenue goal
* Goal completion progress
* Next-month financial forecast

⸻

📈 Month-over-Month Comparison

ProfitMe automatically compares the current month’s financial performance with the previous month.

The percentage change is calculated using:

Change (%) =
((Current Month - Previous Month) / Previous Month) × 100

For example:

Previous Month Income: €1,000
Current Month Income:  €1,200
Change: +20%

The dashboard uses dynamic indicators to make financial trends easy to understand.

🟢 Positive — financial improvement
🔴 Negative — financial decline
⚪ Neutral — no change or insufficient comparison data

Expense indicators use inverse financial logic: a decrease in expenses is considered positive, while an increase is considered negative.

The application also handles cases where the previous month’s value is zero, preventing invalid results such as Infinity%.

⸻

💵 Income & Expense Tracking

Users can record and manage financial transactions directly inside ProfitMe.

The application supports:

* Adding income
* Adding expenses
* Editing transactions
* Deleting transactions
* Transaction dates
* Transaction categories
* Automatic monthly calculations

Each transaction automatically contributes to the corresponding monthly financial summary.

⸻

📊 Financial Analytics

ProfitMe provides a dedicated analytics view for exploring financial activity in more detail.

Users can select a month and view:

* Total income
* Total expenses
* Net profit
* Income categories
* Expense categories
* Individual transactions
* Visual financial summaries

The analytics screen includes a visual chart representing the relationship between income, expenses and net profit.

⸻

🎯 Monthly Financial Goals

Users can define their own monthly revenue target.

ProfitMe automatically calculates progress toward that target and displays it using a dynamic progress bar.

For example:

Monthly Goal: €2,000
Current Net Profit: €1,000
Progress: 50%

Goals can be edited directly from the dashboard.

⸻

🔮 Smart Financial Forecasting

ProfitMe includes forecasting functionality that estimates the expected net profit for the next month based on recent financial activity.

The forecast is displayed directly on the dashboard, providing users with an indication of their expected upcoming financial performance.

⸻

💾 Local-First Data Storage

ProfitMe uses IndexedDB for persistent client-side storage.

This means financial data can be stored directly in the browser without requiring a traditional backend database.

Benefits include:

* Fast local access
* Persistent browser storage
* Reduced backend dependency
* Simple offline-friendly architecture

⸻

🛠️ Tech Stack

Technology	Purpose
Angular	Front-end application framework
TypeScript	Application logic
HTML5	Application structure
CSS3	Custom responsive UI
IndexedDB	Persistent client-side database
RxJS	Reactive event handling
Angular Router	Client-side navigation
Angular Forms	Form handling and data binding

⸻

🏗️ Architecture

ProfitMe follows Angular’s component and service-based architecture.

src/
│
├── app/
│   │
│   ├── db/
│   │   └── profitme.db.ts
│   │
│   ├── pages/
│   │   ├── dashboard/
│   │   ├── add-income/
│   │   ├── add-expense/
│   │   ├── forecast/
│   │   ├── goals/
│   │   └── insights/
│   │
│   └── services/
│       ├── date.service.ts
│       ├── summary.service.ts
│       ├── goal.service.ts
│       └── hybrid-forecast.service.ts
│
├── assets/
├── index.html
├── main.ts
└── styles.css

The application separates responsibilities between:

Components — presentation and user interaction
Services — business logic and financial calculations
IndexedDB layer — persistent financial data storage

This keeps the application modular and easier to maintain and extend.

⸻

🧮 Financial Logic

Net Profit

Net profit is calculated automatically:

Net Profit = Total Income - Total Expenses

Goal Progress

Monthly goal progress is calculated using:

Progress (%) =
(Net Profit / Monthly Goal) × 100

The displayed progress is constrained between 0% and 100%.

Monthly Performance

ProfitMe compares the current month against the immediately preceding month, including transitions between years.

For example:

2026-08 → 2026-07
2026-01 → 2025-12

⸻

🎨 UI / UX

ProfitMe was designed with a clean, modern and mobile-first interface.

The UI focuses on:

* 📱 Mobile-first responsive design
* 🎯 Clear financial KPIs
* 🟢🔴 Dynamic financial indicators
* 📊 Visual financial summaries
* 💳 Card-based interface
* ✨ Minimal navigation
* 📈 Visual goal tracking
* ⚡ Fast interaction

The goal is to make financial information understandable at a glance without overwhelming the user with unnecessary complexity.

⸻

🚀 Getting Started

Prerequisites

Make sure the following are installed:

* Node.js
* npm
* Angular CLI
* Git

You can verify your installation with:

node --version
npm --version
ng version
git --version

⸻

📥 Installation

Clone the repository:

git clone https://github.com/nancyadam24/ProfitMe.git

Navigate into the project:

cd ProfitMe

Install dependencies:

npm install

⸻

▶️ Running ProfitMe

Start the Angular development server:

ng serve

Alternatively:

npm start

Then open:

http://localhost:4200

The development server automatically reloads the application when source files are modified.

⸻

🧪 Testing

Run the Angular unit tests with:

ng test

or:

npm test

⸻

🗺️ Future Improvements

ProfitMe is actively designed to be extendable. Potential future improvements include:

* 🔐 User authentication
* ☁️ Cloud synchronization
* 💳 Multiple financial accounts
* 🔁 Recurring transactions
* 💰 Monthly budgets per category
* 📊 Advanced financial charts
* 📄 PDF / CSV financial reports
* 🔔 Financial goal notifications
* 🌙 Dark mode
* 📱 Multi-device synchronization
* 🔮 More advanced forecasting models

⸻

👩‍💻 Author

Athanasia Adamidou

Software Developer

GitHub: @nancyadam24

⸻

⭐ Support

If you find ProfitMe interesting, consider giving the repository a ⭐.

Feedback, suggestions and contributions are welcome.