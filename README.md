# 🧠 AI Study Buddy

AI Study Buddy is an intelligent web application designed to help engineering students understand academic topics quickly using AI. The platform generates simplified explanations, beginner-friendly summaries, and Kannada explanations for better accessibility.

This project was developed during a **24-hour hackathon** under the **AI domain** at **Rajeev Institute of Technology, Hassan**.

---

## 🚀 Problem Statement

Many engineering students struggle to understand complex subjects due to:

* Difficult technical explanations
* Language barriers
* Lack of personalized study tools

AI Study Buddy solves this by using AI to generate **clear explanations, simplified learning content, and regional language support**.

---

## 💡 Key Features

* 📘 **AI Topic Explanation** – Get clear explanations of any academic topic
* 🧠 **Beginner Mode** – Simplified explanations for beginners
* 🌐 **Kannada Mode** – Learn concepts in Kannada for better understanding
* ⚡ **Instant AI Responses** – Fast and accurate topic explanations
* 🎯 **Student Friendly UI** – Simple interface for quick learning

---

## 🛠 Tech Stack

### Frontend

* React.js
* JavaScript
* CSS / Tailwind (optional)

### Backend

* Node.js
* Express.js

### AI Integration

* OpenAI API (GPT-4o-mini) or Gemini API

### Other Tools

* Axios
* Dotenv
* CORS

---

## 🏗 Project Architecture

Frontend (React)
⬇
Backend API (Node.js + Express)
⬇
AI Model (OpenAI API/ Gemini API)

---

## 📂 Project Structure

```
ai-study-buddy
│
├── backend
│   ├── server.js
│   ├── routes
│   │   └── aiRoutes.js
│   ├── controllers
│   │   └── aiController.js
│   └── .env
│
├── frontend
│   └── src
│       └── App.js
│
└── README.md
```

---

## ⚙️ Installation & Setup

### 1️⃣ Clone the Repository

```
git clone https://github.com/shivabalank/Rit_Hackathon.git
cd ai-study-buddy
```

---

### 2️⃣ Setup Backend

```
cd backend
npm install
```

Create `.env` file:

```
OPENAI_API_KEY=your_api_key_here
```

Run backend server:

```
node server.js
```

---

### 3️⃣ Setup Frontend

Open new terminal:

```
cd frontend
npm install
npm start
```

Applicatio
