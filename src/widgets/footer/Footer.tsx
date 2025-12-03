// src/widgets/Footer/Footer.tsx
import "./Footer.scss";
import { Home, BarChart2, Map, ClipboardCheck, User } from "lucide-react";

export function Footer() {
  const navItems = [
    { icon: <Home />, label: "Главная" },
    { icon: <BarChart2 />, label: "Статы" },
    { icon: <Map />, label: "Карта" },
    { icon: <ClipboardCheck />, label: "Квесты" },
    { icon: <User />, label: "Профиль" },
  ];

  return (
    <footer className="footer">
      <div className="footer__nav">
        {navItems.map((item) => (
          <button key={item.label} className="footer__btn">
            <div className="footer__icon">{item.icon}</div>
            <span className="footer__label">{item.label}</span>
          </button>
        ))}
      </div>
    </footer>
  );
}
