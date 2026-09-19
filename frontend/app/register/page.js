"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import styles from "./register.module.css";

export default function RegisterPage() {
  const router = useRouter();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    if (form.password.length < 6) {
      setError("Password must contain at least 6 characters.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(
        "http://localhost:8080/api/users",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(form),
        }
      );

      if (!response.ok) {
        const message = await response.text();

        if (response.status === 500) {
          throw new Error(
            "This email may already be registered."
          );
        }

        throw new Error(message || "Registration failed.");
      }

      setSuccess("Account created successfully!");

      setTimeout(() => {
        router.push("/login");
      }, 1000);

    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className={styles.registerPage}>

      <div className={styles.backgroundGlow}></div>

      <div className={styles.registerContainer}>

        {/* Left section */}
        <section className={styles.brandSection}>

          <Link href="/" className={styles.logo}>

            <span className={styles.logoMark}>
              F
            </span>

            <span>
              Fin<span className={styles.logoAccent}>Track</span>
            </span>

          </Link>

          <div className={styles.brandContent}>

            <div className={styles.brandLabel}>
              START YOUR FINANCIAL JOURNEY
            </div>

            <h1>
              Build better
              <br />
              <span>money habits.</span>
            </h1>

            <p>
              Create your FinTrack account and get a clear,
              simple view of your income, expenses and budgets.
            </p>

          </div>

          <div className={styles.benefits}>

            <div className={styles.benefit}>
              <span className={styles.check}>✓</span>
              <span>Track income & expenses</span>
            </div>

            <div className={styles.benefit}>
              <span className={styles.check}>✓</span>
              <span>Manage your budgets</span>
            </div>

            <div className={styles.benefit}>
              <span className={styles.check}>✓</span>
              <span>Understand your spending</span>
            </div>

          </div>

        </section>

        {/* Register card */}
        <section className={styles.registerCard}>

          <div className={styles.mobileLogo}>

            <span className={styles.logoMark}>
              F
            </span>

            <span>
              Fin<span className={styles.logoAccent}>Track</span>
            </span>

          </div>

          <div className={styles.cardHeader}>

            <h2>Create your account</h2>

            <p>
              Start managing your money with FinTrack.
            </p>

          </div>

          {error && (
            <div className={styles.errorMessage}>
              {error}
            </div>
          )}

          {success && (
            <div className={styles.successMessage}>
              {success}
            </div>
          )}

          <form onSubmit={handleSubmit}>

            <div className={styles.formGroup}>

              <label htmlFor="name">
                Full name
              </label>

              <input
                id="name"
                name="name"
                type="text"
                placeholder="Enter your name"
                value={form.name}
                onChange={handleChange}
                required
              />

            </div>

            <div className={styles.formGroup}>

              <label htmlFor="email">
                Email address
              </label>

              <input
                id="email"
                name="email"
                type="email"
                placeholder="you@example.com"
                value={form.email}
                onChange={handleChange}
                required
              />

            </div>

            <div className={styles.formGroup}>

              <label htmlFor="password">
                Password
              </label>

              <input
                id="password"
                name="password"
                type="password"
                placeholder="Create a password"
                value={form.password}
                onChange={handleChange}
                minLength={6}
                required
              />

              <span className={styles.passwordHint}>
                Use at least 6 characters.
              </span>

            </div>

            <button
              type="submit"
              className={styles.submitButton}
              disabled={loading}
            >
              {loading ? (
                "Creating account..."
              ) : (
                <>
                  Create account
                  <span>→</span>
                </>
              )}
            </button>

          </form>

          <div className={styles.divider}>
            <span>Secure registration</span>
          </div>

          <p className={styles.loginText}>
            Already have an account?{" "}
            <Link href="/login">
              Sign in
            </Link>
          </p>

          <Link href="/" className={styles.backHome}>
            ← Back to home
          </Link>

        </section>

      </div>

    </main>
  );
}