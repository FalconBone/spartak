// src/widgets/Header/Header.tsx
import { Settings, Crown, Ban } from "lucide-react";
import "./Header.scss";
import { useState } from "react";
import { usePlayerStore } from "@shared/store/usePlayerStore";
import face from "../../../public/face.avif";
import coin from "../../../public/coin.jpg";

export function Header() {
  const [username] = useState<string>("FalconBone");

  const { energy, level, xp, coins, hasSubscription } = usePlayerStore();

  const xpPercent = Math.min((xp / 999) * 100, 100);
  const energyBlocks = Array.from({ length: 10 }, (_, i) => i < energy);

  return (
    <header className="header">
      <div className="header__avatar">
        <img src={face} />
      </div>

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

          <div className="header__xp">{xp}/999</div>
        </div>
      </div>

      {/* Блок валюты и подписки */}
      <div className="header__top-right">
        <div className="header__currency">
          <span className="header__coins">{coins}</span>
          <img
            src={coin}
            alt="coins"
            className="header__coin-icon"
          />
        </div>

        <div className="header__sub-status">
          {hasSubscription ? (
            <Crown className="header__sub-icon header__sub-icon--active" />
          ) : (
            <Ban className="header__sub-icon header__sub-icon--inactive" />
          )}
        </div>

        <button className="header__settings">
          <Settings />
        </button>
      </div>
    </header>
  );
}
