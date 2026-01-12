import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./AuthPage.scss";

export function AuthPage() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [error, setError] = useState("");

  // Мини-валидация email
  const validateEmail = (value: string) => {
    if (!value.includes("@")) return false;
    if (!/\.[a-z]{2,}$/i.test(value)) return false;
    return true;
  };

  // Мини-валидация пароля
  const validatePassword = (value: string) => {
    if (value.length < 8) return false;
    if (!/[0-9]/.test(value)) return false;
    if (!/[a-zA-Z]/.test(value)) return false;
    return true;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!validateEmail(email)) {
      setError("Введите корректный email");
      return;
    }

    if (!validatePassword(password)) {
      setError("Пароль должен содержать 8 символов, цифры и буквы");
      return;
    }

    // Здесь будет реальный запрос на сервер
    const mockEmail = "test@mail.com";
    const mockPass = "Test1234";

    if (email !== mockEmail || password !== mockPass) {
      setError("Неверный email или пароль");
      return;
    }

    // Успешная авторизация
    navigate("/profile");
  };

  return (
    <div className="auth-page">
      <form className="auth-card" onSubmit={handleSubmit}>
        <h1>Вход</h1>

        <div className="field">
          <label>Email</label>
          <input
            type="email"
            placeholder="Введите email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div className="field">
          <label>Пароль</label>
          <input
            type="password"
            placeholder="Введите пароль"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        {error && <div className="error">{error}</div>}

        <button type="submit" className="btn-primary">
          Войти
        </button>

        <button
          type="button"
          className="btn-secondary"
          onClick={() => navigate("/register")}
        >
          Зарегистрироваться
        </button>
      </form>
    </div>
  );
}
