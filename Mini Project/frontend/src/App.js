
import React, { useEffect, useState } from "react";
import "./App.css";

const API = "http://localhost:5000/api";

export default function App() {
  const [page, setPage] = useState("login");
  const [form, setForm] = useState({});
  const [token, setToken] = useState("");
  const [name, setName] = useState("");
  const [expenses, setExpenses] = useState([]);
  const [message, setMessage] = useState("");

  async function request(path, method = "GET", data) {
    const res = await fetch(API + path, {
      method,
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: "Bearer " + token } : {})
      },
      ...(data ? { body: JSON.stringify(data) } : {})
    });
    const result = await res.json();
    if (!res.ok) throw new Error(result.message || "Something went wrong");
    return result;
  }

  async function submit(e) {
    e.preventDefault();
    try {
      const result = await request(
        page === "signup" ? "/signup" : "/login",
        "POST",
        form
      );
      if (page === "signup") {
        setMessage(result.message);
        setPage("login");
      } else {
        setToken(result.token);
        setName(result.name);
        setPage("dashboard");
        setMessage("");
      }
    } catch (err) {
      setMessage(err.message);
    }
  }

  async function loadExpenses() {
    try {
      setExpenses(await request("/expenses"));
    } catch (err) {
      setMessage(err.message);
    }
  }

  useEffect(() => {
    if (token) loadExpenses();
  }, [token]);

  async function addExpense(e) {
    e.preventDefault();
    try {
      await request("/expenses", "POST", form);
      setForm({});
      setMessage("");
      loadExpenses();
    } catch (err) {
      setMessage(err.message);
    }
  }

  async function deleteExpense(id) {
    try {
      await request("/expenses/" + id, "DELETE");
      loadExpenses();
    } catch (err) {
      setMessage(err.message);
    }
  }

  function field(key, placeholder, type = "text") {
    return <input
      placeholder={placeholder}
      type={type}
      value={form[key] || ""}
      onChange={e => setForm({ ...form, [key]: e.target.value })}
      required
    />;
  }

  if (page !== "dashboard") return (
    <main className="auth">
      <h1>SpendWise</h1>
      <p>Take control of your money.</p>
      <form onSubmit={submit}>
        <h2>{page === "login" ? "Welcome back" : "Create account"}</h2>
        {page === "signup" && field("name", "Full name")}
        {field("email", "Email", "email")}
        {field("password", "Password", "password")}
        <button>{page === "login" ? "Login" : "Sign up"}</button>
      </form>
      <p>{message}</p>
      <button className="link" onClick={() => {
        setPage(page === "login" ? "signup" : "login");
        setMessage("");
      }}>
        {page === "login" ? "Create an account" : "Back to login"}
      </button>
    </main>
  );

  return (
    <main className="dashboard">
      <header>
        <div><h1>SpendWise</h1><p>Hello, {name}!</p></div>
        <button onClick={() => {
          setToken("");
          setName("");
          setExpenses([]);
          setForm({});
          setPage("login");
        }}>Logout</button>
      </header>

      <h2>Your Expense Tracker</h2>
      <h3>Total spent: ₹{expenses.reduce((sum, x) => sum + x.amount, 0)}</h3>

      <form className="expense-form" onSubmit={addExpense}>
        {field("title", "Expense name")}
        {field("amount", "Amount (₹)", "number")}
        <select required value={form.category || ""}
          onChange={e => setForm({ ...form, category: e.target.value })}>
          <option value="">Choose category</option>
          {["Food", "Travel", "Shopping", "Bills", "Other"].map(c =>
            <option key={c}>{c}</option>
          )}
        </select>
        {field("date", "Date", "date")}
        <button>Add expense</button>
      </form>

      <p>{message}</p>
      <h2>Expense History</h2>
      {expenses.map(x => (
        <article className="expense" key={x._id}>
          <div>
            <strong>{x.title}</strong>
            <p>{x.category} · {x.date}</p>
          </div>
          <strong>₹{x.amount}</strong>
          <button onClick={() => deleteExpense(x._id)}>Delete</button>
        </article>
      ))}
      {!expenses.length && <p>No expenses yet. Add your first one!</p>}
    </main>
  );
}
