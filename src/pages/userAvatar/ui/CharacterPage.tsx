import { useState } from "react";
import { motion } from "framer-motion";
import { Shirt, ClipboardCheck } from "lucide-react";
import { Button } from "@shared/ui/button/Button";
import { Modal } from "@shared/ui/modal/Modal";
import "./CharacterPage.scss";
import vesh from '../../../../public/вешалка.png'
import task from '../../../../public/task.png'

function Character({ skinColor }: { skinColor: string }) {
  return (
    <svg width="180" height="260" viewBox="0 0 200 300">
      <circle cx="100" cy="60" r="40" fill={skinColor} />
      <rect x="70" y="100" width="60" height="90" rx="20" fill={skinColor} />
      <rect x="30" y="110" width="40" height="20" rx="10" fill={skinColor} />
      <rect x="130" y="110" width="40" height="20" rx="10" fill={skinColor} />
      <rect x="75" y="190" width="20" height="70" rx="10" fill={skinColor} />
      <rect x="105" y="190" width="20" height="70" rx="10" fill={skinColor} />
    </svg>
  );
}

export function CharacterPage() {
  const [skinColor, setSkinColor] = useState("#f2c7a5");
  const [modalOpen, setModalOpen] = useState(false);

  const quests = [
    "Сделать 30 приседаний",
    "Пробежать 1 км",
    "Сделать 20 отжиманий",
  ];

  return (
    <div className="character-page">
      <div className="character-section">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <Character skinColor={skinColor} />
        </motion.div>

        <div className="side-buttons">
          <Button size="icon" className="icon-button" onClick={() => {}}>
            <img src={vesh}/>
          </Button>
          <Button size="icon" className="icon-button" onClick={() => setModalOpen(true)}>
            <img src={task}/>
          </Button>
        </div>
      </div>

      <div className="skin-selector">
        {["#f2c7a5", "#d4a574", "#8d5524", "#f5e6cc"].map((color) => (
          <button
            key={color}
            onClick={() => setSkinColor(color)}
            className="skin-color"
            style={{ backgroundColor: color }}
          />
        ))}
      </div>

      <Modal open={modalOpen} onOpenChange={setModalOpen}>
        <div className="quests-modal">
          <h2>Ежедневные задания</h2>
          <ul>
            {quests.map((q, i) => (
              <li key={i}>{q}</li>
            ))}
          </ul>
          <Button onClick={() => setModalOpen(false)} className="close-btn">
            Закрыть
          </Button>
        </div>
      </Modal>
    </div>
  );
}
