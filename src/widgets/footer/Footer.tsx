// src/widgets/Footer/Footer.tsx
import { NavLink } from "react-router-dom";
import "./Footer.scss";
import { Home, BarChart2, Map, ClipboardCheck, User } from "lucide-react";
import { navigationMap } from "@shared/model";

export function Footer() {
  const navItems = [
    { icon: <Home />, label: "Главная", to: navigationMap.main},
    { icon: <BarChart2 />, label: "Статы", to: navigationMap.stats },
    { icon: <Map />, label: "Карта", to: navigationMap.map },
    { icon: <ClipboardCheck />, label: "Квесты", to: navigationMap.quests },
    { icon: <User />, label: "Профиль", to: navigationMap.userAvatar},
  ];

  return (
    <footer className="footer">
      <div className="footer__nav">
        {navItems.map((item) => (
          <NavLink to={item.to} key={item.label} className="footer__btn">
            <div className="footer__icon">{item.icon}</div>
            <span className="footer__label">{item.label}</span>
          </NavLink>
        ))}
      </div>
    </footer>
  );
}
