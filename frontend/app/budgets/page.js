"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import styles from "./budgets.module.css";

const API_URL = "http://localhost:8080";

export default function BudgetsPage() {
  const router = useRouter();

  const [user, setUser] = useState(null);
  const [budgets, setBudgets] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [categories, setCategories] = useState([]);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [form, setForm] = useState({
    name: "",
    amount: "",
    categoryId: "",
    startDate: new Date().toISOString().split("T")[0],
    endDate: new Date().toISOString().split("T")[0],
  });

  useEffect(() => {
    const token = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");

    if (!token || !storedUser) {
      router.push("/login");
      return;
    }

    const currentUser = JSON.parse(storedUser);
    setUser(currentUser);

    loadData(currentUser.id, token);
  }, [router]);

  const loadData = async (userId, token) => {
    try {
      setLoading(true);
      setError("");

      const headers = {
        Authorization: `Bearer ${token}`,
      };

      const [budgetResponse, transactionResponse, categoryResponse] =
        await Promise.all([
          fetch(`${API_URL}/api/budgets/user/${userId}`, {
            headers,
          }),
          fetch(`${API_URL}/api/transactions/user/${userId}`, {
            headers,
          }),
          fetch(`${API_URL}/api/categories`, {
            headers,
          }),
        ]);

      if (
        budgetResponse.status === 401 ||
        transactionResponse.status === 401 ||
        categoryResponse.status === 401
      ) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        router.push("/login");
        return;
      }

      if (!budgetResponse.ok) {
        throw new Error("Unable to load budgets.");
      }

      if (!transactionResponse.ok) {
        throw new Error("Unable to load transactions.");
      }

      if (!categoryResponse.ok) {
        throw new Error("Unable to load categories.");
      }

      const budgetData = await budgetResponse.json();
      const transactionData = await transactionResponse.json();
      const categoryData = await categoryResponse.json();

      setBudgets(budgetData);
      setTransactions(transactionData);
      setCategories(categoryData);
    } catch (err) {
      console.error(err);
      setError(err.message || "Unable to load budget data.");
    } finally {
      setLoading(false);
    }
  };

  const expenseCategories = useMemo(() => {
    return categories.filter(
      (category) => category.type === "EXPENSE"
    );
  }, [categories]);

  const getSpentAmount = (budget) => {
    const start = new Date(budget.startDate);
    const end = new Date(budget.endDate);

    return transactions
      .filter((transaction) => {
        if (transaction.type !== "EXPENSE") return false;

        const transactionDate = new Date(transaction.date);

        return (
          transaction.category?.id === budget.category?.id &&
          transactionDate >= start &&
          transactionDate <= end
        );
      })
      .reduce(
        (total, transaction) =>
          total + Number(transaction.amount || 0),
        0
      );
  };

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

    if (!form.name.trim()) {
      setError("Please enter a budget name.");
      return;
    }

    if (!form.amount || Number(form.amount) <= 0) {
      setError("Please enter a valid budget amount.");
      return;
    }

    if (!form.categoryId) {
      setError("Please select a category.");
      return;
    }

    if (form.startDate > form.endDate) {
      setError("End date must be after the start date.");
      return;
    }

    const token = localStorage.getItem("token");

    try {
      setSaving(true);

      const response = await fetch(`${API_URL}/api/budgets`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: form.name,
          amount: Number(form.amount),
          startDate: form.startDate,
          endDate: form.endDate,
          category: {
            id: Number(form.categoryId),
          },
          user: {
            id: user.id,
          },
        }),
      });

      if (!response.ok) {
        throw new Error("Unable to create budget.");
      }

      const newBudget = await response.json();

      setBudgets((current) => [...current, newBudget]);

      setForm({
        name: "",
        amount: "",
        categoryId: "",
        startDate: new Date().toISOString().split("T")[0],
        endDate: new Date().toISOString().split("T")[0],
      });

      setSuccess("Budget created successfully.");

      setTimeout(() => {
        setSuccess("");
      }, 3000);
    } catch (err) {
      console.error(err);
      setError(err.message || "Unable to create budget.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this budget?"
    );

    if (!confirmed) return;

    const token = localStorage.getItem("token");

    try {
      const response = await fetch(
        `${API_URL}/api/budgets/${id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Unable to delete budget.");
      }

      setBudgets((current) =>
        current.filter((budget) => budget.id !== id)
      );

      setSuccess("Budget deleted successfully.");

      setTimeout(() => {
        setSuccess("");
      }, 3000);
    } catch (err) {
      setError(err.message || "Unable to delete budget.");
    }
  };

  const totalBudget = budgets.reduce(
    (sum, budget) => sum + Number(budget.amount || 0),
    0
  );

  const totalSpent = budgets.reduce(
    (sum, budget) => sum + getSpentAmount(budget),
    0
  );

  const totalRemaining = totalBudget - totalSpent;

  const activeBudgets = budgets.filter((budget) => {
    const today = new Date();
    const start = new Date(budget.startDate);
    const end = new Date(budget.endDate);

    return today >= start && today <= end;
  }).length;

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const getProgress = (budget) => {
    const spent = getSpentAmount(budget);
    const amount = Number(budget.amount || 0);

    if (!amount) return 0;

    return Math.min((spent / amount) * 100, 100);
  };

  const getBudgetStatus = (budget) => {
    const progress = getProgress(budget);

    if (progress >= 100) {
      return {
        label: "Over budget",
        className: styles.danger,
      };
    }

    if (progress >= 80) {
      return {
        label: "Almost reached",
        className: styles.warning,
      };
    }

    return {
      label: "On track",
      className: styles.good,
    };
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    router.push("/login");
  };

  if (loading) {
    return (
      <main className={styles.page}>
        <div className={styles.loading}>
          <div className={styles.spinner}></div>
          <p>Loading your budgets...</p>
        </div>
      </main>
    );
  }

  return (
    <main className={styles.page}>
      <aside className={styles.sidebar}>
        <Link href="/" className={styles.logo}>
          <span className={styles.logoMark}>F</span>
          <span>
            Fin<span>Track</span>
          </span>
        </Link>

        <nav className={styles.navigation}>
          <Link href="/dashboard" className={styles.navItem}>
            <span>⌂</span>
            Dashboard
          </Link>

          <Link href="/transactions" className={styles.navItem}>
            <span>↗</span>
            Transactions
          </Link>

          <Link
            href="/budgets"
            className={`${styles.navItem} ${styles.active}`}
          >
            <span>▥</span>
            Budgets
          </Link>
        </nav>

        <div className={styles.sidebarBottom}>
          <div className={styles.userInfo}>
            <div className={styles.avatar}>
              {user?.name?.charAt(0)?.toUpperCase() || "U"}
            </div>

            <div>
              <strong>{user?.name || "User"}</strong>
              <span>{user?.email || ""}</span>
            </div>
          </div>

          <button
            className={styles.logoutButton}
            onClick={logout}
          >
            Log out
          </button>
        </div>
      </aside>

      <section className={styles.content}>
        <header className={styles.header}>
          <div>
            <div className={styles.eyebrow}>
              FINANCIAL PLANNING
            </div>

            <h1>Budgets</h1>

            <p>
              Set limits and stay in control of your spending.
            </p>
          </div>

          <button
            className={styles.addButton}
            onClick={() =>
              document
                .getElementById("budget-form")
                ?.scrollIntoView({ behavior: "smooth" })
            }
          >
            <span>+</span>
            Create budget
          </button>
        </header>

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

        <section className={styles.statsGrid}>
          <div className={styles.statCard}>
            <span className={styles.statLabel}>
              Total budget
            </span>
            <strong>{formatCurrency(totalBudget)}</strong>
            <small>Across all budgets</small>
          </div>

          <div className={styles.statCard}>
            <span className={styles.statLabel}>
              Total spent
            </span>
            <strong className={styles.expenseValue}>
              {formatCurrency(totalSpent)}
            </strong>
            <small>Tracked expenses</small>
          </div>

          <div className={styles.statCard}>
            <span className={styles.statLabel}>
              Remaining
            </span>
            <strong
              className={
                totalRemaining < 0
                  ? styles.expenseValue
                  : styles.incomeValue
              }
            >
              {formatCurrency(totalRemaining)}
            </strong>
            <small>Available budget</small>
          </div>

          <div className={styles.statCard}>
            <span className={styles.statLabel}>
              Active budgets
            </span>
            <strong>{activeBudgets}</strong>
            <small>Currently running</small>
          </div>
        </section>

        <section
          id="budget-form"
          className={styles.formCard}
        >
          <div className={styles.sectionHeader}>
            <div>
              <span className={styles.sectionEyebrow}>
                NEW BUDGET
              </span>
              <h2>Create a budget</h2>
            </div>
          </div>

          <form
            className={styles.form}
            onSubmit={handleSubmit}
          >
            <div className={styles.formGroup}>
              <label htmlFor="name">Budget name</label>
              <input
                id="name"
                name="name"
                type="text"
                placeholder="e.g. Monthly Food Budget"
                value={form.name}
                onChange={handleChange}
                required
              />
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="amount">Budget amount</label>
              <div className={styles.amountInput}>
                <span>₹</span>
                <input
                  id="amount"
                  name="amount"
                  type="number"
                  min="1"
                  placeholder="10000"
                  value={form.amount}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="categoryId">
                Category
              </label>

              <select
                id="categoryId"
                name="categoryId"
                value={form.categoryId}
                onChange={handleChange}
                required
              >
                <option value="">Select category</option>

                {expenseCategories.map((category) => (
                  <option
                    key={category.id}
                    value={category.id}
                  >
                    {category.name}
                  </option>
                ))}
              </select>
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="startDate">Start date</label>
              <input
                id="startDate"
                name="startDate"
                type="date"
                value={form.startDate}
                onChange={handleChange}
                required
              />
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="endDate">End date</label>
              <input
                id="endDate"
                name="endDate"
                type="date"
                value={form.endDate}
                onChange={handleChange}
                required
              />
            </div>

            <div className={styles.formActions}>
              <button
                type="submit"
                className={styles.saveButton}
                disabled={saving}
              >
                {saving ? "Creating..." : "Create budget"}
              </button>
            </div>
          </form>
        </section>

        <section className={styles.budgetsSection}>
          <div className={styles.sectionHeader}>
            <div>
              <span className={styles.sectionEyebrow}>
                YOUR PLANS
              </span>

              <h2>Your budgets</h2>

              <p>
                {budgets.length}{" "}
                {budgets.length === 1
                  ? "budget"
                  : "budgets"}{" "}
                created
              </p>
            </div>
          </div>

          {budgets.length === 0 ? (
            <div className={styles.emptyState}>
              <div className={styles.emptyIcon}>₹</div>

              <h3>No budgets yet</h3>

              <p>
                Create your first budget to start controlling
                your spending.
              </p>

              <button
                onClick={() =>
                  document
                    .getElementById("budget-form")
                    ?.scrollIntoView({
                      behavior: "smooth",
                    })
                }
              >
                Create your first budget
              </button>
            </div>
          ) : (
            <div className={styles.budgetGrid}>
              {budgets.map((budget) => {
                const spent = getSpentAmount(budget);
                const remaining =
                  Number(budget.amount) - spent;
                const progress = getProgress(budget);
                const status = getBudgetStatus(budget);

                return (
                  <article
                    key={budget.id}
                    className={styles.budgetCard}
                  >
                    <div className={styles.budgetTop}>
                      <div>
                        <span className={styles.categoryBadge}>
                          {budget.category?.name ||
                            "Category"}
                        </span>

                        <h3>{budget.name}</h3>
                      </div>

                      <button
                        className={styles.deleteButton}
                        onClick={() =>
                          handleDelete(budget.id)
                        }
                        title="Delete budget"
                      >
                        ×
                      </button>
                    </div>

                    <div className={styles.budgetAmount}>
                      <strong>
                        {formatCurrency(budget.amount)}
                      </strong>

                      <span className={status.className}>
                        {status.label}
                      </span>
                    </div>

                    <div className={styles.progressInfo}>
                      <span>
                        {formatCurrency(spent)} spent
                      </span>

                      <span>
                        {Math.round(progress)}%
                      </span>
                    </div>

                    <div className={styles.progressBar}>
                      <div
                        className={`${styles.progressFill} ${
                          progress >= 100
                            ? styles.progressDanger
                            : progress >= 80
                            ? styles.progressWarning
                            : ""
                        }`}
                        style={{
                          width: `${progress}%`,
                        }}
                      ></div>
                    </div>

                    <div className={styles.budgetFooter}>
                      <div>
                        <span>Remaining</span>
                        <strong
                          className={
                            remaining < 0
                              ? styles.expenseValue
                              : ""
                          }
                        >
                          {formatCurrency(remaining)}
                        </strong>
                      </div>

                      <div className={styles.dateRange}>
                        <span>Period</span>
                        <strong>
                          {formatDate(budget.startDate)}
                          {" — "}
                          {formatDate(budget.endDate)}
                        </strong>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </section>
      </section>
    </main>
  );
}