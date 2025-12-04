import { useNavigate } from "react-router-dom";
import "./QuestsPage.scss";
import { navigationMap } from "@shared/model";

export function QuestsPage() {

  const navigate = useNavigate()
  const quests = [
    {
      title: "Утренняя разминка",
      completed: 2,
      total: 5,
      reward: "+50 XP",
      color: "#FDE68A", // теплый желтый
    },
    {
      title: "Кардио день",
      completed: 0,
      total: 4,
      reward: "+80 XP",
      color: "#BFDBFE", // голубой
    },
    {
      title: "Сила и мощь",
      completed: 4,
      total: 4,
      reward: "+120 XP",
      color: "#C7D2FE", // фиолетовый
    },
    {
      title: "Тренировка пресса",
      completed: 1,
      total: 3,
      reward: "+30 XP",
      color: "#FECACA", // легкий красный
    },
  ];

  return (
    <div className="quest-page">
      <h1 className="quest-page__title">Квесты</h1>

      <div className="quest-page__list">
        {quests.map((q, i) => {
          const progress = Math.round((q.completed / q.total) * 100);

          return (
            <div
              onClick={() => navigate(navigationMap.tasks)}
              key={i}
              className="quest-card"
              style={{ backgroundColor: q.color }}
            >
              <div className="quest-card__top">
                <h2 className="quest-card__title">{q.title}</h2>
                <span className="quest-card__reward">{q.reward}</span>
              </div>

              <div className="quest-card__progress-row">
                <span className="quest-card__count">
                  {q.completed}/{q.total}
                </span>

                <div className="quest-card__bar">
                  <div
                    className="quest-card__bar-fill"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
