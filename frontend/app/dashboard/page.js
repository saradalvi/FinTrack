"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import styles from "./dashboard.module.css";

const API_URL = "http://localhost:8080";

export default function DashboardPage() {
  const router = useRouter();

  const [user, setUser] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [budgets, setBudgets] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");

    if (!token || !storedUser) {
      router.push("/login");
      return;
    }

    const currentUser = JSON.parse(storedUser);

    setUser(currentUser);

    const loadDashboard = async () => {
      try {
        const headers = {
          Authorization: `Bearer ${token}`,
        };

        const [transactionResponse, budgetResponse] =
          await Promise.all([
            fetch(
              `${API_URL}/api/transactions/user/${currentUser.id}`,
              { headers }
            ),
            fetch(
              `${API_URL}/api/budgets/user/${currentUser.id}`,
              { headers }
            ),
          ]);

        if (
          transactionResponse.status === 401 ||
          budgetResponse.status === 401
        ) {
          localStorage.removeItem("token");
          localStorage.removeItem("user");
          router.push("/login");
          return;
        }

        const transactionData =
          await transactionResponse.json();

        const budgetData =
          await budgetResponse.json();

        setTransactions(
          Array.isArray(transactionData)
            ? transactionData
            : []
        );

        setBudgets(
          Array.isArray(budgetData)
            ? budgetData
            : []
        );
      } catch (error) {
        console.error(
          "Dashboard loading error:",
          error
        );
      } finally {
        setLoading(false);
      }
    };

    loadDashboard();
  }, [router]);

  const income = useMemo(() => {
    return transactions
      .filter(
        (transaction) =>
          transaction.type === "INCOME"
      )
      .reduce(
        (total, transaction) =>
          total + Number(transaction.amount || 0),
        0
      );
  }, [transactions]);

  const expenses = useMemo(() => {
    return transactions
      .filter(
        (transaction) =>
          transaction.type === "EXPENSE"
      )
      .reduce(
        (total, transaction) =>
          total + Number(transaction.amount || 0),
        0
      );
  }, [transactions]);

  const balance = income - expenses;

  const totalBudget = useMemo(() => {
    return budgets.reduce(
      (total, budget) =>
        total + Number(budget.amount || 0),
      0
    );
  }, [budgets]);

  const categoryExpenses = useMemo(() => {
    const grouped = {};

    transactions
      .filter(
        (transaction) =>
          transaction.type === "EXPENSE"
      )
      .forEach((transaction) => {
        const categoryName =
          transaction.category?.name ||
          "Other";

        grouped[categoryName] =
          (grouped[categoryName] || 0) +
          Number(transaction.amount || 0);
      });

    return Object.entries(grouped)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5);
  }, [transactions]);

  const recentTransactions =
    [...transactions]
      .sort(
        (a, b) =>
          new Date(b.date) -
          new Date(a.date)
      )
      .slice(0, 5);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(amount);
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
        <p>Loading your finances...</p>
      </main>
    );
  }

  return (
    <main className={styles.dashboardPage}>

      {/* Sidebar */}
      <aside className={styles.sidebar}>

        <Link href="/" className={styles.logo}>
          <span className={styles.logoMark}>F</span>

          <span>
            Fin<span>Track</span>
          </span>
        </Link>

        <nav className={styles.navigation}>

          <Link
            href="/dashboard"
            className={`${styles.navItem} ${styles.active}`}
          >
            <span>⌂</span>
            Dashboard
          </Link>

          <Link
            href="/transactions"
            className={styles.navItem}
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
              {user?.name?.charAt(0)?.toUpperCase() ||
                "U"}
            </div>

            <div>
              <strong>
                {user?.name || "User"}
              </strong>

              <span>
                {user?.email || ""}
              </span>
            </div>

          </div>

          <button
            onClick={logout}
            className={styles.logoutButton}
          >
            <span>↪</span>
            Log out
          </button>

        </div>

      </aside>

      {/* Main content */}
      <section className={styles.mainContent}>

        {/* Top bar */}
        <header className={styles.topbar}>

          <div>
            <p className={styles.greeting}>
              Financial overview
            </p>

            <h1>
              Good to see you,{" "}
              <span>
                {user?.name?.split(" ")[0] ||
                  "there"}
              </span>
            </h1>
          </div>

          <Link
            href="/transactions"
            className={styles.addButton}
          >
            <span>+</span>
            Add transaction
          </Link>

        </header>

        {/* Stats */}
        <section className={styles.statsGrid}>

          <div className={styles.statCard}>

            <div className={styles.statTop}>
              <span>Total balance</span>
              <div className={styles.balanceIcon}>
                ₹
              </div>
            </div>

            <strong className={styles.balanceValue}>
              {formatCurrency(balance)}
            </strong>

            <p className={styles.statDescription}>
              Income minus expenses
            </p>

          </div>

          <div className={styles.statCard}>

            <div className={styles.statTop}>
              <span>Total income</span>
              <div className={styles.incomeIcon}>
                ↗
              </div>
            </div>

            <strong>
              {formatCurrency(income)}
            </strong>

            <p className={styles.positive}>
              Money received
            </p>

          </div>

          <div className={styles.statCard}>

            <div className={styles.statTop}>
              <span>Total expenses</span>
              <div className={styles.expenseIcon}>
                ↘
              </div>
            </div>

            <strong>
              {formatCurrency(expenses)}
            </strong>

            <p className={styles.negative}>
              Money spent
            </p>

          </div>

          <div className={styles.statCard}>

            <div className={styles.statTop}>
              <span>Total budget</span>
              <div className={styles.budgetIcon}>
                ◫
              </div>
            </div>

            <strong>
              {formatCurrency(totalBudget)}
            </strong>

            <p className={styles.statDescription}>
              Across all categories
            </p>

          </div>

        </section>

        {/* Main grid */}
        <section className={styles.contentGrid}>

          {/* Recent transactions */}
          <div className={styles.panel}>

            <div className={styles.panelHeader}>

              <div>
                <h2>Recent transactions</h2>
                <p>Your latest financial activity</p>
              </div>

              <Link
                href="/transactions"
                className={styles.viewAll}
              >
                View all →
              </Link>

            </div>

            {recentTransactions.length === 0 ? (
              <div className={styles.emptyState}>

                <div className={styles.emptyIcon}>
                  +
                </div>

                <h3>No transactions yet</h3>

                <p>
                  Add your first income or expense
                  to start tracking.
                </p>

                <Link
                  href="/transactions"
                  className={styles.emptyButton}
                >
                  Add transaction
                </Link>

              </div>
            ) : (
              <div className={styles.transactionList}>

                {recentTransactions.map(
                  (transaction) => {

                    const isIncome =
                      transaction.type ===
                      "INCOME";

                    return (
                      <div
                        className={
                          styles.transactionRow
                        }
                        key={transaction.id}
                      >

                        <div
                          className={
                            styles.transactionIcon
                          }
                        >
                          {isIncome ? "↗" : "↘"}
                        </div>

                        <div
                          className={
                            styles.transactionInfo
                          }
                        >
                          <strong>
                            {transaction.description}
                          </strong>

                          <span>
                            {transaction.category
                              ?.name ||
                              "Other"}{" "}
                            •{" "}
                            {transaction.date}
                          </span>
                        </div>

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

                      </div>
                    );
                  }
                )}

              </div>
            )}

          </div>

          {/* Spending breakdown */}
          <div className={styles.panel}>

            <div className={styles.panelHeader}>

              <div>
                <h2>Spending breakdown</h2>
                <p>Where your money is going</p>
              </div>

            </div>

            {categoryExpenses.length === 0 ? (
              <div className={styles.emptyBreakdown}>
                No expense data yet.
              </div>
            ) : (
              <div className={styles.breakdownList}>

                {categoryExpenses.map(
                  ([category, amount]) => {

                    const percentage =
                      expenses > 0
                        ? Math.round(
                            (amount / expenses) *
                              100
                          )
                        : 0;

                    return (
                      <div
                        key={category}
                        className={styles.breakdownItem}
                      >

                        <div
                          className={
                            styles.breakdownHeader
                          }
                        >
                          <span>
                            {category}
                          </span>

                          <strong>
                            {formatCurrency(amount)}
                          </strong>
                        </div>

                        <div
                          className={
                            styles.progressTrack
                          }
                        >
                          <div
                            className={
                              styles.progressBar
                            }
                            style={{
                              width: `${percentage}%`,
                            }}
                          ></div>
                        </div>

                        <span
                          className={
                            styles.percentage
                          }
                        >
                          {percentage}% of expenses
                        </span>

                      </div>
                    );
                  }
                )}

              </div>
            )}

          </div>

        </section>

        {/* Bottom insight */}
        <section className={styles.insightCard}>

          <div className={styles.insightIcon}>
            ✦
          </div>

          <div>

            <span>FINTRACK INSIGHT</span>

            <h3>
              Keep your spending visible.
            </h3>

            <p>
              The more consistently you record
              transactions, the clearer your
              financial picture becomes.
            </p>

          </div>

          <Link
            href="/transactions"
            className={styles.insightButton}
          >
            Manage transactions →
          </Link>

        </section>

      </section>

    </main>
  );
}