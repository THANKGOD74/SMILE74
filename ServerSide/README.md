#  TaskDuty – Personal Task Manager

A full‑stack task management application built with the **MERN stack** (MongoDB, Express, React, Node.js) using **TypeScript** on both ends and **Tailwind CSS** for styling.  
Users can create, read, update, delete, and filter tasks by category and completion status. The UI is grouped into categories (Urgent, Important, Work, Personal) and is fully responsive.

---

##  Features

### Task Management
-  **CRUD operations** – Create, Read, Update, Delete tasks
-  **Category grouping** – Urgent, Important, Work, Personal
-  **Mark as done / pending** – Toggle completion status
-  **Filter tasks** – By category (All, Work, Personal, Urgent, Important) and by status (All, Completed, Pending)
-  **Due date validation** – Cannot be in the past
-  **Clean UI** – Tailwind CSS, responsive cards, category‑colored badges

### Authentication & Authorization
-  **User registration** – Secure sign‑up with email verification
-  **Login / Logout** – JWT‑based authentication
-  **Email verification** – Verify email before accessing the app
-  **Password reset** – Reset password via email (Brevo integration)
-  **Profile management** – Update name and password
-  **Protected routes** – Redirect to login if not authenticated
-  **User isolation** – Each user sees only their own tasks

### Frontend Enhancements
-  **Smooth animations** – Framer Motion for page transitions and interactions
-  **Fully responsive** – Works on mobile, tablet, and desktop
-  **Loading states** – Spinners and disabled buttons during async operations

---

##  Tech Stack

### Backend
- Node.js + Express
- MongoDB + Mongoose (ODM)
- TypeScript
- JWT (JSON Web Tokens)
- bcryptjs (password hashing)
- Brevo (email service)
- CORS, dotenv

### Frontend
- React (functional components, hooks)
- TypeScript
- Vite (build tool)
- Tailwind CSS
- React Router DOM
- Axios (API client)
- Framer Motion (animations)
- Lucide React (icons)

---

##  Folder Structure

TaskDuty/
├── ServerSide/ # Backend
│ ├── src/
│ │ ├── config/
│ │ │ └── db.ts
│ │ ├── controllers/
│ │ │ ├── authController.ts
│ │ │ └── taskController.ts
│ │ ├── middleware/
│ │ │ └── auth.ts
│ │ ├── model/
│ │ │ ├── Task.ts
│ │ │ └── User.ts
│ │ ├── routes/
│ │ │ ├── authRoutes.ts
│ │ │ └── taskRoutes.ts
│ │ ├── services/
│ │ │ └── emailService.ts
│ │ ├── utils/
│ │ │ ├── emailTemplates.ts
│ │ │ └── jwt.ts
│ │ └── server.ts
│ ├── .env
│ └── package.json
│
└── ClientSide/
└── vite-project/ # Frontend
├── src/
│ ├── api/
│ │ ├── api.ts
│ │ ├── authApi.ts
│ │ └── taskApi.ts
│ ├── assets/
│ ├── components/
│ │ ├── ProtectedRoute.tsx
│ │ ├── TaskFormComp/
│ │ │ ├── CategorySection.tsx
│ │ │ ├── TaskCard.tsx
│ │ │ ├── TaskForm.tsx
│ │ │ └── TaskList.tsx
│ │ └── NavBar.tsx
│ ├── context/
│ │ └── AuthContext.tsx
│ ├── hooks/
│ │ └── useTaskManager.ts
│ ├── layouts/
│ │ └── MainLayout.tsx
│ ├── pages/
│ │ ├── CoverPage/
│ │ ├── MyTaskPage/
│ │ ├── NewTaskPage/
│ │ ├── EditTaskPage/
│ │ ├── LoginPage/
│ │ ├── RegisterPage/
│ │ ├── ProfilePage/
│ │ ├── ForgotPasswordPage/
│ │ ├── ResetPasswordPage/
│ │ ├── VerificationSent.tsx
│ │ └── EmailVerified.tsx
│ ├── types/
│ │ └── index.ts
│ ├── App.tsx
│ └── main.tsx
├── .env
└── package.json
