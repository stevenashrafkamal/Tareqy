# 🚀 Tareqy (طريقي) - Career Roadmap & Progress Tracker

![Tareqy Banner](taryqy.webp)

**Tareqy** is a comprehensive platform designed to empower programmers to track their learning progress, follow structured roadmaps, and manage their educational journey effectively. This project is built using the **MEAN Stack** with a focus on scalability and clean architecture.

## 🌟 Overview
Developing Tareqy was a challenging yet rewarding journey, aimed at solving the common problem of "tutorial hell" by providing a clear path for skill acquisition and verification through challenges and checkpoints.

## 🛠️ Tech Stack

### **Frontend**
*   **Framework:** Angular (v17+)
*   **Styling:** CSS3 with a focus on responsive design
*   **State Management:** Reactive programming with RxJS

### **Backend**
*   **Runtime:** Node.js
*   **Framework:** Express.js
*   **Database:** MongoDB with Mongoose ODM
*   **Testing:** Unit and Integration testing with Jest
*   **Authentication:** JWT (JSON Web Tokens) with OTP verification

## ✨ Core Features

*   **Roadmap Tracking:** Users can visualize and track their progress through various learning paths.
*   **Challenge System:** Integrated challenges to test coding skills with submission tracking.
*   **Checkpoint Management:** Structured levels and resources to ensure a logical learning flow.
*   **Code Reviewer & Admin Dashboards:** Dedicated interfaces for different user roles (Admin, Instructor, Code Reviewer).
*   **Gamification:** Scoring system and progress logs to keep users motivated.
*   **Feedback & Reports:** Robust reporting system for both users and administrators.

## 📂 Project Structure
```text
├── Backend/                 # Express server & MongoDB logic
│   ├── Database/            # Models (User, Score, etc.) and Connection
│   ├── Modules/             # Business logic (Challenge, Submission, Resources)
│   ├── Middlewares/         # Auth, Validations, and Error Handling
│   └── tests/               # Comprehensive Jest test suites
├── frontend/                # Angular application
│   ├── app/features/        # Modular components (Auth, Dashboard, Profile)
│   ├── app/services/        # API integration services
│   └── app/shared/          # Reusable models and components
```

## ⚙️ Installation & Setup
**Backend Setup**
Navigate to the Backend folder:

```Bash
cd Backend
```
Install dependencies:

```Bash
npm install
```
Configure your .env file with PORT, DB_CONNECTION, and JWT_SECRET.

(Optional) Seed the database with initial data:

```Bash
node seed.js
```
Start the server:

```Bash
   npm start
```
Frontend Setup
Navigate to the frontend folder:

```Bash
cd frontend
```
2. Install dependencies:
   ```bash
   npm install
Run the application:

```Bash
ng serve
```
   Open `http://localhost:4200` in your browser.

## 👨‍💻 Developer
**Steven Ashraf**
Full-Stack Developer | Computer Science Student at Minya University
