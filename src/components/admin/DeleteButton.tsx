"use client";

import { useState } from "react";
import { FiTrash2 } from "react-icons/fi";

interface DeleteButtonProps {
  id: string;
  onDelete: (id: string) => Promise<void>;
  itemName: string;
}

export default function DeleteButton({ id, onDelete, itemName }: DeleteButtonProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  async function handleDelete() {
    setIsDeleting(true);
    try {
      await onDelete(id);
    } catch (error) {
      console.error(`Failed to delete ${itemName}:`, error);
      setIsDeleting(false);
      setShowConfirm(false);
    }
  }

  if (showConfirm) {
    return (
      <div className="flex items-center gap-2">
        <span className="text-xs font-semibold text-red-600 dark:text-red-400">Confirm?</span>
        <button
          onClick={handleDelete}
          disabled={isDeleting}
          className="text-xs bg-red-600 hover:bg-red-700 text-white px-2 py-1 rounded disabled:opacity-50 transition-colors"
        >
          {isDeleting ? "..." : "Yes"}
        </button>
        <button
          onClick={() => setShowConfirm(false)}
          disabled={isDeleting}
          className="text-xs bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 px-2 py-1 rounded hover:bg-slate-300 dark:hover:bg-slate-600 transition-colors"
        >
          No
        </button>
      </div>
    );
  }

  return (
    <button
      onClick={() => setShowConfirm(true)}
      className="text-slate-400 hover:text-red-600 dark:hover:text-red-400 transition-colors"
      title={`Delete ${itemName}`}
    >
      <FiTrash2 className="h-5 w-5" />
    </button>
  );
}
