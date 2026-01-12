import { User, ArrowUpDown, Flame, Trophy, CheckCircle } from "lucide-react";
import "./UserStatsPage.scss";

export const UserStatsPage = () => {

  const stats = [
    { label: "Вес", value: "68 кг", icon: <ArrowUpDown /> },
    { label: "Рост", value: "175 см", icon: <User /> },
    { label: "Пол", value: "Мужской", icon: <></> },

    // Новые поля
    { label: "Упражнений выполнено", value: "124", icon: <CheckCircle /> },
    { label: "Начисленные очки", value: "820", icon: <Trophy /> },
    { label: "Серия дней", value: "6 дней", icon: <Flame /> },
  ];

  return (
    <div className="stat-page">
      <h2 className="stat-page__title">Моя статистика</h2>

      <div className="stat-page__cards">
        {stats.map((stat) => (
          <div key={stat.label} className="stat-page__card">
            <div className="stat-page__icon">{stat.icon}</div>

            <div className="stat-page__info">
              <div className="stat-page__label">{stat.label}</div>
              <div className="stat-page__value">{stat.value}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
