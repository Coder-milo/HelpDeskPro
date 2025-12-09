"use client";

import { useState } from "react";
import { Button } from "./button";

interface CommentFormProps {
  onSubmit: (message: string) => Promise<void> | void;
}

export const CommentForm: React.FC<CommentFormProps> = ({ onSubmit }) => {
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;
    setLoading(true);
    await onSubmit(message.trim());
    setMessage("");
    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="mt-3 flex flex-col gap-2">
      <textarea
        className="w-full rounded-lg border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
        placeholder="Escribe un comentario..."
        value={message}
        onChange={(e) => setMessage(e.target.value)}
      />
      <div className="flex justify-end">
        <Button type="submit" size="sm" disabled={loading}>
          {loading ? "Enviando..." : "Agregar comentario"}
        </Button>
      </div>
    </form>
  );
};
