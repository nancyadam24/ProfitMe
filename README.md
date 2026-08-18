💰 ProfitMe

ProfitMe is a modern personal finance management application built with Angular and TypeScript, designed to make tracking personal finances simple, visual, and intuitive.

The application allows users to record income and expenses, monitor monthly performance, set financial goals, explore spending insights, and compare their financial activity across different months.

⸻

✨ Features

📊 Financial Dashboard

* Monthly income overview
* Monthly expense overview
* Automatic net profit calculation
* Percentage comparison with the previous month
* Dynamic positive, negative, and neutral financial indicators

💵 Income & Expense Tracking

* Add and manage income transactions
* Add and manage expenses
* Organize financial activity by month
* Automatic monthly total calculations

📈 Monthly Performance

ProfitMe automatically compares the current month with the previous month.

For example:

Income        €1,200   +20%
Expenses        €500   -16.7%
Net Profit      €700   +75%

The dashboard uses visual indicators to make trends immediately understandable:

* 🟢 Positive financial change
* 🔴 Negative financial change
* ⚪ Neutral / unavailable comparison

For expenses, a decrease is considered positive while an increase is considered negative.

🎯 Financial Goals

* Set a monthly revenue goal
* Edit goals directly from the dashboard
* Track goal completion through a dynamic progress bar

🔮 Smart Forecasting

ProfitMe includes financial forecasting functionality that estimates the next month’s net profit based on previous financial activity.

📊 Insights

Users can explore their financial activity in more detail through the dedicated insights section.

💾 Local Data Storage

Financial data is stored locally using IndexedDB, allowing the application to maintain persistent data directly in the browser.

⸻

🛠️ Tech Stack

Technology	Usage
Angular	Front-end framework
TypeScript	Application logic
HTML5	Application structure
CSS3	Custom responsive UI
IndexedDB	Local persistent storage
RxJS	Reactive event handling
Angular Router	Application navigation

⸻

🏗️ Application Architecture

The application follows a component and service-based Angular architecture.

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

Services are responsible for financial calculations, date handling, goals, summaries, and forecasting, while Angular components handle presentation and user interaction.

⸻

📸 Screenshots

Dashboard

Add a screenshot of the ProfitMe dashboard here.

![ProfitMe Dashboard](screenshots/dashboard.png)

Income & Expense Tracking

Add screenshots of the income and expense screens here.

![Income](screenshots/income.png)
![Expenses](screenshots/expenses.png)

Financial Insights

Add a screenshot of the analytics/insights screen here.

![Insights](screenshots/insights.png)

⸻

🚀 Getting Started

Prerequisites

Make sure you have installed:

* Node.js
* npm
* Angular CLI
* Git

Check your installations with:

node --version
npm --version
ng version
git --version

⸻

📥 Installation

Clone the repository:

git clone https://github.com/nancyadam24/ProfitMe.git

Navigate to the project:

cd ProfitMe

Install the dependencies:

npm install

⸻

▶️ Run the Application

Start the Angular development server:

ng serve

or:

npm start

Open your browser at:

http://localhost:4200

The application automatically reloads whenever the source files change.

⸻

🧪 Testing

Run unit tests:

ng test

or:

npm test

⸻

🧠 Financial Calculations

Net Profit

ProfitMe calculates net profit automatically:

Net Profit = Monthly Income - Monthly Expenses

Month-over-Month Change

Monthly financial performance is calculated using:

Change (%) = ((Current Month - Previous Month) / Previous Month) × 100

The application also handles edge cases where the previous month’s value is zero to prevent invalid percentage results.

⸻

🗺️ Future Improvements

Planned ideas for future versions include:

* User authentication
* Cloud synchronization
* Multiple accounts
* Budget categories
* Recurring transactions
* Advanced analytics and charts
* CSV / PDF financial reports
* Improved forecasting
* Notifications for financial goals
* Dark mode
* Multi-device synchronization

⸻

🎨 Design

ProfitMe focuses on a clean and minimal financial dashboard experience with:

* Responsive layouts
* Mobile-first design
* Clear financial KPIs
* Dynamic status indicators
* Simple navigation
* Visual goal tracking

⸻

👩‍💻 Author

Athanasia Adamidou

Software Developer

GitHub: nancyadam24

⸻

⭐ Support

If you find ProfitMe interesting, consider giving the repository a star ⭐.

Feedback and suggestions are always welcome.