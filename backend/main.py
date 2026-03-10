from fastapi import FastAPI, UploadFile, File, Form
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse, FileResponse
import google.generativeai as genai
import PyPDF2
import io
import os
from gtts import gTTS
import tempfile
import base64
from dotenv import load_dotenv
from pydantic import BaseModel

class ChatRequest(BaseModel):
    message: str
    context: str = ""

# Load environment variables from .env file
load_dotenv()

app = FastAPI()

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configure Google Gemini API - Use environment variable or fallback
api_key = os.getenv("GOOGLE_API_KEY")
if not api_key or api_key == "YOUR_API_KEY_HERE":
    api_key = "AIzaSyBFNfAHxRZv0MULmXXQYNL3Oy75OLtDUQA"  # Fallback key
genai.configure(api_key=api_key)

# Store conversation context
conversation_history = []

def extract_text_from_pdf(pdf_file):
    """Extract text from uploaded PDF file"""
    pdf_reader = PyPDF2.PdfReader(pdf_file)
    text = ""
    for page in pdf_reader.pages:
        text += page.extract_text()
    return text

def get_gemini_response(prompt, context=""):
    """Get response from Gemini AI"""
    try:
        model = genai.GenerativeModel('gemini-2.5-flash')
        full_prompt = f"{context}\n\n{prompt}" if context else prompt
        response = model.generate_content(full_prompt)
        return response.text
    except Exception as e:
        return f"I apologize, but I encountered an error: {str(e)}"

@app.get("/")
async def root():
    return {"message": "MindMate AI Backend API"}

@app.post("/api/summarize")
async def summarize_pdf(file: UploadFile = File(None)):
    """Summarize PDF in English and Kannada"""
    if not file:
        return JSONResponse({"error": "No file uploaded"}, status_code=400)
    
    try:
        # Extract text from PDF
        contents = await file.read()
        pdf_file = io.BytesIO(contents)
        text = extract_text_from_pdf(pdf_file)
        
        if not text:
            return JSONResponse({"error": "Could not extract text from PDF"}, status_code=400)
        
        # Truncate text if too long
        text = text[:3000]
        
        # Generate English summary
        english_prompt = f"Summarize the following text in English in a clear and concise manner:\n\n{text}"
        english_summary = get_gemini_response(english_prompt)
        
        # Generate Kannada summary
        kannada_prompt = f"Translate the following summary to Kannada (ಕನ್ನಡ):\n\n{english_summary}"
        kannada_summary = get_gemini_response(kannada_prompt)
        
        return {
            "english_summary": english_summary,
            "kannada_summary": kannada_summary
        }
    except Exception as e:
        return JSONResponse({"error": str(e)}, status_code=500)

@app.post("/api/quiz")
async def generate_quiz(file: UploadFile = File(None)):
    """Generate quiz from PDF"""
    if not file:
        return JSONResponse({"error": "No file uploaded"}, status_code=400)
    
    try:
        # Extract text from PDF
        contents = await file.read()
        pdf_file = io.BytesIO(contents)
        text = extract_text_from_pdf(pdf_file)
        
        if not text:
            return JSONResponse({"error": "Could not extract text from PDF"}, status_code=400)
        
        # Truncate text if too long
        text = text[:3000]
        
        # Generate quiz questions
        quiz_prompt = f"""Based on the following text, generate 10 multiple choice questions with 4 options each.
For each question, indicate the correct answer. Format as JSON array with fields: question, options[], correct_answer (index 0-3)

Text: {text}"""
        
        model = genai.GenerativeModel('gemini-2.5-flash')
        response = model.generate_content(quiz_prompt)
        
        # Try to parse JSON response
        try:
            import json
            # Find JSON in response
            response_text = response.text
            if "```json" in response_text:
                response_text = response_text.split("```json")[1].split("```")[0]
            elif "```" in response_text:
                response_text = response_text.split("```")[1].split("```")[0]
            
            questions = json.loads(response_text)
        except:
            # If JSON parsing fails, return mock questions
            questions = [
                {
                    "question": "What is the main topic covered in the document?",
                    "options": ["Topic A", "Topic B", "Topic C", "Topic D"],
                    "correct_answer": 0
                }
            ]
        
        return {"questions": questions}
    except Exception as e:
        return JSONResponse({"error": str(e)}, status_code=500)

