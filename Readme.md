# Hindu News Scraper & Reframer

A full-stack application that scrapes the latest news articles from The Hindu website and reframes them into a more casual, conversational style using Google's Gemini AI API.

## 🚀 Features

- **Real-time News Scraping**: Automatically fetches the latest news from The Hindu's live news section
- **AI-Powered Reframing**: Uses Google Gemini API to convert formal news articles into casual, user-friendly content
- **Modern UI**: Clean, responsive React frontend with Tailwind CSS
- **RESTful API**: Flask-based backend with CORS support
- **Error Handling**: Comprehensive error handling and user feedback

## 🏗️ Architecture

```
├── backend/          # Flask API server
│   ├── main.py      # Core scraping and API logic
│   ├── .env         # Environment variables (API keys)
│   └── .gitignore   # Python-specific ignores
├── frontend/         # React TypeScript application
│   ├── src/
│   │   ├── components/
│   │   │   └── HinduNewsScraper.tsx  # Main component
│   │   ├── App.tsx                   # App component
│   │   └── main.tsx                  # Entry point
│   ├── index.html                    # HTML template
│   ├── package.json                  # Dependencies and scripts
│   └── vite.config.ts               # Vite configuration
└── README.md        # Project documentation
```

## 🛠️ Tech Stack

### Backend
- **Python 3.11+**
- **Flask** - Web framework
- **BeautifulSoup4** - Web scraping
- **Requests** - HTTP client
- **Flask-CORS** - Cross-origin resource sharing
- **python-dotenv** - Environment variable management
- **Markdown** - Content formatting

### Frontend
- **React 19** - UI framework
- **TypeScript** - Type safety
- **Vite** - Build tool
- **Tailwind CSS** - Styling
- **ESLint** - Code linting

## 📋 Prerequisites

- Python 3.11 or higher
- Node.js 18 or higher
- npm or yarn
- Google Gemini API key

## ⚙️ Installation

### Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Create a virtual environment:
```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

3. Install dependencies:
```bash
pip install flask flask-cors requests beautifulsoup4 python-dotenv markdown
```

4. Create a `.env` file and add your Gemini API key:
```env
GEMINI_API_KEY=your_gemini_api_key_here
```

### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

## 🚀 Running the Application

### Start the Backend Server

```bash
cd backend
python main.py
```

The backend will run on `http://localhost:5000`

### Start the Frontend Development Server

```bash
cd frontend
npm run dev
```

The frontend will run on `http://localhost:5173`

### Network Configuration

If you want to access the application from other devices on your network:

1. The backend is already configured to accept connections from any IP (`host='0.0.0.0'`)
2. The frontend Vite server is configured with `host: '0.0.0.0'` in [`vite.config.ts`](frontend/vite.config.ts)
3. Update the API endpoint in [`HinduNewsScraper.tsx`](frontend/src/components/HinduNewsScraper.tsx) with your machine's IP address

## 📡 API Endpoints

### Backend API

- **GET `/`** - API information and available endpoints
- **GET `/api/health`** - Health check endpoint
- **GET `/api/scrape-news`** - Scrape and reframe the latest news article

### Response Format

```json
{
  "success": true,
  "news": {
    "headline": "Reframed headline in casual style",
    "content": "HTML formatted content",
    "timestamp": "2024-01-01T12:00:00.000000"
  }
}
```

## 🔧 Configuration

### Backend Configuration

- **Port**: 5000 (configurable in [`main.py`](backend/main.py))
- **CORS**: Enabled for all origins
- **Environment Variables**: Managed via `.env` file

### Frontend Configuration

- **Development Port**: 5173 (configurable in [`vite.config.ts`](frontend/vite.config.ts))
- **API Endpoint**: Update in [`HinduNewsScraper.tsx`](frontend/src/components/HinduNewsScraper.tsx)
- **Tailwind CSS**: Custom theme with primary colors defined in [`tailwind.config.js`](frontend/tailwind.config.js)

## 🎨 UI Features

- **Responsive Design**: Works on desktop and mobile devices
- **Loading States**: Visual feedback during API calls
- **Error Handling**: User-friendly error messages
- **Clean Typography**: Optimized for reading news content
- **Accessibility**: Semantic HTML and proper ARIA labels

## 🔍 How It Works

1. **News Scraping**: The [`HinduNewsScraper`](backend/main.py) class scrapes The Hindu's live news page to find the latest article
2. **Content Extraction**: Extracts headline, content, author, and publication date using BeautifulSoup
3. **AI Reframing**: Sends the content to Google Gemini API with a prompt to rewrite in casual style
4. **Response Formatting**: Converts markdown to HTML and returns structured JSON
5. **Frontend Display**: React component fetches and displays the reframed content

## 🚨 Error Handling

The application includes comprehensive error handling for:
- Network connectivity issues
- API rate limits
- Invalid HTML structure changes
- Missing environment variables
- Malformed API responses

## 🔒 Security Considerations

- API keys are stored in environment variables
- CORS is configured for development (restrict in production)
- Input validation for API responses
- Error messages don't expose sensitive information

## 📝 Development Scripts

### Frontend Scripts

```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run lint     # Run ESLint
npm run preview  # Preview production build
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is for educational and demonstration purposes.

## 🙏 Acknowledgments

- The Hindu for providing accessible news content
- Google Gemini API for AI-powered content reframing
- React and Vite communities for excellent development tools