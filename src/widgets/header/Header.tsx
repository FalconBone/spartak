// src/widgets/Header/Header.tsx
import { Settings } from "lucide-react";
import "./Header.scss";

export function Header() {
  const energy = 72; // заглушка энергии
  const username = "Фалькон";

  return (
    <header className="header">
      <div className="header__avatar" />

      <div className="header__info">
        <div className="header__username">{username}</div>
        <div className="header__energy-bar">
          <div
            className="header__energy-fill"
            style={{ width: `${energy}%` }}
          />
        </div>
      </div>

      <button className="header__settings">
        <Settings />
      </button>
    </header>
  );
}
