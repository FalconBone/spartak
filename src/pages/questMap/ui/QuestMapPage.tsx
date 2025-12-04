// src/pages/QuestMapPage/QuestMapPage.tsx

import { useState, useRef } from "react";
import "./QuestMapPage.scss";
import { Modal } from "@shared/ui/modal/Modal";
import { Button } from "@shared/ui/button/Button";

export function QuestMapPage() {
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedQuest, setSelectedQuest] = useState<any>(null);

  const [activeQuestId, setActiveQuestId] = useState<number | null>(null);

  // Позиция карты
  const [position, setPosition] = useState({ x: -200, y: -150 });

  const mapRef = useRef<HTMLDivElement>(null);
  const dragData = useRef({ dragging: false, startX: 0, startY: 0 });

  const quests = [
    { id: 1, title: "Горный трейл", x: 200, y: 150 },
    { id: 2, title: "Лесной забег", x: 500, y: 400 },
    { id: 3, title: "Сильная долина", x: 350, y: 700 },
    { id: 4, title: "Озёрный челлендж", x: 700, y: 250 },
  ];

  function startDrag(e: React.PointerEvent) {
    dragData.current.dragging = true;
    dragData.current.startX = e.clientX - position.x;
    dragData.current.startY = e.clientY - position.y;
  }

  function onDrag(e: React.PointerEvent) {
    if (!dragData.current.dragging) return;
    setPosition({
      x: e.clientX - dragData.current.startX,
      y: e.clientY - dragData.current.startY,
    });
  }

  function stopDrag() {
    dragData.current.dragging = false;
  }

  function openQuest(quest: any) {
    setSelectedQuest(quest);
    setModalOpen(true);
  }

  function startQuest(id: number) {
    setActiveQuestId(id);
    setModalOpen(false);
  }

  return (
    <div className="map-page">
      <div
        className="map-container"
        ref={mapRef}
        onPointerDown={startDrag}
        onPointerMove={onDrag}
        onPointerUp={stopDrag}
      >
        <div
          className="map"
          style={{ transform: `translate(${position.x}px, ${position.y}px)` }}
        >
          {/* Точки квестов */}
          {quests.map((q) => (
            <div
              key={q.id}
              className="quest-marker"
              style={{ left: q.x, top: q.y }}
              onClick={() => openQuest(q)}
            >
              <div className="quest-marker__dot" />
              <span className="quest-marker__label">{q.title}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Модалка */}
      <Modal open={modalOpen} onOpenChange={setModalOpen}>
        {selectedQuest && (
          <div className="quest-modal">
            <h2>{selectedQuest.title}</h2>

            <p className="quest-modal__desc">
              Это описание квеста. Здесь будет краткая информация о том,
              что нужно сделать, чтобы его пройти.
            </p>

            {activeQuestId === selectedQuest.id ? (
              <Button disabled className="quest-modal__btn disabled">
                В процессе
              </Button>
            ) : (
              <Button
                className="quest-modal__btn"
                onClick={() => startQuest(selectedQuest.id)}
              >
                Начать
              </Button>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
}
