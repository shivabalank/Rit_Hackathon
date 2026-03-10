# MindMate AI Web

MindMate AI Web is a full-stack, AI-powered educational assistant application. It leverages Google's advanced Generative AI (Gemini 2.5 Flash) to help users process, learn, and interact with the contents of PDF documents. 

## 🚀 Features

* **PDF Summarization**: Upload any document and get concise, highly readable summaries instantly.
* **Interactive AI Chat**: Ask questions directly about the uploaded PDF's content, and the AI will scan the text and provide accurate answers.
* **Automated Quiz Generation**: Test your knowledge! Generating interactive quizzes based directly on the contents of your studied material.

## 💻 Tech Stack

**Frontend:**
* React 18 & Vite
* Tailwind CSS
* React Router DOM & Axios

**Backend:**
* Python 3.13 & FastAPI (Uvicorn)
* Google Generative AI (gemini-2.5-flash)
* PyPDF2 (PDF text extraction)

## 🛠️ Setup Instructions

### Backend Setup
1. Navigate to `backend/`
2. Install dependencies: `pip install -r requirements.txt`
3. Add a `.env` file with `GOOGLE_API_KEY=your_key`
4. Run server: `python main.py`

### Frontend Setup
1. Navigate to `frontend/`
2. Install dependencies: `npm install`
3. Run the vite client: `npm run dev`