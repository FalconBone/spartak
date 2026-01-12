import { useState } from "react";
import { useNavigate } from "react-router-dom";
import './RegisterPage.scss'

export function RegisterPage() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [repeatPassword, setRepeatPassword] = useState("");

  const [error, setError] = useState("");

  // Проверка email
  const validateEmail = (value: string) => {
    if (!value.includes("@")) return false;
    if (!/\.[a-z]{2,}$/i.test(value)) return false;
    return true;
  };

  // Проверка пароля
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
      setError("Пароль должен содержать минимум 8 символов, цифры и буквы");
      return;
    }

    if (password !== repeatPassword) {
      setError("Пароли не совпадают");
      return;
    }

    // Здесь будет запрос на сервер
    console.log("Регистрация прошла успешно");

    navigate("/profile");
  };

  return (
    <div className="register-page">
      <form className="register-card" onSubmit={handleSubmit}>
        <h1>Регистрация</h1>

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

        <div className="field">
          <label>Повторите пароль</label>
          <input
            type="password"
            placeholder="Повторите пароль"
            value={repeatPassword}
            onChange={(e) => setRepeatPassword(e.target.value)}
          />
        </div>

        {error && <div className="error">{error}</div>}

        <button type="submit" className="btn-primary">
          Создать аккаунт
        </button>

        <button
          type="button"
          className="btn-secondary"
          onClick={() => navigate("/auth")}
        >
          Уже есть аккаунт
        </button>
      </form>
    </div>
  );
}
