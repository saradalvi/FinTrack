"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import styles from "./transactions.module.css";

const API_URL = "http://localhost:8080";

export default function TransactionsPage() {
  const router = useRouter();

  const [user, setUser] = useState(null);
  const [categories, setCategories] = useState([]);
  const [transactions, setTransactions] = useState([]);

  const [filter, setFilter] = useState("ALL");
  const [showForm, setShowForm] = useState(false);

  const [form, setForm] = useState({
    amount: "",
    description: "",
    date: new Date().toISOString().split("T")[0],
    type: "EXPENSE",
    categoryId: "",
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");

    if (!token || !storedUser) {
      router.push("/login");
      return;
    }

    const currentUser = JSON.parse(storedUser);

    setUser(currentUser);

    const loadData = async () => {
      try {
        const headers = {
          Authorization: `Bearer ${token}`,
        };

        const [
          transactionResponse,
          categoryResponse,
        ] = await Promise.all([
          fetch(
            `${API_URL}/api/transactions/user/${currentUser.id}`,
            { headers }
          ),
          fetch(`${API_URL}/api/categories`, {
            headers,
          }),
        ]);

        if (
          transactionResponse.status === 401 ||
          categoryResponse.status === 401
        ) {
          localStorage.removeItem("token");
          localStorage.removeItem("user");
          router.push("/login");
          return;
        }

        const transactionData =
          await transactionResponse.json();

        const categoryData =
          await categoryResponse.json();

        setTransactions(
          Array.isArray(transactionData)
            ? transactionData
            : []
        );

        setCategories(
          Array.isArray(categoryData)
            ? categoryData
            : []
        );
      } catch (err) {
        console.error(err);
        setError("Unable to load transactions.");
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [router]);

  const filteredTransactions = useMemo(() => {
    if (filter === "ALL") {
      return transactions;
    }

    return transactions.filter(
      (transaction) =>
        transaction.type === filter
    );
  }, [transactions, filter]);

  const totalIncome = transactions
    .filter(
      (transaction) =>
        transaction.type === "INCOME"
    )
    .reduce(
      (sum, transaction) =>
        sum + Number(transaction.amount || 0),
      0
    );

  const totalExpense = transactions
    .filter(
      (transaction) =>
        transaction.type === "EXPENSE"
    )
    .reduce(
      (sum, transaction) =>
        sum + Number(transaction.amount || 0),
      0
    );

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleTypeChange = (e) => {
    setForm({
      ...form,
      type: e.target.value,
      categoryId: "",
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");

    if (!form.categoryId) {
      setError("Please select a category.");
      return;
    }

    setSaving(true);

    try {
      const token = localStorage.getItem("token");

      const response = await fetch(
        `${API_URL}/api/transactions`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            amount: Number(form.amount),
            description: form.description,
            date: form.date,
            type: form.type,
            category: {
              id: Number(form.categoryId),
            },
            user: {
              id: user.id,
            },
          }),
        }
      );

      if (response.status === 401) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        router.push("/login");
        return;
      }

      if (!response.ok) {
        throw new Error(
          "Unable to create transaction."
        );
      }

      const createdTransaction =
        await response.json();

      setTransactions((previous) => [
        createdTransaction,
        ...previous,
      ]);

      setForm({
        amount: "",
        description: "",
        date: new Date()
          .toISOString()
          .split("T")[0],
        type: "EXPENSE",
        categoryId: "",
      });

      setShowForm(false);

    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const deleteTransaction = async (id) => {
    const confirmed = window.confirm(
      "Delete this transaction?"
    );

    if (!confirmed) {
      return;
    }

    try {
      const token = localStorage.getItem("token");

      const response = await fetch(
        `${API_URL}/api/transactions/${id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 401) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        router.push("/login");
        return;
      }

      if (!response.ok) {
        throw new Error(
          "Unable to delete transaction."
        );
      }

      setTransactions((previous) =>
        previous.filter(
          (transaction) =>
            transaction.id !== id
        )
      );
    } catch (err) {
      setError(err.message);
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    router.push("/login");
  };

  if (loading) {
    return (
      <main className={styles.loadingPage}>
        <div className={styles.loader}></div>
        <p>Loading transactions...</p>
      </main>
    );
  }

  return (
    <main className={styles.page}>

      {/* Sidebar */}
      <aside className={styles.sidebar}>

        <Link href="/" className={styles.logo}>
          <span className={styles.logoMark}>
            F
          </span>

          <span>
            Fin<span>Track</span>
          </span>
        </Link>

        <nav className={styles.navigation}>

          <Link
            href="/dashboard"
            className={styles.navItem}
          >
            <span>⌂</span>
            Dashboard
          </Link>

          <Link
            href="/transactions"
            className={`${styles.navItem} ${styles.active}`}
          >
            <span>↗</span>
            Transactions
          </Link>

          <Link
            href="/budgets"
            className={styles.navItem}
          >
            <span>◫</span>
            Budgets
          </Link>

        </nav>

        <div className={styles.sidebarBottom}>

          <div className={styles.userMini}>

            <div className={styles.avatar}>
              {user?.name?.charAt(0)?.toUpperCase()}
            </div>

            <div>
              <strong>{user?.name}</strong>
              <span>{user?.email}</span>
            </div>

          </div>

          <button
            onClick={logout}
            className={styles.logout}
          >
            ↪ &nbsp; Log out
          </button>

        </div>

      </aside>

      {/* Main */}
      <section className={styles.main}>

        <header className={styles.header}>

          <div>
            <p>FINANCIAL ACTIVITY</p>

            <h1>Transactions</h1>

            <span>
              Keep track of every rupee.
            </span>
          </div>

          <button
            className={styles.addButton}
            onClick={() =>
              setShowForm(!showForm)
            }
          >
            <span>+</span>
            Add transaction
          </button>

        </header>

        {/* Summary */}
        <section className={styles.summaryGrid}>

          <div className={styles.summaryCard}>

            <span>Total transactions</span>

            <strong>
              {transactions.length}
            </strong>

          </div>

          <div className={styles.summaryCard}>

            <span>Total income</span>

            <strong className={styles.income}>
              {formatCurrency(totalIncome)}
            </strong>

          </div>

          <div className={styles.summaryCard}>

            <span>Total expenses</span>

            <strong className={styles.expense}>
              {formatCurrency(totalExpense)}
            </strong>

          </div>

          <div className={styles.summaryCard}>

            <span>Net cash flow</span>

            <strong
              className={
                totalIncome - totalExpense >= 0
                  ? styles.income
                  : styles.expense
              }
            >
              {formatCurrency(
                totalIncome - totalExpense
              )}
            </strong>

          </div>

        </section>

        {/* Form */}
        {showForm && (
          <section className={styles.formCard}>

            <div className={styles.formHeader}>

              <div>
                <h2>Add transaction</h2>
                <p>
                  Record income or an expense.
                </p>
              </div>

              <button
                onClick={() => setShowForm(false)}
                className={styles.closeButton}
              >
                ×
              </button>

            </div>

            {error && (
              <div className={styles.error}>
                {error}
              </div>
            )}

            <form
              onSubmit={handleSubmit}
              className={styles.form}
            >

              <div className={styles.typeSelector}>

                <button
                  type="button"
                  className={
                    form.type === "EXPENSE"
                      ? styles.selectedExpense
                      : ""
                  }
                  onClick={() =>
                    setForm({
                      ...form,
                      type: "EXPENSE",
                      categoryId: "",
                    })
                  }
                >
                  Expense
                </button>

                <button
                  type="button"
                  className={
                    form.type === "INCOME"
                      ? styles.selectedIncome
                      : ""
                  }
                  onClick={() =>
                    setForm({
                      ...form,
                      type: "INCOME",
                      categoryId: "",
                    })
                  }
                >
                  Income
                </button>

              </div>

              <div className={styles.formGrid}>

                <div className={styles.field}>

                  <label>
                    Amount
                  </label>

                  <input
                    type="number"
                    name="amount"
                    placeholder="₹ 0"
                    min="1"
                    step="0.01"
                    value={form.amount}
                    onChange={handleChange}
                    required
                  />

                </div>

                <div className={styles.field}>

                  <label>
                    Description
                  </label>

                  <input
                    type="text"
                    name="description"
                    placeholder="e.g. Grocery shopping"
                    value={form.description}
                    onChange={handleChange}
                    required
                  />

                </div>

                <div className={styles.field}>

                  <label>
                    Date
                  </label>

                  <input
                    type="date"
                    name="date"
                    value={form.date}
                    onChange={handleChange}
                    required
                  />

                </div>

                <div className={styles.field}>

                  <label>
                    Category
                  </label>

                  <select
                    name="categoryId"
                    value={form.categoryId}
                    onChange={handleChange}
                    required
                  >
                    <option value="">
                      Select category
                    </option>

                    {categories
                      .filter(
                        (category) =>
                          category.type ===
                          form.type
                      )
                      .map((category) => (
                        <option
                          key={category.id}
                          value={category.id}
                        >
                          {category.name}
                        </option>
                      ))}
                  </select>

                </div>

              </div>

              <button
                type="submit"
                className={styles.saveButton}
                disabled={saving}
              >
                {saving
                  ? "Saving..."
                  : "Save transaction"}
              </button>

            </form>

          </section>
        )}

        {/* Error */}
        {error && !showForm && (
          <div className={styles.error}>
            {error}
          </div>
        )}

        {/* Filters */}
        <section className={styles.transactionsCard}>

          <div className={styles.transactionsHeader}>

            <div>
              <h2>All transactions</h2>

              <p>
                {filteredTransactions.length}{" "}
                transaction
                {filteredTransactions.length !== 1
                  ? "s"
                  : ""}
              </p>
            </div>

            <div className={styles.filters}>

              {[
                ["ALL", "All"],
                ["INCOME", "Income"],
                ["EXPENSE", "Expenses"],
              ].map(([value, label]) => (
                <button
                  key={value}
                  onClick={() => setFilter(value)}
                  className={
                    filter === value
                      ? styles.filterActive
                      : styles.filter
                  }
                >
                  {label}
                </button>
              ))}

            </div>

          </div>

          {filteredTransactions.length === 0 ? (

            <div className={styles.emptyState}>

              <div className={styles.emptyIcon}>
                ₹
              </div>

              <h3>
                No transactions found
              </h3>

              <p>
                Add your first transaction to
                start tracking your finances.
              </p>

              <button
                onClick={() => setShowForm(true)}
                className={styles.emptyButton}
              >
                Add transaction
              </button>

            </div>

          ) : (

            <div className={styles.tableWrapper}>

              <div className={styles.tableHeader}>

                <span>Transaction</span>
                <span>Category</span>
                <span>Date</span>
                <span>Amount</span>
                <span></span>

              </div>

              {filteredTransactions
                .sort(
                  (a, b) =>
                    new Date(b.date) -
                    new Date(a.date)
                )
                .map((transaction) => {

                  const isIncome =
                    transaction.type ===
                    "INCOME";

                  return (
                    <div
                      className={styles.transactionRow}
                      key={transaction.id}
                    >

                      <div
                        className={
                          styles.transactionName
                        }
                      >

                        <div
                          className={
                            isIncome
                              ? styles.incomeIcon
                              : styles.expenseIcon
                          }
                        >
                          {isIncome ? "↗" : "↘"}
                        </div>

                        <div>
                          <strong>
                            {transaction.description}
                          </strong>

                          <span>
                            {isIncome
                              ? "Income"
                              : "Expense"}
                          </span>
                        </div>

                      </div>

                      <span
                        className={
                          styles.category
                        }
                      >
                        {transaction.category
                          ?.name || "Other"}
                      </span>

                      <span
                        className={styles.date}
                      >
                        {transaction.date}
                      </span>

                      <strong
                        className={
                          isIncome
                            ? styles.incomeAmount
                            : styles.expenseAmount
                        }
                      >
                        {isIncome ? "+" : "-"}
                        {formatCurrency(
                          Number(
                            transaction.amount
                          )
                        )}
                      </strong>

                      <button
                        className={styles.deleteButton}
                        onClick={() =>
                          deleteTransaction(
                            transaction.id
                          )
                        }
                        title="Delete transaction"
                      >
                        ×
                      </button>

                    </div>
                  );
                })}

            </div>
          )}

        </section>

      </section>

    </main>
  );
}