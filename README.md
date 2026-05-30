# Subslean ⚡

**Simplify your subscriptions, lighten your budget.**

Subslean is a modern, minimalist web application designed to help users monitor, analyze, and optimize their digital subscriptions and recurring expenses from a single centralized dashboard. 

![Subslean Tech Stack](https://img.shields.io/badge/Vue.js-35495E?style=for-the-badge&logo=vue.js&logoColor=4FC08D)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![Supabase](https://img.shields.io/badge/Supabase-181818?style=for-the-badge&logo=supabase&logoColor=3ECF8E)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)

## ✨ Features

- **Secure Authentication:** Seamless sign-up, login, and password recovery flows powered by Supabase Auth.
- **Data Privacy & Security:** Fully implemented Row Level Security (RLS) ensures users can only access their own data.
- **Real-Time Currency Conversion:** Automatically calculates and normalizes monthly costs using live exchange rates (TRY, USD, EUR).
- **Internationalization (i18n):** Full support for English and Turkish languages, switchable on the fly.
- **Dark/Light Mode:** A sleek, developer-oriented minimalist UI that respects user system preferences with dynamic logo switching.
- **State Management:** Highly reactive and optimized global state handling using Pinia.
- **Advanced Filtering & Sorting:** Easily search and organize subscriptions by category or price.

## 🛠️ Tech Stack

- **Frontend Framework:** Vue 3 (Composition API) & Vite
- **Language:** TypeScript
- **State Management:** Pinia
- **UI Components & Styling:** PrimeVue + Tailwind CSS
- **Backend as a Service:** Supabase (PostgreSQL)
- **Internationalization:** Vue I18n
- **API:** ExchangeRate-API (for live currency data)

## 🚀 Getting Started

Follow these instructions to set up the project locally.

### Prerequisites

- Node.js (v18 or higher)
- npm, pnpm, or yarn
- A Supabase account and project

### Installation

1. **Clone the repository:**
   ```bash
   git clone [https://github.com/your-username/subscription-tracker.git](https://github.com/your-username/subscription-tracker.git)
   cd subscription-tracker
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Environment Setup:**
   Create a `.env` file in the root directory and add your Supabase project credentials (or configure them directly in your `supabase.ts` file).

4. **Run the development server:**
   ```bash
   npm run dev
   ```

5. Open [http://localhost:5173](http://localhost:5173) in your browser to see the app.

## 🗄️ Database Schema & RLS

The project requires a `subscriptions` table in your Supabase PostgreSQL database. 
Make sure to enable **Row Level Security (RLS)** and apply the following policies to ensure users can only CRUD their own data:

```sql
-- Enable RLS
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;

-- Select Policy
CREATE POLICY "Users can view their own subscriptions" ON subscriptions 
FOR SELECT USING (auth.uid() = user_id);

-- Insert Policy
CREATE POLICY "Users can insert their own subscriptions" ON subscriptions 
FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Update Policy
CREATE POLICY "Users can update their own subscriptions" ON subscriptions 
FOR UPDATE USING (auth.uid() = user_id);

-- Delete Policy
CREATE POLICY "Users can delete their own subscriptions" ON subscriptions 
FOR DELETE USING (auth.uid() = user_id);
```

## 🤝 Contributing

Contributions, issues, and feature requests are welcome! Feel free to check the issues page.

## 📄 License

This project is licensed under the MIT License.