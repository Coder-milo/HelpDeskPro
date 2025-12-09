# HelpDeskPro – Ticket Management System

HelpDeskPro is a modern web application for managing support tickets with differentiated roles for **client** and **agent**.  
It allows users to create requests, track their status, set priorities, and maintain a structured conversation between the end user and the support team.

The interface is built with a clean, minimalist style (glassmorphism + soft gradients), optimized for a pleasant experience for both clients and agents.

---

## 🚀 Main Features

### 👤 Client Module

- Secure registration and login.
- Ticket creation with:
  - Title
  - Description
  - **Priority**: `low`, `medium`, `high`
- “My Tickets” list including:
  - Current ticket status
  - Priority
  - Creation date
- Ticket detail view.
- Conversation with the agent:
  - Send comments per ticket
  - View history of messages between client and agent.
- Logout that clears the user session.

### 🎧 Agent Module

- Agent dashboard with a global view of tickets.
- Filters by:
  - **Status**: `open`, `in_progress`, `resolved`, `closed`
  - **Priority**: `low`, `medium`, `high`
- Role-based visibility:
  - Agents can see **all tickets**.
- Ticket status update:
  - Mark as “In progress”
  - Mark as “Resolved”
  - Close ticket
- View client information for each ticket (name and email).
- Manage comments on each ticket:
  - View message history.
  - Add new comments as an agent.
- Quickly create new clients from the agent panel.
- Logout to end the session.

### 🔐 Authentication and Authorization

- Authentication based on **JSON Web Tokens (JWT)**.
- Backend authentication middleware:
  - Extracts `id` and `role` from the token.
  - Injects `req.user` for protected routes.
- Access control:
  - Clients can only see **their own tickets**.
  - Agents can see **all tickets**.
- API route protection with `authMiddleware`.
- Optional additional middleware in `middleware.ts` to protect `/dashboard/*` routes by role.

---

## 🧱 Tech Stack

