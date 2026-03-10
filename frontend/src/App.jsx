import { Routes, Route, Link, useNavigate, useLocation } from 'react-router-dom'
import { useState, useEffect, useRef } from 'react'
import axios from 'axios'
import { 
  Brain, FileText, HelpCircle, Globe, Code, 
  MessageCircle, Upload, X, Send, Volume2, Mic, 
  User, Github, Linkedin, Mail,
  ChevronRight, BookOpen, Sparkles, Cpu, ClipboardList
} from 'lucide-react'

const API_URL = 'http://localhost:8000'

// Color palette
const COLORS = {
  primary: '#4f46E5',
  secondary: '#7c3aed',
  background: '#f8fafc',
  accent: '#22c55e',
}

// Navbar Component
function Navbar() {
  const [showProfile, setShowProfile] = useState(false)
  const [progress, setProgress] = useState({ study_time: 0, quiz_score: 0, topics_studied: 0 })
  const location = useLocation()

  useEffect(() => {
    const savedProgress = localStorage.getItem('mindmate_progress')
    if (savedProgress) {
      setProgress(JSON.parse(savedProgress))
    }
  }, [])

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-r from-primary to-secondary shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-4">
            <Link to="/" className="flex items-center space-x-2">
              <div className="bg-white/20 p-2 rounded-xl">
                <Brain className="h-8 w-8 text-white" />
              </div>
              <span className="text-white text-xl font-bold">MindMate AI</span>
            </Link>
            <div className="hidden md:flex items-center space-x-2 ml-8">
              <Link to="/about" className="text-white/90 hover:text-white hover:bg-white/10 px-4 py-2 rounded-lg transition-all">
                About Us
              </Link>
              <Link to="/contact" className="text-white/90 hover:text-white hover:bg-white/10 px-4 py-2 rounded-lg transition-all">
                Contact Us
              </Link>
            </div>
          </div>
          <div className="relative">
            <button onClick={() => setShowProfile(!showProfile)} className="flex items-center space-x-2 bg-white/10 hover:bg-white/20 px-4 py-2 rounded-lg transition-all">
              <User className="h-5 w-5 text-white" />
              <span className="text-white text-sm font-medium">Profile</span>
            </button>
            {showProfile && (
              <div className="absolute right-0 mt-2 w-72 bg-white rounded-xl shadow-2xl overflow-hidden">
                <div className="p-4 bg-gradient-to-r from-primary to-secondary">
                  <h3 className="text-white font-bold text-lg">Your Progress</h3>
                </div>
                <div className="p-4 space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Study Time</span>
                    <span className="font-bold text-primary">{progress.study_time || 0} mins</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Quiz Score</span>
                    <span className="font-bold text-accent">{progress.quiz_score || 0} pts</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Topics Studied</span>
                    <span className="font-bold text-secondary">{progress.topics_studied || 0}</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}

// Footer Component
function Footer() {
  return (
    <footer className="bg-gray-900 text-white py-8 mt-auto">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <Brain className="h-8 w-8 text-primary" />
              <span className="text-xl font-bold">MindMate AI</span>
            </div>
            <p className="text-gray-400 text-sm">Your AI-powered study buddy for engineering students.</p>
          </div>
          <div>
            <h4 className="font-bold mb-4">Quick Links</h4>
            <ul className="space-y-2 text-gray-400">
              <li><Link to="/about" className="hover:text-primary transition">About Us</Link></li>
              <li><Link to="/contact" className="hover:text-primary transition">Contact</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold mb-4">Features</h4>
            <ul className="space-y-2 text-gray-400">
              <li>PDF Summarization</li>
              <li>Quiz Generation</li>
              <li>Kannada Learning</li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold mb-4">Connect</h4>
            <div className="flex space-x-4">
              <a href="mailto:hello@mindmate.ai" className="hover:text-primary transition"><Mail className="h-6 w-6" /></a>
              <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition"><Github className="h-6 w-6" /></a>
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition"><Linkedin className="h-6 w-6" /></a>
            </div>
          </div>
        </div>
        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
          <p>© 2024 MindMate AI. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}

// Chatbot Component
function Chatbot() {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState([
    { role: 'assistant', content: 'Hi👋, I am MindMate AI your study buddy😉<br/>How can I help you?😊' }
  ])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isListening, setIsListening] = useState(false)
  const messagesEndRef = useRef(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSend = async () => {
    if (!input.trim()) return
    const userMessage = input
    setInput('')
    setMessages(prev => [...prev, { role: 'user', content: userMessage }])
    setIsLoading(true)
    try {
      const response = await axios.post(`${API_URL}/api/chat`, { message: userMessage, context: '' })
      setMessages(prev => [...prev, { role: 'assistant', content: response.data.response }])
    } catch (error) {
      setMessages(prev => [...prev, { role: 'assistant', content: 'Sorry, I encountered an error. Please try again.' }])
    }
    setIsLoading(false)
  }

  const handleVoiceInput = () => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
      const recognition = new SpeechRecognition()
      recognition.onstart = () => setIsListening(true)
      recognition.onend = () => setIsListening(false)
      recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript
        setInput(transcript)
      }
      recognition.start()
    } else {
      alert('Voice input is not supported in your browser.')
    }
  }

  const handleTextToSpeech = (text) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text.replace(/<[^>]*>/g, ''))
      speechSynthesis.speak(utterance)
    }
  }

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {!isOpen && (
        <button onClick={() => setIsOpen(true)} className="bg-gradient-to-r from-primary to-secondary p-4 rounded-full shadow-2xl hover:scale-110 transition-transform">
          <MessageCircle className="h-8 w-8 text-white" />
        </button>
      )}
      {isOpen && (
        <div className="bg-white rounded-2xl shadow-2xl w-96 h-[500px] flex flex-col overflow-hidden">
          <div className="bg-gradient-to-r from-primary to-secondary p-4 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Brain className="h-6 w-6 text-white" />
              <span className="text-white font-bold">MindMate AI</span>
            </div>
            <button onClick={() => setIsOpen(false)} className="text-white/80 hover:text-white"><X className="h-5 w-5" /></button>
          </div>
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((msg, idx) => (
              <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[80%] p-3 rounded-xl ${msg.role === 'user' ? 'bg-primary text-white' : 'bg-gray-100 text-gray-800'}`}>
                  <p dangerouslySetInnerHTML={{ __html: msg.content }} />
                  {msg.role === 'assistant' && (
                    <button onClick={() => handleTextToSpeech(msg.content)} className="mt-2 text-xs flex items-center space-x-1 text-primary hover:text-secondary">
                      <Volume2 className="h-3 w-3" /><span>Listen</span>
                    </button>
                  )}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-gray-100 p-3 rounded-xl">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-primary rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-primary rounded-full animate-bounce delay-100"></div>
                    <div className="w-2 h-2 bg-primary rounded-full animate-bounce delay-200"></div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
          <div className="p-4 border-t">
            <div className="flex items-center space-x-2">
              <button onClick={handleVoiceInput} className={`p-2 rounded-lg transition ${isListening ? 'bg-red-500 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>
                <Mic className="h-5 w-5" />
              </button>
              <input type="text" value={input} onChange={(e) => setInput(e.target.value)} onKeyPress={(e) => e.key === 'Enter' && handleSend()} placeholder="Ask me anything..." className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:border-primary" />
              <button onClick={handleSend} className="p-2 bg-primary text-white rounded-lg hover:bg-secondary transition"><Send className="h-5 w-5" /></button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

// Home Page
function Home() {
  const navigate = useNavigate()
  const features = [
    { id: 'summarize', title: 'Summarize', description: 'Upload your PDF and get concise summaries in English and Kannada.', color: '#90D5FF', textColor: 'white', image: '📄' },
    { id: 'quiz', title: 'Quick Quiz', description: 'Test your knowledge with AI-generated quizzes based on your study materials.', color: '#FFF44F', textColor: 'black', image: '❓' },
    { id: 'questions', title: 'Generate Questions', description: 'Generate important questions from your notes to prepare for exams.', color: '#ff2c2c', textColor: 'white', image: '📝' },
    { id: 'kannada', title: 'Kannada Learning Mode', description: 'Learn in Kannada with AI-powered explanations and chatbot support.', color: '#ffdbbb', textColor: 'black', image: 'ಕನ್ನಡ' },
    { id: 'examples', title: 'Real-World Examples', description: 'Understand concepts better with practical real-world examples.', color: '#ffb6c1', textColor: 'black', image: '🌍' },
    { id: 'code', title: 'Codium', description: 'Have coding doubts? Get instant explanations for any code snippet.', color: '#88e788', textColor: 'black', image: '💻' }
  ]

  const handleFileUpload = (featureId, file) => {
    const featureMap = { 'summarize': '/summarize', 'quiz': '/quiz', 'questions': '/generate-questions', 'kannada': '/kannada-learning', 'examples': '/real-world-examples' }
    navigate(featureMap[featureId], { state: { file } })
  }

  return (
    <div className="min-h-screen pt-20 pb-12 gradient-bg">
      <div className="text-center py-16 px-4">
        <h1 className="text-5xl font-bold text-gray-900 mb-4">Welcome to <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">MindMate AI</span></h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">Your AI-powered study buddy that helps engineering students understand academic topics with ease.</p>
        <div className="mt-8 flex justify-center space-x-4">
          <div className="bg-white/50 backdrop-blur px-4 py-2 rounded-full flex items-center space-x-2"><Sparkles className="h-5 w-5 text-accent" /><span className="text-gray-700">Powered by Gemini AI</span></div>
          <div className="bg-white/50 backdrop-blur px-4 py-2 rounded-full flex items-center space-x-2"><Globe className="h-5 w-5 text-primary" /><span className="text-gray-700">English & Kannada</span></div>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature) => (
            <div key={feature.id} className="rounded-2xl p-6 shadow-lg" style={{ backgroundColor: feature.color }}>
              <div className="text-6xl mb-4 text-center">{feature.image}</div>
              <h3 className="text-2xl font-bold mb-3 text-center" style={{ color: feature.textColor }}>{feature.title}</h3>
              <p className="text-center mb-6" style={{ color: feature.textColor, opacity: 0.9 }}>{feature.description}</p>
              <div className="mt-auto">
                {feature.id === 'code' ? (
                  <div className="space-y-2">
                    <input type="text" id="codeInput" placeholder="Have any doubt in coding?" className="w-full px-4 py-3 rounded-lg border-2 border-white/50 bg-white/80 focus:outline-none focus:border-primary" />
                    <button onClick={() => { const v = document.getElementById('codeInput').value; if(v) navigate('/code-explainer', { state: { code: v } }) }} className="w-full py-3 rounded-lg font-semibold text-white bg-gray-900 hover:bg-gray-800">Explain Code</button>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <label className="block">
                      <div className="w-full py-3 rounded-lg border-2 border-dashed border-white/50 bg-white/30 hover:bg-white/50 transition cursor-pointer flex items-center justify-center space-x-2">
                        <Upload className="h-5 w-5" style={{ color: feature.textColor }} />
                        <span className="font-medium" style={{ color: feature.textColor }}>Upload PDF</span>
                      </div>
                      <input type="file" accept=".pdf" className="hidden" onChange={(e) => e.target.files[0] && handleFileUpload(feature.id, e.target.files[0])} />
                    </label>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

// About Page
function About() {
  return (
    <div className="min-h-screen pt-24 pb-12 px-4">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="flex items-center justify-center mb-6"><Brain className="h-16 w-16 text-primary" /></div>
          <h1 className="text-4xl font-bold text-center mb-6 text-gray-900">About MindMate AI</h1>
          <div className="text-gray-600 leading-relaxed">
            <p className="mb-4 text-lg">MindMate AI is your intelligent study companion designed specifically for engineering students. Powered by Google's Gemini AI, it helps you understand complex academic topics through summarization, quizzes, and interactive learning modes.</p>
            <p className="mb-4 text-lg">Our mission is to make learning accessible and engaging. Whether you need to summarize lengthy PDFs, practice with generated quizzes, or learn in your native language, MindMate AI is here to help you succeed.</p>
            <p className="text-lg">We support both English and Kannada languages, ensuring that language is never a barrier to your education.</p>
          </div>
          <div className="mt-8 grid grid-cols-3 gap-4 text-center">
            <div className="p-4 bg-primary/10 rounded-xl"><Cpu className="h-8 w-8 mx-auto text-primary mb-2" /><div className="font-bold text-primary">AI-Powered</div></div>
            <div className="p-4 bg-secondary/10 rounded-xl"><Globe className="h-8 w-8 mx-auto text-secondary mb-2" /><div className="font-bold text-secondary">Bilingual</div></div>
            <div className="p-4 bg-accent/10 rounded-xl"><BookOpen className="h-8 w-8 mx-auto text-accent mb-2" /><div className="font-bold text-accent">Smart Learning</div></div>
          </div>
        </div>
      </div>
    </div>
  )
}

// Contact Page
function Contact() {
  return (
    <div className="min-h-screen pt-24 pb-12 px-4">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="flex items-center justify-center mb-6"><MessageCircle className="h-16 w-16 text-primary" /></div>
          <h1 className="text-4xl font-bold text-center text-gray-900 mb-6">Contact Us</h1>
          <div className="text-gray-600 leading-relaxed">
            <p className="mb-6 text-lg text-center">We'd love to hear from you!</p>
            <div className="space-y-4">
              <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-xl"><Mail className="h-6 w-6 text-primary" /><div><div className="font-semibold">Email</div><div className="text-gray-600">hello@mindmate.ai</div></div></div>
              <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-xl"><Github className="h-6 w-6 text-gray-900" /><div><div className="font-semibold">GitHub</div><div className="text-gray-600">github.com/mindmate-ai</div></div></div>
              <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-xl"><Linkedin className="h-6 w-6 text-blue-600" /><div><div className="font-semibold">LinkedIn</div><div className="text-gray-600">linkedin.com/company/mindmate-ai</div></div></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// Summarize Page
function SummarizePage() {
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState(null)
  const navigate = useNavigate()
  const location = useLocation()

  useEffect(() => { if (location.state?.file) handleFile(location.state.file) }, [location.state])

  const handleFile = async (file) => {
    setLoading(true)
    try {
      const formData = new FormData()
      formData.append('file', file)
      const response = await axios.post(`${API_URL}/api/summarize`, formData, { headers: { 'Content-Type': 'multipart/form-data' } })
      setResult(response.data)
      const progress = JSON.parse(localStorage.getItem('mindmate_progress') || '{"study_time": 0, "quiz_score": 0, "topics_studied": 0}')
      progress.study_time += 15
      progress.topics_studied += 1
      localStorage.setItem('mindmate_progress', JSON.stringify(progress))
    } catch (error) {
      console.error('Error:', error)
      setResult({ error: 'Failed to summarize. Please try again.' })
    }
    setLoading(false)
  }

  return (
    <div className="min-h-screen pt-24 pb-12 px-4" style={{ backgroundColor: '#90D5FF' }}>
      <div className="max-w-6xl mx-auto">
        <button onClick={() => navigate('/')} className="mb-6 flex items-center space-x-2 text-white font-semibold hover:underline"><ChevronRight className="h-5 w-5 rotate-180" /><span>Back to Home</span></button>
        {!result && !loading && (
          <div className="bg-white rounded-2xl shadow-xl p-12 text-center">
            <FileText className="h-24 w-24 mx-auto text-primary mb-6" />
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Upload PDF to Summarize</h2>
            <p className="text-gray-600 mb-8">Get instant summaries in English and Kannada</p>
            <label className="inline-flex items-center space-x-2 px-6 py-3 bg-primary text-white rounded-lg cursor-pointer hover:bg-secondary transition">
              <Upload className="h-5 w-5" /><span>Choose PDF File</span>
              <input type="file" accept=".pdf" className="hidden" onChange={(e) => e.target.files[0] && handleFile(e.target.files[0])} />
            </label>
          </div>
        )}
        {loading && <div className="bg-white rounded-2xl shadow-xl p-12 text-center"><div className="animate-spin rounded-full h-16 w-16 border-4 border-primary border-t-transparent mx-auto mb-6"></div><h2 className="text-2xl font-bold text-gray-900">Analyzing PDF...</h2></div>}
        {result && !result.error && (
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-white rounded-2xl shadow-xl p-6"><h3 className="text-2xl font-bold text-gray-900 mb-4 flex items-center space-x-2"><Globe className="h-6 w-6 text-primary" /><span>English Summary</span></h3><div className="text-gray-700">{result.english_summary}</div></div>
            <div className="bg-white rounded-2xl shadow-xl p-6"><h3 className="text-2xl font-bold text-gray-900 mb-4 flex items-center space-x-2"><span className="text-2xl">ಕನ್ನಡ</span><span>Kannada Summary</span></h3><div className="text-gray-700">{result.kannada_summary}</div></div>
          </div>
        )}
        {result?.error && <div className="bg-white rounded-2xl shadow-xl p-8 text-center"><p className="text-red-500 text-lg">{result.error}</p></div>}
      </div>
    </div>
  )
}

// Quiz Page
function QuizPage() {
  const [loading, setLoading] = useState(false)
  const [questions, setQuestions] = useState(null)
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState(null)
  const [score, setScore] = useState(0)
  const [showResult, setShowResult] = useState(false)
  const navigate = useNavigate()
  const location = useLocation()

  useEffect(() => { if (location.state?.file) handleFile(location.state.file) }, [location.state])

  const handleFile = async (file) => {
    setLoading(true)
    try {
      const formData = new FormData()
      formData.append('file', file)
      const response = await axios.post(`${API_URL}/api/quiz`, formData, { headers: { 'Content-Type': 'multipart/form-data' } })
      setQuestions(response.data.questions)
    } catch (error) {
      setQuestions([{ question: "What is the main concept?", options: ["A", "B", "C", "D"], correct_answer: 0 }])
    }
    setLoading(false)
  }

  const handleAnswer = (index) => {
    if (selectedAnswer !== null) return
    setSelectedAnswer(index)
    const isCorrect = index === questions[currentQuestion].correct_answer
    if (isCorrect) setScore(score + 1)
    setTimeout(() => {
      if (currentQuestion < questions.length - 1) { setCurrentQuestion(currentQuestion + 1); setSelectedAnswer(null) }
      else { setShowResult(true); const p = JSON.parse(localStorage.getItem('mindmate_progress') || '{"quiz_score": 0}'); p.quiz_score += score + (isCorrect ? 1 : 0); localStorage.setItem('mindmate_progress', JSON.stringify(p)) }
    }, 1500)
  }

  return (
    <div className="min-h-screen pt-24 pb-12 px-4" style={{ backgroundColor: '#FFF44F' }}>
      <div className="max-w-4xl mx-auto">
        <button onClick={() => navigate('/')} className="mb-6 flex items-center space-x-2 text-gray-900 font-semibold hover:underline"><ChevronRight className="h-5 w-5 rotate-180" /><span>Back to Home</span></button>
        {!questions && !loading && (
          <div className="bg-white rounded-2xl shadow-xl p-12 text-center">
            <ClipboardList className="h-24 w-24 mx-auto text-primary mb-6" />
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Take a Quick Quiz</h2>
            <p className="text-gray-600 mb-8">Test your knowledge with 10 questions</p>
            <label className="inline-flex items-center space-x-2 px-6 py-3 bg-primary text-white rounded-lg cursor-pointer hover:bg-secondary transition">
              <Upload className="h-5 w-5" /><span>Choose PDF File</span>
              <input type="file" accept=".pdf" className="hidden" onChange={(e) => e.target.files[0] && handleFile(e.target.files[0])} />
            </label>
          </div>
        )}
        {loading && <div className="bg-white rounded-2xl shadow-xl p-12 text-center"><div className="animate-spin rounded-full h-16 w-16 border-4 border-primary border-t-transparent mx-auto mb-6"></div><h2 className="text-2xl font-bold">Generating Quiz...</h2></div>}
        {questions && !showResult && (
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <div className="mb-6"><div className="flex justify-between text-sm text-gray-600 mb-2"><span>Question {currentQuestion + 1} of {questions.length}</span><span>Score: {score}</span></div><div className="h-2 bg-gray-200 rounded-full"><div className="h-full bg-primary rounded-full" style={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}></div></div></div>
            <h3 className="text-2xl font-bold text-gray-900 mb-6">{questions[currentQuestion].question}</h3>
            <div className="space-y-3">
              {questions[currentQuestion].options.map((option, idx) => {
                let bgColor = 'bg-gray-100 hover:bg-gray-200'
                if (selectedAnswer !== null) { if (idx === questions[currentQuestion].correct_answer) bgColor = 'bg-green-500'; else if (idx === selectedAnswer) bgColor = 'bg-red-500' }
                return <button key={idx} onClick={() => handleAnswer(idx)} disabled={selectedAnswer !== null} className={`w-full p-4 rounded-xl text-left font-medium ${bgColor} ${selectedAnswer === null ? 'text-gray-800' : 'text-white'}`}><span className="inline-block w-8 h-8 rounded-full bg-white/20 text-center mr-3">{String.fromCharCode(65 + idx)}</span>{option}</button>
              })}
            </div>
          </div>
        )}
        {showResult && <div className="bg-white rounded-2xl shadow-xl p-8 text-center"><div className="text-6xl mb-4">🎉</div><h2 className="text-3xl font-bold text-gray-900 mb-2">Quiz Complete!</h2><p className="text-5xl font-bold text-primary mb-6">{score} / {questions.length}</p><button onClick={() => { setQuestions(null); setCurrentQuestion(0); setScore(0); setShowResult(false) }} className="px-8 py-3 bg-primary text-white rounded-lg font-semibold hover:bg-secondary">Try Another Quiz</button></div>}
      </div>
    </div>
  )
}

// Generate Questions Page
function GenerateQuestionsPage() {
  const [loading, setLoading] = useState(false)
  const [questions, setQuestions] = useState(null)
  const navigate = useNavigate()
  const location = useLocation()

  useEffect(() => { if (location.state?.file) handleFile(location.state.file) }, [location.state])

  const handleFile = async (file) => {
    setLoading(true)
    try {
      const formData = new FormData()
      formData.append('file', file)
      const response = await axios.post(`${API_URL}/api/questions`, formData, { headers: { 'Content-Type': 'multipart/form-data' } })
      setQuestions(response.data.questions)
    } catch (error) { setQuestions(['Sample question 1?', 'Sample question 2?']) }
    setLoading(false)
  }

  return (
    <div className="min-h-screen pt-24 pb-12 px-4" style={{ backgroundColor: '#ff2c2c' }}>
      <div className="max-w-4xl mx-auto">
        <button onClick={() => navigate('/')} className="mb-6 flex items-center space-x-2 text-white font-semibold hover:underline"><ChevronRight className="h-5 w-5 rotate-180" /><span>Back to Home</span></button>
        {!questions && !loading && (
          <div className="bg-white rounded-2xl shadow-xl p-12 text-center">
            <HelpCircle className="h-24 w-24 mx-auto text-red-500 mb-6" />
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Generate Important Questions</h2>
            <p className="text-gray-600 mb-8">Get 10-15 important questions</p>
            <label className="inline-flex items-center space-x-2 px-6 py-3 bg-primary text-white rounded-lg cursor-pointer hover:bg-secondary transition">
              <Upload className="h-5 w-5" /><span>Choose PDF File</span>
              <input type="file" accept=".pdf" className="hidden" onChange={(e) => e.target.files[0] && handleFile(e.target.files[0])} />
            </label>
          </div>
        )}
        {loading && <div className="bg-white rounded-2xl shadow-xl p-12 text-center"><div className="animate-spin rounded-full h-16 w-16 border-4 border-red-500 border-t-transparent mx-auto mb-6"></div><h2 className="text-2xl font-bold">Generating Questions...</h2></div>}
        {questions && <div className="bg-white rounded-2xl shadow-xl p-8"><div className="flex items-center justify-between mb-6"><h3 className="text-2xl font-bold text-gray-900">Important Questions</h3><span className="px-3 py-1 bg-red-100 text-red-600 rounded-full text-sm font-medium">{questions.length} Questions</span></div><div className="space-y-4">{questions.map((q, idx) => <div key={idx} className="flex items-start space-x-4 p-4 bg-gray-50 rounded-xl"><span className="flex-shrink-0 w-8 h-8 bg-red-500 text-white rounded-full flex items-center justify-center font-bold">{idx + 1}</span><p className="text-gray-800 font-medium">{q}</p></div>)}</div></div>}
      </div>
    </div>
  )
}

// Kannada Learning Page
function KannadaLearningPage() {
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState(null)
  const [chatMessages, setChatMessages] = useState([])
  const [chatInput, setChatInput] = useState('')
  const navigate = useNavigate()
  const location = useLocation()

  useEffect(() => { if (location.state?.file) handleFile(location.state.file) }, [location.state])

  const handleFile = async (file) => {
    setLoading(true)
    try {
      const formData = new FormData()
      formData.append('file', file)
      const response = await axios.post(`${API_URL}/api/kannada`, formData, { headers: { 'Content-Type': 'multipart/form-data' } })
      setResult(response.data)
    } catch (error) { setResult({ kannada_summary: 'Failed to generate summary.' }) }
    setLoading(false)
  }

  const handleChat = async () => {
    if (!chatInput.trim()) return
    const userMsg = chatInput
    setChatInput('')
    setChatMessages([...chatMessages, { role: 'user', content: userMsg }])
    try {
      const response = await axios.post(`${API_URL}/api/chat`, { message: userMsg, context: 'Reply in Kannada' })
      setChatMessages(prev => [...prev, { role: 'assistant', content: response.data.response }])
    } catch (error) { setChatMessages(prev => [...prev, { role: 'assistant', content: 'Error' }]) }
  }

  return (
    <div className="min-h-screen pt-24 pb-12 px-4" style={{ backgroundColor: '#ffdbbb' }}>
      <div className="max-w-6xl mx-auto">
        <button onClick={() => navigate('/')} className="mb-6 flex items-center space-x-2 text-gray-900 font-semibold hover:underline"><ChevronRight className="h-5 w-5 rotate-180" /><span>Back to Home</span></button>
        {!result && !loading && (
          <div className="bg-white rounded-2xl shadow-xl p-12 text-center">
            <div className="text-6xl mb-6">ಕನ್ನಡ</div>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Kannada Learning Mode</h2>
            <label className="inline-flex items-center space-x-2 px-6 py-3 bg-primary text-white rounded-lg cursor-pointer hover:bg-secondary transition">
              <Upload className="h-5 w-5" /><span>Choose PDF File</span>
              <input type="file" accept=".pdf" className="hidden" onChange={(e) => e.target.files[0] && handleFile(e.target.files[0])} />
            </label>
          </div>
        )}
        {loading && <div className="bg-white rounded-2xl shadow-xl p-12 text-center"><div className="animate-spin rounded-full h-16 w-16 border-4 border-primary border-t-transparent mx-auto mb-6"></div><h2 className="text-2xl font-bold">Processing...</h2></div>}
        {result && (
          <div className="grid lg:grid-cols-2 gap-8">
            <div className="bg-white rounded-2xl shadow-xl p-6"><h3 className="text-2xl font-bold text-gray-900 mb-4 flex items-center space-x-2"><span className="text-2xl">ಕನ್ನಡ</span><span>Learning Material</span></h3><div className="text-gray-700 max-h-[500px] overflow-y-auto">{result.kannada_summary}</div></div>
            <div className="bg-white rounded-2xl shadow-xl p-6"><h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center space-x-2"><MessageCircle className="h-5 w-5 text-primary" /><span>Ask Doubts</span></h3><div className="h-[400px] flex flex-col"><div className="flex-1 overflow-y-auto space-y-3 mb-4 p-2">{chatMessages.map((msg, idx) => <div key={idx} className={`p-3 rounded-lg ${msg.role === 'user' ? 'bg-primary text-white ml-8' : 'bg-gray-100 mr-8'}`}>{msg.content}</div>)}</div><div className="flex space-x-2"><input type="text" value={chatInput} onChange={(e) => setChatInput(e.target.value)} onKeyPress={(e) => e.key === 'Enter' && handleChat()} placeholder="Type question..." className="flex-1 px-4 py-2 border rounded-lg" /><button onClick={handleChat} className="p-2 bg-primary text-white rounded-lg"><Send className="h-5 w-5" /></button></div></div></div>
          </div>
        )}
      </div>
    </div>
  )
}

// Real World Examples Page
function RealWorldExamplesPage() {
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState(null)
  const [chatMessages, setChatMessages] = useState([])
  const [chatInput, setChatInput] = useState('')
  const navigate = useNavigate()
  const location = useLocation()

  useEffect(() => { if (location.state?.file) handleFile(location.state.file) }, [location.state])

  const handleFile = async (file) => {
    setLoading(true)
    try {
      const formData = new FormData()
      formData.append('file', file)
      const response = await axios.post(`${API_URL}/api/examples`, formData, { headers: { 'Content-Type': 'multipart/form-data' } })
      setResult(response.data)
    } catch (error) { setResult({ examples: 'Failed to generate examples.' }) }
    setLoading(false)
  }

  const handleChat = async () => {
    if (!chatInput.trim()) return
    const userMsg = chatInput
    setChatInput('')
    setChatMessages([...chatMessages, { role: 'user', content: userMsg }])
    try {
      const response = await axios.post(`${API_URL}/api/chat`, { message: userMsg, context: 'Explain with examples' })
      setChatMessages(prev => [...prev, { role: 'assistant', content: response.data.response }])
    } catch (error) { setChatMessages(prev => [...prev, { role: 'assistant', content: 'Error' }]) }
  }

  return (
    <div className="min-h-screen pt-24 pb-12 px-4" style={{ backgroundColor: '#ffb6c1' }}>
      <div className="max-w-6xl mx-auto">
        <button onClick={() => navigate('/')} className="mb-6 flex items-center space-x-2 text-gray-900 font-semibold hover:underline"><ChevronRight className="h-5 w-5 rotate-180" /><span>Back to Home</span></button>
        {!result && !loading && (
          <div className="bg-white rounded-2xl shadow-xl p-12 text-center">
            <BookOpen className="h-24 w-24 mx-auto text-pink-500 mb-6" />
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Real-World Examples</h2>
            <label className="inline-flex items-center space-x-2 px-6 py-3 bg-primary text-white rounded-lg cursor-pointer hover:bg-secondary transition">
              <Upload className="h-5 w-5" /><span>Choose PDF File</span>
              <input type="file" accept=".pdf" className="hidden" onChange={(e) => e.target.files[0] && handleFile(e.target.files[0])} />
            </label>
          </div>
        )}
        {loading && <div className="bg-white rounded-2xl shadow-xl p-12 text-center"><div className="animate-spin rounded-full h-16 w-16 border-4 border-pink-500 border-t-transparent mx-auto mb-6"></div><h2 className="text-2xl font-bold">Processing...</h2></div>}
        {result && (
          <div className="grid lg:grid-cols-2 gap-8">
            <div className="bg-white rounded-2xl shadow-xl p-6"><h3 className="text-2xl font-bold text-gray-900 mb-4 flex items-center space-x-2"><Globe className="h-6 w-6 text-pink-500" /><span>Real-World Examples</span></h3><div className="text-gray-700 max-h-[500px] overflow-y-auto">{result.examples}</div></div>
            <div className="bg-white rounded-2xl shadow-xl p-6"><h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center space-x-2"><MessageCircle className="h-5 w-5 text-primary" /><span>Ask for More</span></h3><div className="h-[400px] flex flex-col"><div className="flex-1 overflow-y-auto space-y-3 mb-4 p-2">{chatMessages.map((msg, idx) => <div key={idx} className={`p-3 rounded-lg ${msg.role === 'user' ? 'bg-primary text-white ml-8' : 'bg-gray-100 mr-8'}`}>{msg.content}</div>)}</div><div className="flex space-x-2"><input type="text" value={chatInput} onChange={(e) => setChatInput(e.target.value)} onKeyPress={(e) => e.key === 'Enter' && handleChat()} placeholder="Ask..." className="flex-1 px-4 py-2 border rounded-lg" /><button onClick={handleChat} className="p-2 bg-primary text-white rounded-lg"><Send className="h-5 w-5" /></button></div></div></div>
          </div>
        )}
      </div>
    </div>
  )
}

// Code Explainer Page
function CodeExplainerPage() {
  const [code, setCode] = useState('')
  const [loading, setLoading] = useState(false)
  const [explanation, setExplanation] = useState(null)
  const navigate = useNavigate()
  const location = useLocation()

  useEffect(() => { if (location.state?.code) { setCode(location.state.code); handleExplain(location.state.code) } }, [location.state])

  const handleExplain = async (codeToExplain = code) => {
    if (!codeToExplain.trim()) return
    setLoading(true)
    try {
      const formData = new FormData()
      formData.append('code', codeToExplain)
      const response = await axios.post(`${API_URL}/api/explain-code`, formData)
      setExplanation(response.data.explanation)
    } catch (error) { setExplanation('Failed to explain code.') }
    setLoading(false)
  }

  return (
    <div className="min-h-screen pt-24 pb-12 px-4" style={{ backgroundColor: '#88e788' }}>
      <div className="max-w-4xl mx-auto">
        <button onClick={() => navigate('/')} className="mb-6 flex items-center space-x-2 text-gray-900 font-semibold hover:underline"><ChevronRight className="h-5 w-5 rotate-180" /><span>Back to Home</span></button>
        <div className="bg-white rounded-2xl shadow-xl p-6">
          <h3 className="text-2xl font-bold text-gray-900 mb-4 flex items-center space-x-2"><Code className="h-6 w-6 text-green-600" /><span>Codium - Code Explainer</span></h3>
          <textarea value={code} onChange={(e) => setCode(e.target.value)} placeholder="Paste your code here..." className="w-full h-48 p-4 border-2 border-gray-200 rounded-xl font-mono text-sm focus:outline-none focus:border-primary mb-4" />
          <button onClick={() => handleExplain()} disabled={loading || !code.trim()} className="w-full py-3 bg-primary text-white rounded-lg font-semibold hover:bg-secondary disabled:opacity-50">{loading ? 'Explaining...' : 'Explain Code'}</button>
          {explanation && <div className="mt-6 p-4 bg-gray-50 rounded-xl"><h4 className="font-bold text-gray-900 mb-2">Explanation:</h4><p className="text-gray-700 whitespace-pre-wrap">{explanation}</p></div>}
        </div>
      </div>
    </div>
  )
}

// Main App
function App() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/summarize" element={<SummarizePage />} />
        <Route path="/quiz" element={<QuizPage />} />
        <Route path="/generate-questions" element={<GenerateQuestionsPage />} />
        <Route path="/kannada-learning" element={<KannadaLearningPage />} />
        <Route path="/real-world-examples" element={<RealWorldExamplesPage />} />
        <Route path="/code-explainer" element={<CodeExplainerPage />} />
      </Routes>
      <Footer />
      <Chatbot />
    </div>
  )
}

export default App
