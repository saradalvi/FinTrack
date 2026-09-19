"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import styles from "./login.module.css";

export default function LoginPage() {
  const router = useRouter();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setLoading(true);

    try {
      const response = await fetch(
        "http://localhost:8080/api/users/login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(form),
        }
      );

      if (!response.ok) {
        throw new Error("Invalid email or password");
      }

      const data = await response.json();

      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data));

      router.push("/dashboard");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className={styles.authPage}>

      <div className={styles.backgroundGlow}></div>

      <div className={styles.authContainer}>

        {/* Left branding section */}
        <section className={styles.brandSection}>

          <Link href="/" className={styles.logo}>
            <span className={styles.logoMark}>F</span>

            <span>
              Fin<span className={styles.logoAccent}>Track</span>
            </span>
          </Link>

          <div className={styles.brandContent}>

            <div className={styles.brandLabel}>
              SMART MONEY MANAGEMENT
            </div>

            <h1>
              Your money.
              <br />
              <span>Your clarity.</span>
            </h1>

            <p>
              Track spending, manage budgets and understand
              your financial habits from one beautiful dashboard.
            </p>

          </div>

          <div className={styles.stats}>

            <div className={styles.stat}>
              <strong>100%</strong>
              <span>Simple tracking</span>
            </div>

            <div className={styles.stat}>
              <strong>24/7</strong>
              <span>Financial visibility</span>
            </div>

          </div>

        </section>

        {/* Login section */}
        <section className={styles.loginCard}>

          <div className={styles.mobileLogo}>

            <span className={styles.logoMark}>F</span>

            <span>
              Fin<span className={styles.logoAccent}>Track</span>
            </span>

          </div>

          <div className={styles.cardHeader}>

            <h2>Welcome back</h2>

            <p>
              Sign in to continue to your dashboard.
            </p>

          </div>

          {error && (
            <div className={styles.errorMessage}>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>

            {/* Email */}
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

            {/* Password */}
            <div className={styles.formGroup}>

              <div className={styles.passwordHeader}>

                <label htmlFor="password">
                  Password
                </label>

                <button
                  type="button"
                  className={styles.forgotButton}
                  onClick={() => {
                    setError(
                      "Password recovery will be available soon."
                    );
                  }}
                >
                  Forgot password?
                </button>

              </div>

              <input
                id="password"
                name="password"
                type="password"
                placeholder="Enter your password"
                value={form.password}
                onChange={handleChange}
                required
              />

            </div>

            {/* Submit */}
            <button
              type="submit"
              className={styles.submitButton}
              disabled={loading}
            >
              {loading ? (
                "Signing in..."
              ) : (
                <>
                  Sign in
                  <span>→</span>
                </>
              )}
            </button>

          </form>

          <div className={styles.divider}>
            <span>Secure authentication</span>
          </div>

          <p className={styles.signupText}>
            Don't have an account?{" "}
            <Link href="/register">
              Create one
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