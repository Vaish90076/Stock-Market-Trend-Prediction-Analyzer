# 📈 Stock Market Trend & Prediction Analyzer

A modern stock market analytics dashboard that provides trend analysis, technical indicators, stock forecasting, and Buy/Sell/Hold recommendations using real-time market data.

---

## 🚀 Features

- 📊 Interactive Stock Charts
- 📈 Trend Detection
- 🔍 Stock Search Functionality
- ⭐ Watchlist Management
- 📉 Technical Indicators
  - RSI (Relative Strength Index)
  - MACD (Moving Average Convergence Divergence)
  - SMA (Simple Moving Average)
  - EMA (Exponential Moving Average)
- 🔮 5-Day Price Prediction
- 💡 Buy / Sell / Hold Signals
- 🌐 Real-Time Stock Data Integration

---

## 🛠️ Tech Stack

### Frontend

- React 18
- TypeScript
- Vite

### Styling

- Tailwind CSS
- ShadCN UI
- Radix UI

### Data Visualization

- Recharts

### State Management

- React Query

### API

- Yahoo Finance API

### Testing

- Vitest

---

## 📂 Project Structure

```text
src/
│
├── components/
│   ├── SearchBar
│   ├── StockChart
│   ├── PredictionPanel
│   ├── IndicatorsPanel
│   └── WatchlistPanel
│
├── hooks/
│   └── useStockData.ts
│
├── lib/
│   └── stockApi.ts
│
├── pages/
│
└── App.tsx
```

---

## 📊 Technical Indicators

### RSI

Measures momentum and identifies overbought or oversold conditions.

### MACD

Tracks trend direction and momentum.

### SMA

Calculates average stock prices over a fixed period.

### EMA

Gives greater weight to recent prices.

---

## 🔮 Prediction Logic

The application forecasts future stock prices using:

- Historical Price Data
- Trend Analysis
- RSI
- MACD
- Moving Averages

**Note:** Predictions are generated using technical analysis techniques and are not based on machine learning models.

---

## ⚙️ Installation

Clone the repository:

```bash
git clone https://github.com/yourusername/stock-market-trend-prediction-analyzer.git
```

Move into the project directory:

```bash
cd stock-market-trend-prediction-analyzer
```

Install dependencies:

```bash
npm install
```

Run the application:

```bash
npm run dev
```

Open:

```text
http://localhost:5173
```

---

## 📸 Screenshots

Add project screenshots here.

---

## 🎯 Future Enhancements

- Machine Learning Based Prediction Models
- LSTM Forecasting
- Portfolio Analytics
- Sentiment Analysis from Financial News
- Stock Comparison Dashboard
- Risk Assessment Module

---

## 👩‍💻 Author

Vakiti Vaishnavi

B.Tech Computer Science Engineering

Interested in:
- Data Science
- Big Data Analytics
- Data Engineering
- Machine Learning
- Software Development

---

## 📄 License

This project is developed for educational and learning purposes.