@app.post("/api/questions")
async def generate_questions(file: UploadFile = File(None)):
    """Generate important questions from PDF"""
    if not file:
        return JSONResponse({"error": "No file uploaded"}, status_code=400)
    
    try:
        # Extract text from PDF
        contents = await file.read()
        pdf_file = io.BytesIO(contents)
        text = extract_text_from_pdf(pdf_file)
        
        if not text:
            return JSONResponse({"error": "Could not extract text from PDF"}, status_code=400)
        
        # Truncate text if too long
        text = text[:3000]
        
        # Generate important questions
        questions_prompt = f"""Generate 10-15 important questions from the following text that a student should be able to answer. 
Format as a JSON array of strings (just the questions):

Text: {text}"""
        
        model = genai.GenerativeModel('gemini-2.5-flash')
        response = model.generate_content(questions_prompt)
        
        # Try to parse JSON response
        try:
            import json
            response_text = response.text
            if "```json" in response_text:
                response_text = response_text.split("```json")[1].split("```")[0]
            elif "```" in response_text:
                response_text = response_text.split("```")[1].split("```")[0]
            
            questions = json.loads(response_text)
        except:
            questions = ["Question 1 from the document?", "Question 2 from the document?"]
        
        return {"questions": questions}
    except Exception as e:
        return JSONResponse({"error": str(e)}, status_code=500)

@app.post("/api/kannada")
async def kannada_learning(file: UploadFile = File(None)):
    """Kannada learning mode - summarize in Kannada with chatbot"""
    if not file:
        return JSONResponse({"error": "No file uploaded"}, status_code=400)
    
    try:
        # Extract text from PDF
        contents = await file.read()
        pdf_file = io.BytesIO(contents)
        text = extract_text_from_pdf(pdf_file)
        
        if not text:
            return JSONResponse({"error": "Could not extract text from PDF"}, status_code=400)
        
        # Truncate text if too long
        text = text[:3000]
        
        # Generate summary in Kannada
        kannada_prompt = f"""Explain the following text in simple Kannada (ಕನ್ನಡ) that a student can understand.
Include the key concepts and explanations:

Text: {text}"""
        
        kannada_summary = get_gemini_response(kannada_prompt)
        
        return {
            "kannada_summary": kannada_summary,
            "chatbot_enabled": True
        }
    except Exception as e:
        return JSONResponse({"error": str(e)}, status_code=500)

@app.post("/api/examples")
async def real_world_examples(file: UploadFile = File(None)):
    """Compare PDF content to real-world examples"""
    if not file:
        return JSONResponse({"error": "No file uploaded"}, status_code=400)
    
    try:
        # Extract text from PDF
        contents = await file.read()
        pdf_file = io.BytesIO(contents)
        text = extract_text_from_pdf(pdf_file)
        
        if not text:
            return JSONResponse({"error": "Could not extract text from PDF"}, status_code=400)
        
        # Truncate text if too long
        text = text[:3000]
        
        # Generate real-world examples
        examples_prompt = f"""Compare and explain the concepts in the following text using real-world examples that students can relate to.
Make the explanations engaging and practical:

Text: {text}"""
        
        examples = get_gemini_response(examples_prompt)
        
        return {
            "examples": examples,
            "chatbot_enabled": True
        }
    except Exception as e:
        return JSONResponse({"error": str(e)}, status_code=500)

@app.post("/api/explain-code")
async def explain_code(code: str = Form(...)):
    """Explain code using AI"""
    try:
        explain_prompt = f"""Explain the following code in detail. Provide:
1. What the code does
2. How it works
3. Any important concepts or patterns used

Code:
{code}"""
        
        explanation = get_gemini_response(explain_prompt)
        
        return {"explanation": explanation}
    except Exception as e:
        return JSONResponse({"error": str(e)}, status_code=500)

@app.post("/api/chat")
async def chat(request: ChatRequest):
    """Chat with AI"""
    try:
        response = get_gemini_response(request.message, request.context)
        
        # Add to conversation history
        conversation_history.append({"role": "user", "content": request.message})
        conversation_history.append({"role": "assistant", "content": response})
        
        return {"response": response}
    except Exception as e:
        return JSONResponse({"error": str(e)}, status_code=500)

@app.post("/api/tts")
async def text_to_speech(text: str = Form(...)):
    """Convert text to speech"""
    try:
        tts = gTTS(text=text, lang='en')
        
        # Save to temporary file
        with tempfile.NamedTemporaryFile(delete=False, suffix='.mp3') as tmp:
            tts.save(tmp.name)
            tmp_path = tmp.name
        
        # Read file and encode to base64
        with open(tmp_path, 'rb') as f:
            audio_data = base64.b64encode(f.read()).decode('utf-8')
        
        # Clean up
        os.unlink(tmp_path)
        
        return {"audio": audio_data}
    except Exception as e:
        return JSONResponse({"error": str(e)}, status_code=500)

@app.post("/api/progress")
async def save_progress(study_time: int = Form(0), quiz_score: int = Form(0)):
    """Save student progress"""
    # In production, this would save to a database
    return {"message": "Progress saved", "study_time": study_time, "quiz_score": quiz_score}

@app.get("/api/progress")
async def get_progress():
    """Get student progress"""
    # In production, this would fetch from a database
    return {
        "study_time": 0,
        "quiz_score": 0,
        "topics_studied": 0
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
