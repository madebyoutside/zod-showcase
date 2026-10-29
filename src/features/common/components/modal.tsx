"use client";

import type { ReactNode } from "react";

export function Modal({ title, onClose, children }: { title: string; onClose: () => void; children: ReactNode }) {
  return (
    <dialog
      ref={(dialog) => {
        if (dialog && !dialog.open) dialog.showModal();
      }}
      onClose={onClose}
      onClick={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
      className="m-auto w-full max-w-md rounded-lg p-0 shadow-xl backdrop:bg-black/40"
    >
      <div className="flex flex-col gap-4 p-6">
        <header className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">{title}</h2>
          <button type="button" onClick={onClose} aria-label="Close" className="text-neutral-500">
            ✕
          </button>
        </header>
        {children}
      </div>
    </dialog>
  );
}
