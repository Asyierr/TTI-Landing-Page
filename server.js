// server.js
// Simple Express server that serves the interactive landing page UI
// (login/register form logic isn't wired to a database yet -
// this step is UI-only. We'll add real auth once you pick a database.)

const express = require("express");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;

// Serve everything inside /public as static files
app.use(express.static(path.join(__dirname, "public")));

// Explicit routes (nice URLs instead of /pages/login.html)
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.get("/login", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "pages", "login.html"));
});

app.get("/register", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "pages", "register.html"));
});

app.get("/dashboard", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "pages", "dashboard.html"));
});

app.listen(PORT, () => {
  console.log(`🚗 GIIAS 2026 website running at http://localhost:${PORT}`);
});
