# MindMate AI - Project Specification

## 1. Project Overview
- **Project Name**: MindMate AI
- **Type**: Full-stack Web Application (AI Study Buddy)
- **Core Functionality**: AI-powered study assistant that helps engineering students understand academic topics using Gemini AI, with support for English and Kannada explanations
- **Target Users**: Engineering students seeking academic assistance

## 2. Tech Stack
- **Frontend**: React + Vite + Tailwind CSS
- **Backend**: FastAPI (Python)
- **AI**: Google Generative AI (Gemini API)
- **PDF Processing**: PyPDF2, pdf2image
- **OCR**: Pillow
- **Text-to-Speech**: gTTS
- **Database**: LocalStorage (for student progress)

## 3. Color Palette
- **Primary**: #4f46E5 (Indigo)
- **Secondary**: #7c3aed (Purple)
- **Background**: #f8fafc (Light Grey)
- **Accent**: #22c55e (Green)

## 4. UI/UX Specification

### 4.1 Navigation Bar (Fixed)
- **Position**: Fixed top, full width
- **Left Section**: Logo + "About Us" + "Contact Us" buttons
- **Right Section**: Profile icon showing student progress
- **Background**: Primary color (#4f46E5)
- **Height**: 64px

### 4.2 Home Page - 6 Feature Cards
Each card 300px height, rounded corners (16px), shadow:

1. **Summarize Card** (#90D5FF - Light Blue)
   - Icon: Document/summary image
   - Heading: "Summarize"
   - Description: 2-line paragraph
   - Input: PDF upload button
   
2. **Quick Quiz Card** (#FFF44F - Yellow)
   - Icon: Quiz/question mark image
   - Heading: "Quick Quiz"
   - Description: 2-line paragraph
   - Input: PDF upload button

3. **Generate Questions Card** (#ff2c2c - Red)
   - Icon: Question generation image
   - Heading: "Generate Questions"
   - Description: 2-line paragraph
   - Input: PDF upload button

4. **Kannada Learning Mode Card** (#ffdbbb - Peach)
   - Icon: Kannada font image
   - Heading: "Kannada Learning Mode"
   - Description: 2-line paragraph
   - Input: PDF upload button

5. **Real-World Examples Card** (#ffb6c1 - Pink)
   - Icon: Web/world image
   - Heading: "Real-World Examples"
   - Description: 2-line paragraph
   - Input: PDF upload button

6. **Code Explainer Card** (#88e788 - Green)
   - Icon: Code image
   - Heading: "Codium"
   - Description: 2-line paragraph
   - Input: Text input with placeholder "Have any doubt in coding?"

### 4.3 Chatbot (Fixed Bottom-Right)
- **Position**: Fixed bottom-right corner
- **Trigger**: Floating button with chat icon
- **Chat Window**: 
  - Welcome message: "Hi👋, I am MindMate AI your study buddy😉<br>How can I help you?😊"
  - Text input + Voice-to-text button
  - Text-to-speech option for responses

### 4.4 Footer
- **Position**: Bottom of page
- **Content**: Copyright, Email, GitHub, LinkedIn links

## 5. Page Routes

### 5.1 / (Home)
- Navbar + 6 feature cards + Footer

### 5.2 /about
- Card in middle with paragraph about the app

### 5.3 /contact
- Card in middle with contact information

### 5.4 /summarize
- 2 cards: English summary + Kannada summary
- Background: Light blue (#90D5FF)

### 5.5 /quiz
- Quiz interface with 10 questions
- 4 options per question (Kahoot-style)
- Wrong = Red, Correct = Green
- Score calculation at end

### 5.6 /generate-questions
- Single card with generated questions (10-15)
- Background: Red (#ff2c2c)

### 5.7 /kannada-learning
- Summary in Kannada
- Chatbot for doubts
- Background: Peach (#ffdbbb)

### 5.8 /real-world-examples
- PDF compared to real-world examples
- Chatbot for doubts
- Background: Pink (#ffb6c1)

### 5.9 /code-explainer
- Input code explanation
- Background: Green (#88e788)

## 6. API Endpoints (Backend)

### 6.1 /api/summarize
- Input: PDF file
- Output: English summary + Kannada summary

### 6.2 /api/quiz
- Input: PDF file
- Output: 10 multiple choice questions

### 6.3 /api/questions
- Input: PDF file
- Output: 10-15 important questions

### 6.4 /api/kannada
- Input: PDF file
- Output: Kannada summary

### 6.5 /api/examples
- Input: PDF file
- Output: Real-world examples

### 6.6 /api/explain-code
- Input: Code string
- Output: Explanation

### 6.7 /api/chat
- Input: User message
- Output: AI response

### 6.8 /api/tts
- Input: Text
- Output: Audio file

### 6.9 /api/speech-to-text
- Input: Audio
- Output: Text

## 7. Student Progress Tracking
- Store in localStorage:
  - Total study time
  - Quiz scores
  - Topics studied

## 8. Acceptance Criteria
- [ ] Navbar fixed at top with logo, About, Contact, Profile
- [ ] 6 cards displayed with correct colors and content
- [ ] PDF upload works for relevant cards
- [ ] Chatbot fixed at bottom-right
- [ ] Voice-to-text and text-to-speech functional
- [ ] Gemini AI integration for all AI features
- [ ] Responsive design
- [ ] Footer with social links

