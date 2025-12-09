import cron from "node-cron";
import Ticket from "@/models/ticket";
import User from "@/models/user";
import connectMongo from "./mongo";

export const startCronJobs = () => {
  // Cada hora revisa tickets abiertos sin respuesta
  cron.schedule("0 * * * *", async () => {
    await connectMongo();
    const tickets = await Ticket.find({ status: "open", assignedTo: { $exists: true } });

    for (const ticket of tickets) {
      const agent = await User.findById(ticket.assignedTo);
      if (!agent) continue;


    }
  });
};
