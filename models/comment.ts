import mongoose, { Document, Schema } from "mongoose";

export interface IComment extends Document {
  ticketId: string;
  authorId: string;
  authorName: string;
  authorRole: "client" | "agent";
  message: string;
  createdAt: Date;
}

const CommentSchema = new Schema<IComment>({
  ticketId: { type: String, required: true },
  authorId: { type: String, required: true },
  authorName: { type: String, required: true },
  authorRole: { type: String, enum: ["client", "agent"], required: true },
  message: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.models.Comment ||
  mongoose.model<IComment>("Comment", CommentSchema);
