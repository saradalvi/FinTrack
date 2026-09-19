"use client";

import Link from "next/link";

const features = [
  {
    icon: "↗",
    title: "Track Every Transaction",
    description:
      "Keep your income and expenses organized in one simple place.",
  },
  {
    icon: "◫",
    title: "Smart Budgeting",
    description:
      "Set category budgets and understand exactly where your money goes.",
  },
  {
    icon: "◔",
    title: "Clear Insights",
    description:
      "Visualize your spending habits with simple and meaningful analytics.",
  },
];

export default function Home() {
  return (
    <main className="landing-page">

      {/* Navigation */}
      <nav className="navbar">
        <div className="nav-container">

          <Link href="/" className="logo">
            <span className="logo-mark">F</span>
            <span>Fin<span>Track</span></span>
          </Link>

          <div className="nav-links">
            <a href="#features">Features</a>
            <a href="#how-it-works">How it works</a>
            <a href="#about">About</a>
          </div>

          <div className="nav-actions">
            <Link href="/login" className="login-link">
              Log in
            </Link>

            <Link href="/register" className="nav-button">
              Get started
            </Link>
          </div>

        </div>
      </nav>

      {/* Hero */}
      <section className="hero">
        <div className="hero-glow glow-one"></div>
        <div className="hero-glow glow-two"></div>

        <div className="hero-content">

          <div className="eyebrow">
            <span className="pulse-dot"></span>
            Your money, made simple
          </div>

          <h1>
            Take control of your
            <span className="gradient-text"> financial life.</span>
          </h1>

          <p className="hero-description">
            FinTrack helps you track expenses, manage budgets, understand
            your spending and build better financial habits — all from one
            beautiful dashboard.
          </p>

          <div className="hero-actions">

            <Link href="/register" className="primary-button">
              Start tracking free
              <span>→</span>
            </Link>

            <a href="#features" className="secondary-button">
              Explore features
            </a>

          </div>

          <div className="trust-row">
            <div className="avatars">
              <span> S </span>
              <span> A </span>
              <span> R </span>
              <span> + </span>
            </div>

            <div>
              <div className="stars">★★★★★</div>
              <p>Simple. Clear. Built for everyday money.</p>
            </div>
          </div>

        </div>

        {/* Dashboard Preview */}
        <div className="dashboard-wrapper">

          <div className="dashboard-card">

            <div className="dashboard-top">
              <div>
                <span className="small-label">Total balance</span>
                <h2>₹84,250.00</h2>
              </div>

              <div className="balance-badge">
                +12.8%
              </div>
            </div>

            <div className="mini-chart">

              <div className="chart-header">
                <span>Monthly overview</span>

                <select defaultValue="month">
                  <option value="month">This month</option>
                </select>
              </div>

              <div className="chart-area">

                <div className="chart-line">
                  <span></span>
                  <span></span>
                  <span></span>
                  <span></span>
                  <span></span>
                  <span></span>
                  <span></span>
                  <span></span>
                </div>

                <div className="chart-grid"></div>

              </div>

              <div className="chart-labels">
                <span>1 Sep</span>
                <span>7 Sep</span>
                <span>14 Sep</span>
                <span>21 Sep</span>
                <span>30 Sep</span>
              </div>

            </div>

            <div className="dashboard-bottom">

              <div className="summary-box">
                <div className="summary-icon income">↗</div>

                <div>
                  <span>Income</span>
                  <strong>₹75,000</strong>
                </div>
              </div>

              <div className="summary-box">
                <div className="summary-icon expense">↘</div>

                <div>
                  <span>Expenses</span>
                  <strong>₹28,450</strong>
                </div>
              </div>

              <div className="summary-box">
                <div className="summary-icon budget">◫</div>

                <div>
                  <span>Budget left</span>
                  <strong>₹21,550</strong>
                </div>
              </div>

            </div>

          </div>

        </div>

      </section>

      {/* Features */}
      <section className="features-section" id="features">

        <div className="section-heading">

          <div className="section-label">
            EVERYTHING IN ONE PLACE
          </div>

          <h2>
            Your finances,
            <span> finally organized.</span>
          </h2>

          <p>
            Everything you need to understand and manage your money without
            complicated spreadsheets.
          </p>

        </div>

        <div className="feature-grid">

          {features.map((feature) => (
            <div className="feature-card" key={feature.title}>

              <div className="feature-icon">
                {feature.icon}
              </div>

              <h3>{feature.title}</h3>

              <p>{feature.description}</p>

              <div className="feature-arrow">
                Learn more →
              </div>

            </div>
          ))}

        </div>

      </section>

      {/* How it works */}
      <section className="steps-section" id="how-it-works">

        <div className="section-heading">

          <div className="section-label">
            HOW IT WORKS
          </div>

          <h2>
            Financial clarity in
            <span> three simple steps.</span>
          </h2>

        </div>

        <div className="steps-grid">

          <div className="step-card">
            <div className="step-number">01</div>
            <h3>Add your transactions</h3>
            <p>
              Record your income and expenses as they happen.
            </p>
          </div>

          <div className="step-card">
            <div className="step-number">02</div>
            <h3>Set your budgets</h3>
            <p>
              Create spending limits for the categories that matter.
            </p>
          </div>

          <div className="step-card">
            <div className="step-number">03</div>
            <h3>Understand your money</h3>
            <p>
              Use your dashboard to see patterns and make smarter decisions.
            </p>
          </div>

        </div>

      </section>

      {/* CTA */}
      <section className="cta-section" id="about">

        <div className="cta-card">

          <div>
            <div className="section-label">START TODAY</div>

            <h2>
              Your money deserves
              <span> a better system.</span>
            </h2>

            <p>
              Start tracking your finances with FinTrack and turn your
              numbers into clarity.
            </p>
          </div>

          <Link href="/register" className="primary-button">
            Create your account
            <span>→</span>
          </Link>

        </div>

      </section>

      {/* Footer */}
      <footer className="footer">

        <div className="footer-logo">
          <span className="logo-mark">F</span>
          FinTrack
        </div>

        <p>
          © 2026 FinTrack. Smart money management made simple.
        </p>

        <div className="footer-links">
          <a href="#">Privacy</a>
          <a href="#">Terms</a>
          <a href="#">Contact</a>
        </div>

      </footer>

    </main>
  );
}