import mongoose, { Document, Schema } from "mongoose";

export interface ITicket extends Document {
  title: string;
  description: string;
  status: string;
  priority: string;
  userId: string;
  createdAt: Date;
  assignedTo?: string; // id del agente (opcional)
}

const TicketSchema = new Schema<ITicket>({
  title: { type: String, required: true },
  description: { type: String, required: true },
  status: { type: String, default: "open" },
  priority: { type: String, default: "medium" },
  userId: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  assignedTo: { type: String, default: null },
});

export default mongoose.models.Ticket ||
  mongoose.model<ITicket>("Ticket", TicketSchema);
