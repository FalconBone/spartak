import React from "react";
import "./Modal.scss";

type ModalProps = {
  open: boolean;
  onOpenChange: (value: boolean) => void;
  children: React.ReactNode;
};

export function Modal({ open, onOpenChange, children }: ModalProps) {
  if (!open) return null;

  return (
    <div className="modal-overlay" onClick={() => onOpenChange(false)}>
      <div
        className="modal-content"
        onClick={(e) => e.stopPropagation()}
      >
        {children}

        <button className="modal-close" onClick={() => onOpenChange(false)}>
          ✕
        </button>
      </div>
    </div>
  );
}
