// src/pages/QuestExercisePage/QuestExercisePage.tsx

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./QuestExercisePage.scss";
import { usePlayerStore } from "@shared/store/usePlayerStore";

export function QuestExercisePage() {

    const addXP = usePlayerStore((s) => s.addXP);
    const spendEnergy = usePlayerStore((s) => s.spendEnergy);

  const navigate = useNavigate();

  const [exercises, setExercises] = useState([
    {
      title: "Отжимания",
      type: "count", // count | time
      value: 20,
      completed: false,
    },
    {
      title: "Планка",
      type: "time",
      value: 60, // секунды
      completed: false,
    },
    {
      title: "Приседания",
      type: "count",
      value: 30,
      completed: false,
    },
  ]);

  const [index, setIndex] = useState(0);

  const current = exercises[index];

  // Форматирование времени m:ss
  function formatTime(seconds: number) {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, "0")}`;
  }

  function next() {
    if (index < exercises.length - 1) setIndex(index + 1);
  }

  function prev() {
    if (index > 0) setIndex(index - 1);
  }

  function completeExercise() {
    const updated = exercises.map((ex, i) =>
      i === index ? { ...ex, completed: true } : ex
    );
    setExercises(updated);
  }

  // Если все упражнения выполнены — вернуться назад
useEffect(() => {
  const allDone = exercises.every((ex) => ex.completed);

  if (allDone) {
    // 1. Снять энергию
    spendEnergy(1);

    // 2. Начислить опыт
    addXP(80);

    // 3. Вернуться назад
    setTimeout(() => navigate(-1), 500);
  }
}, [exercises]);


  return (
    <div className="exercise-page">
      <h1 className="exercise-page__title">{current.title}</h1>

      {/* Карусель */}
      <div className="exercise-page__carousel">
        <button
          className={`nav-btn ${index === 0 ? "disabled" : ""}`}
          onClick={prev}
          disabled={index === 0}
        >
          {"<"}
        </button>

        <div className="exercise-card">
          <div className="exercise-card__image">
            {/* Плейсхолдер картинки */}
            <div className="exercise-card__image-placeholder">
              Изображение упражнения
            </div>
          </div>

          <div className="exercise-card__info">
            {current.type === "count" ? (
              <div className="exercise-card__value">
                {current.value} раз
              </div>
            ) : (
              <div className="exercise-card__value">
                {formatTime(current.value)}
              </div>
            )}
          </div>

          <button
            className={`exercise-card__button ${
              current.completed ? "disabled" : ""
            }`}
            disabled={current.completed}
            onClick={completeExercise}
          >
            {current.completed ? "Выполнено" : "Выполнить"}
          </button>
        </div>

        <button
          className={`nav-btn ${
            index === exercises.length - 1 ? "disabled" : ""
          }`}
          onClick={next}
          disabled={index === exercises.length - 1}
        >
          {">"}
        </button>
      </div>

      <div className="exercise-page__progress">
        {index + 1}/{exercises.length}
      </div>
    </div>
  );
}
