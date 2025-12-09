"use client";

interface Comment {
  _id: string;
  authorName: string;
  authorRole: "client" | "agent";
  message: string;
  createdAt: string;
}

interface CommentListProps {
  comments: Comment[];
}

export const CommentList: React.FC<CommentListProps> = ({ comments }) => {
  if (!comments.length) {
    return <p className="text-sm text-slate-400">Sin comentarios aún.</p>;
  }

  return (
    <ul className="space-y-3">
      {comments.map((c) => (
        <li key={c._id} className="rounded-lg border bg-slate-50 p-2.5">
          <div className="flex justify-between text-xs text-slate-500 mb-1">
            <span>
              {c.authorName} ({c.authorRole === "agent" ? "Agente" : "Cliente"})
            </span>
            <span>{new Date(c.createdAt).toLocaleString()}</span>
          </div>
          <p className="text-sm text-slate-700 whitespace-pre-line">{c.message}</p>
        </li>
      ))}
    </ul>
  );
};
