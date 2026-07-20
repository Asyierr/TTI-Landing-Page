// auth-form.js — password visibility toggle, live strength meter,
// and front-end validation for the login / register forms.
// Updated for GIIAS 2026 dark theme (uses .auth-field, .auth-note classes)
// NOTE: UI-only — swap fakeSubmit for a real fetch() once backend is ready.

document.addEventListener("DOMContentLoaded", () => {

  // --- Password show/hide toggles -----------------------------------
  document.querySelectorAll("[data-toggle-password]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const input = document.getElementById(btn.dataset.togglePassword);
      if (!input) return;
      const isHidden = input.type === "password";
      input.type = isHidden ? "text" : "password";
      btn.setAttribute("aria-label", isHidden ? "Sembunyikan password" : "Tampilkan password");
      btn.classList.toggle("is-active", isHidden);
    });
  });

  // --- Live password strength meter (register page) ------------------
  const pwInput      = document.getElementById("register-password");
  const strengthBars = document.querySelectorAll(".auth-strength__bar");
  const strengthLabel = document.getElementById("register-strength-label");

  if (pwInput && strengthBars.length) {
    pwInput.addEventListener("input", () => {
      const score = scorePassword(pwInput.value);
      const classNames = ["", "weak", "fair", "good", "strong"];
      const labels     = ["", "Lemah 🔴", "Cukup 🟡", "Kuat 🟢", "Sangat kuat 💪"];

      strengthBars.forEach((bar, i) => {
        bar.className = "auth-strength__bar";
        if (i < score) bar.classList.add(classNames[score]);
      });
      if (strengthLabel) {
        strengthLabel.textContent = pwInput.value ? labels[score] : "";
      }
    });
  }

  function scorePassword(value) {
    let score = 0;
    if (value.length >= 8) score++;
    if (/[A-Z]/.test(value) && /[a-z]/.test(value)) score++;
    if (/\d/.test(value)) score++;
    if (/[^A-Za-z0-9]/.test(value)) score++;
    return Math.min(score, 4);
  }

  // --- Generic field validation helper --------------------------------
  function setError(input, message) {
    // Support both old .field and new .auth-field wrappers
    const wrapper = input.closest(".auth-field") || input.closest(".field");
    if (!wrapper) return;
    const errorEl = wrapper.querySelector(".auth-field__error, .field__error");
    if (message) {
      input.classList.add("has-error");
      input.classList.remove("is-valid");
      if (errorEl) errorEl.textContent = message;
    } else {
      input.classList.remove("has-error");
      input.classList.add("is-valid");
      if (errorEl) errorEl.textContent = "";
    }
  }

  function isEmailValid(value) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
  }

  // Helper to show note (supports both .auth-note and .form-note)
  function showNote(form, message, isSuccess = false) {
    const note = form.querySelector(".auth-note") || form.querySelector(".form-note");
    if (!note) return;
    note.textContent = message;
    note.classList.add("is-visible");
    if (isSuccess) note.classList.add("is-success");
    else note.classList.remove("is-success");
  }

  // --- Login form ------------------------------------------------------
  const loginForm = document.getElementById("login-form");
  if (loginForm) {
    loginForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const email    = document.getElementById("login-email");
      const password = document.getElementById("login-password");
      let valid = true;

      if (!isEmailValid(email.value)) {
        setError(email, "Format email tidak valid");
        valid = false;
      } else setError(email, "");

      if (password.value.length < 1) {
        setError(password, "Password wajib diisi");
        valid = false;
      } else setError(password, "");

      if (!valid) return;
      fakeSubmit(loginForm, "✅ Login berhasil! Menghubungkan ke server...", true);
    });

    // Clear error on input
    loginForm.querySelectorAll("input").forEach(input => {
      input.addEventListener("input", () => {
        input.classList.remove("has-error");
        const wrapper = input.closest(".auth-field, .field");
        const err = wrapper?.querySelector(".auth-field__error, .field__error");
        if (err) err.textContent = "";
      });
    });
  }

  // --- Register form ---------------------------------------------------
  const registerForm = document.getElementById("register-form");
  if (registerForm) {
    registerForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const name     = document.getElementById("register-name");
      const email    = document.getElementById("register-email");
      const password = document.getElementById("register-password");
      const confirm  = document.getElementById("register-confirm");
      const terms    = document.getElementById("register-terms");
      let valid = true;

      if (name && name.value.trim().length < 2) {
        setError(name, "Nama minimal 2 karakter");
        valid = false;
      } else if (name) setError(name, "");

      if (!isEmailValid(email.value)) {
        setError(email, "Format email tidak valid");
        valid = false;
      } else setError(email, "");

      if (password.value.length < 8) {
        setError(password, "Password minimal 8 karakter");
        valid = false;
      } else setError(password, "");

      if (confirm.value !== password.value || confirm.value === "") {
        setError(confirm, "Konfirmasi password tidak cocok");
        valid = false;
      } else setError(confirm, "");

      if (terms && !terms.checked) {
        valid = false;
        showNote(registerForm, "❗ Kamu harus menyetujui Ketentuan Layanan terlebih dahulu.");
        return;
      }

      if (!valid) return;
      fakeSubmit(registerForm, "🎉 Akun berhasil dibuat! Redirecting...", true);
    });

    // Clear errors on input
    registerForm.querySelectorAll("input").forEach(input => {
      input.addEventListener("input", () => {
        input.classList.remove("has-error");
        const wrapper = input.closest(".auth-field, .field");
        const err = wrapper?.querySelector(".auth-field__error, .field__error");
        if (err) err.textContent = "";
      });
    });
  }

  function fakeSubmit(form, message, isSuccess = false) {
    const btn = form.querySelector("button[type='submit']");
    btn.classList.add("is-loading");
    btn.disabled = true;

    setTimeout(() => {
      btn.classList.remove("is-loading");
      btn.disabled = false;
      showNote(form, message, isSuccess);
    }, 1200);
  }
});