- **Fullstack Framework**: [Next.js](https://nextjs.org/) (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS (modern and minimalist design)
- **HTTP Client**: Axios
- **Database**: MongoDB
- **ODM**: Mongoose
- **Authentication**: JWT (`jsonwebtoken`)
- **Password Hashing**: `bcryptjs`

---

## 🗂 Project Structure (simplified)

```bash
.
├─ app/
│  ├─ page.tsx                     # Landing / Login / Register
│  ├─ dashboard/
│  │  ├─ client/
│  │  │  └─ page.tsx               # Client panel (ClientDashboard)
│  │  ├─ agente/
│  │  │  └─ page.tsx               # Agent panel (AgentDashboard)
│  │  └─ layout.tsx (optional)     # Global protected layout for /dashboard
│  └─ api/
│     ├─ auth/
│     │  ├─ login/route.ts         # Login
│     │  ├─ register/route.ts      # User/client registration
│     │  └─ logout/route.ts        # Logout (optional)
│     ├─ tickets/route.ts          # GET/POST tickets
│     └─ comments/[ticketId]/route.ts  # GET/POST comments
│
├─ components/
│  ├─ button.tsx
│  ├─ badge.tsx
│  ├─ card.tsx
│  ├─ TickectCard.tsx
│  ├─ commenList.tsx
│  └─ commentForm.tsx
│
├─ lib/
│  ├─ mongo.ts                     # MongoDB connection
│  └─ authMiddleware.ts            # JWT middleware for API routes
│
├─ models/
│  ├─ user.ts                      # User model
│  └─ ticket.ts                    # Ticket model
│  # (and optionally comment.ts if comments are a separate model)
│
├─ styles/
│  └─ globals.css                  # Tailwind + global styles
│
├─ middleware.ts                   # Optional middleware to protect /dashboard
├─ package.json
└─ README.md

    ⚠️ The exact structure may vary slightly, but the general idea is to separate:

        UI (app, components)

        Business logic (api routes, lib)

        Persistence layer (models)

🧬 Data Models (summary)
👤 User

Typical fields:

    name: string

    email: string (unique)

    password: string (Bcrypt hash)

    role: "client" | "agent" (and optionally "admin")

🎫 Ticket

    title: string

    description: string

    status: "open" | "in_progress" | "resolved" | "closed"

    priority: "low" | "medium" | "high" (default: "medium")

    userId: reference to the user who created the ticket

    createdAt / updatedAt: timestamps

💬 Comment (depending on implementation)

    ticketId: reference to the ticket

    authorName: string

    authorRole: "client" | "agent"

    message: string

    createdAt: date

🧩 Authentication Flow

    The user registers (or is created by an agent) via
    POST /api/auth/register.

    The user logs in via
    POST /api/auth/login

        The backend:

            Looks up the user by email.

            Validates the password using Bcrypt.

            Generates a JWT with { id: user._id, role: user.role }.

        The response includes: { token, role, name }.

    On the frontend:

        The token (and role) is stored (for example in localStorage).

        Based on the role, the user is redirected:

            client → /dashboard/client

            agent → /dashboard/agente

    For API calls:

        The token is sent in the header:
        Authorization: Bearer <token>.

        authMiddleware:

            Verifies the JWT.

            Injects req.user = { id, role }.

    Protected routes use req.user:

        /api/tickets (GET):

            If role === "client" → filters by userId.

            If role === "agent" → returns all tickets (with optional filters).

        /api/tickets (POST):

            Creates a ticket associated with req.user.id and the selected priority.

Optionally, a global middleware.ts can directly protect routes:

    /dashboard/client/* accessible only for role = "client".

    /dashboard/agente/* accessible only for role = "agent".

🔗 Main Endpoints
🔐 Auth

    POST /api/auth/register
    Creates a new user (typically with role: "client").

    POST /api/auth/login

        Body: { email, password }

        Response: { token, role, name }.

    POST /api/auth/logout (optional)

        Clears cookie/session if using cookie-based auth.

        In the client, it also removes token and role from localStorage.

🎫 Tickets

    GET /api/tickets?status=&priority=

        Protected by JWT.

        Client:

            Returns only tickets belonging to the authenticated user.

        Agent:

            Returns all tickets.

        Filters:

            status (optional): open, in_progress, resolved, closed.

            priority (optional): low, medium, high.

    POST /api/tickets

        Body: { title, description, priority }.

        Creates a ticket with:

            status: "open".

            priority: priority || "medium".

            userId: req.user.id.

    PUT /api/tickets/:id

        Typically used to update the ticket status (by agents).

💬 Comments

    GET /api/comments/:ticketId
    Returns comments associated with a given ticket.

    POST /api/comments/:ticketId

        Body: { message }.

        Creates a new comment linked to the ticket and the authenticated user.

⚙️ Prerequisites

    Node.js >= 18

    npm or yarn

    A MongoDB instance (local or in the cloud, e.g., MongoDB Atlas)

🔧 Environment Setup

    Clone the repository

git clone https://github.com/your-username/helpdeskpro.git
cd helpdeskpro

    Install dependencies

npm install
# or
yarn install

    Configure environment variables

Create a .env.local file at the project root:

MONGODB_URI=mongodb+srv://<user>:<password>@<cluster>/<dbname>?
JWT_SECRET=a_long_and_secure_secret_key


    ⚠️ Do not commit .env.local to the repository.

🏃 Available Scripts

In package.json you will typically find:

{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint"
  }
}

    Development mode:

npm run dev

Production build:

    npm run build
    npm start

🎨 UI and User Experience

    Design based on:

        Soft gradients (blues, violets, greens).

        Glassmorphism effects (translucent cards).

        Rounded corners and soft shadows.

    Reusable components:

        Button, Badge, Card, TicketCard, CommentList, CommentForm, etc.

    Responsive layouts:

        Agent panel: two columns (filterable list + detail).

        Client panel: ticket creation + list + detail.

    Polished UX:

        Empty states (“no tickets yet”, “no comments”).

        Console logging for errors and some success/failure messages in the UI.

    Logout button in both client and agent panels to clear session and redirect to login.

🧭 Potential Future Improvements

    Password recovery / reset flow.

    Admin panel for managing users and roles.

    Notification system (email or in-app).

    File attachments for tickets (screenshots, documents).

    Pagination and advanced search for tickets.

    Stats and metrics for agents:

        Number of resolved tickets.

        Response times.

        SLA tracking.

    Full internationalization (i18n) with multiple languages.

    Integration with OAuth providers (Google, GitHub, etc.).

    Assign tickets to specific agents and more detailed states (e.g., “waiting for client”).

📄 License

This project can be adapted to any license you prefer (MIT, GPL, proprietary, etc.).
Example (MIT):

This project is distributed under the MIT license. You are free to use, modify, and distribute it, as long as you preserve the original copyright notice.

👤 Author

    Name: Jose Doria
