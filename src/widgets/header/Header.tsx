// src/widgets/Header/Header.tsx
import { Settings } from "lucide-react";
import "./Header.scss";
import { useState } from "react";
import { usePlayerStore } from "@shared/store/usePlayerStore";

interface HeaderProps {
  username: string;
  energy: number; // 0..10
  level: number;
  xp: number; // 0..999
}

//{ username, energy, level, xp }: HeaderProps

export function Header() {

  const [username, setUsername] = useState<string>('FalconBone')
  const { energy, level, xp } = usePlayerStore();


  const xpPercent = Math.min((xp / 999) * 100, 100);
  const energyBlocks = Array.from({ length: 10 }, (_, i) => i < energy);

  return (
    <header className="header">
      <div className="header__avatar" />

      <div className="header__info">
        <div className="header__username">{username}</div>

        {/* Энергия */}
        <div className="header__energy">
          {energyBlocks.map((filled, i) => (
            <div
              key={i}
              className={`header__energy-cell ${
                filled ? "header__energy-cell--filled" : ""
              }`}
            />
          ))}
        </div>

        {/* Уровень */}
        <div className="header__level-wrapper">
          <div className="header__level-text">Уровень {level}</div>

          <div className="header__level-bar">
            <div
              className="header__level-fill"
              style={{ width: `${xpPercent}%` }}
            />
          </div>

          <div className="header__xp">{xp}/999 XP</div>
        </div>
      </div>

      <button className="header__settings">
        <Settings />
      </button>
    </header>
  );
}
