# 💰 ProfitMe

**ProfitMe** is a modern personal finance management application built with **Angular** and **TypeScript**, designed to make tracking personal finances simple, visual, and intuitive.

The application allows users to record income and expenses, monitor monthly performance, set financial goals, explore spending insights, and compare their financial activity across different months.

---

## ✨ Features

### 📊 Financial Dashboard

* Monthly income overview
* Monthly expense overview
* Automatic net profit calculation
* Percentage comparison with the previous month
* Dynamic positive, negative, and neutral financial indicators

### 💵 Income & Expense Tracking

* Add and manage income transactions
* Add and manage expenses
* Organize financial activity by month
* Automatic monthly total calculations

### 📈 Monthly Performance

ProfitMe automatically compares the current month with the previous month.

For example:

```text
Income        €1,200   +20%
Expenses        €500   -16.7%
Net Profit      €700   +75%
```

The dashboard uses visual indicators to make trends immediately understandable:

* 🟢 Positive financial change
* 🔴 Negative financial change
* ⚪ Neutral / unavailable comparison

For expenses, a decrease is considered positive while an increase is considered negative.

### 🎯 Financial Goals

* Set a monthly revenue goal
* Edit goals directly from the dashboard
* Track goal completion through a dynamic progress bar

### 🔮 Smart Forecasting

ProfitMe includes financial forecasting functionality that estimates the next month's net profit based on previous financial activity.

### 📊 Insights

Users can explore their financial activity in more detail through the dedicated insights section.

### 💾 Local Data Storage

Financial data is stored locally using **IndexedDB**, allowing the application to maintain persistent data directly in the browser.

---

## 🛠️ Tech Stack

| Technology         | Usage                    |
| ------------------ | ------------------------ |
| **Angular**        | Front-end framework      |
| **TypeScript**     | Application logic        |
| **HTML5**          | Application structure    |
| **CSS3**           | Custom responsive UI     |
| **IndexedDB**      | Local persistent storage |
| **RxJS**           | Reactive event handling  |
| **Angular Router** | Application navigation   |

---

## 🏗️ Application Architecture

The application follows a component and service-based Angular architecture.

```text
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
```

Services are responsible for financial calculations, date handling, goals, summaries, and forecasting, while Angular components handle presentation and user interaction.

---

## 📸 Screenshots

### 🏠 Dashboard

| Overview                                                                                                                                    | Monthly Performance                                                                                                                          |
| ------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------- |
| <img src="https://github.com/user-attachments/assets/5d43a344-69cf-4b33-918b-6f63944b346e" width="420" alt="ProfitMe Dashboard Overview" /> | <img src="https://github.com/user-attachments/assets/47288ecb-28db-4626-824d-da0dd5980d67" width="420" alt="ProfitMe Monthly Performance" /> |

### 💵 Income & Expenses

| Income Tracking                                                                                                                          | Expense Tracking                                                                                                                          |
| ---------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------- |
| <img src="https://github.com/user-attachments/assets/c9d92a96-77eb-456c-b39b-5e695218718e" width="420" alt="ProfitMe Income Tracking" /> | <img src="https://github.com/user-attachments/assets/ed9565a8-df8f-4155-8af9-69e85e6f18d9" width="420" alt="ProfitMe Expense Tracking" /> |

### 📊 Insights & Analytics

| Financial Insights                                                                                                                          | Analytics Overview                                                                                                                          |
| ------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------- |
| <img src="https://github.com/user-attachments/assets/6a58a846-9fba-4f46-a0f6-ef49bffcfa81" width="420" alt="ProfitMe Financial Insights" /> | <img src="https://github.com/user-attachments/assets/f372fd2c-78cf-4860-96b7-8e6e192de4c0" width="420" alt="ProfitMe Analytics Overview" /> |


---

## 🚀 Getting Started

### Prerequisites

Make sure you have installed:

* **Node.js**
* **npm**
* **Angular CLI**
* **Git**

Check your installations with:

```bash
node --version
npm --version
ng version
git --version
```

---

## 📥 Installation

Clone the repository:

```bash
git clone https://github.com/nancyadam24/ProfitMe.git
```

Navigate to the project:

```bash
cd ProfitMe
```

Install the dependencies:

```bash
npm install
```

---

## ▶️ Run the Application

Start the Angular development server:

```bash
ng serve
```

or:

```bash
npm start
```

Open your browser at:

```text
http://localhost:4200
```

The application automatically reloads whenever the source files change.

---

## 🧪 Testing

Run unit tests:

```bash
ng test
```

or:

```bash
npm test
```

---

## 🧠 Financial Calculations

### Net Profit

ProfitMe calculates net profit automatically:

```text
Net Profit = Monthly Income - Monthly Expenses
```

### Month-over-Month Change

Monthly financial performance is calculated using:

```text
Change (%) = ((Current Month - Previous Month) / Previous Month) × 100
```

The application also handles edge cases where the previous month's value is zero to prevent invalid percentage results.

---

## 🗺️ Future Improvements

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

---

## 🎨 Design

ProfitMe focuses on a clean and minimal financial dashboard experience with:

* Responsive layouts
* Mobile-first design
* Clear financial KPIs
* Dynamic status indicators
* Simple navigation
* Visual goal tracking

---

## 👩‍💻 Author

**Athanasia Adamidou**

Software Developer

GitHub: [nancyadam24](https://github.com/nancyadam24)

---

## ⭐ Support

If you find ProfitMe interesting, consider giving the repository a **star ⭐**.

Feedback and suggestions are always welcome.
