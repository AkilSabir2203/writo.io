# Writo.io - AI-Powered Text Editor

A modern, web-based text editor enhanced with Google's Gemini AI for intelligent writing assistance.

## Features

### Core Editor Features
- Rich text editing with multiple font options
- Word and line counting
- Find and replace functionality
- File operations (new, open, save, print)
- User authentication and document persistence

### AI-Powered Features (NEW!)
- **Text Generation**: Generate content based on prompts with context awareness
- **Text Improvement**: Enhance writing quality with multiple improvement types:
  - General improvement
  - Grammar and spelling correction
  - Professional tone conversion
  - Casual tone conversion
- **Text Summarization**: Create concise summaries in short, medium, or long formats
- **Translation**: Translate text to any language
- **Text Analysis**: Analyze text for tone, keywords, structure, or general insights

## Setup Instructions

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn
- Google Gemini API key
- MongoDB database

### Installation

1. **Clone the repository** (if applicable) or navigate to your project directory

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Set up environment variables**:
   - Copy the `.env` file and update it with your credentials:
   ```bash
   # Google Gemini API Configuration
   GEMINI_API_KEY=your_actual_gemini_api_key_here
   
   # MongoDB Configuration  
   MONGO_URI=your_mongodb_connection_string
   ```

4. **Get your Gemini API Key**:
   - Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
   - Create a new API key
   - Copy the key and paste it in your `.env` file

5. **Start the backend server**:
   ```bash
   cd backend
   node server.js
   ```
   The server will start on `http://localhost:3000`

6. **Open the frontend**:
   - Open `frontend/editor.html` in your web browser
   - Or serve it using a local server like Live Server extension in VS Code

## Usage

### Basic Text Editing
1. Open the editor in your browser
2. Start typing in the text area
3. Use the menu bar for file operations, editing, and formatting

### AI Features
1. **Access AI Menu**: Click on "AI Assistant" in the menu bar
2. **Select text** (optional): Highlight text you want to work with, or leave empty to work with the entire document
3. **Choose an AI function**:
   - **Generate Text**: Create new content based on a prompt
   - **Improve Text**: Enhance existing text quality
   - **Fix Grammar**: Correct grammar and spelling errors
   - **Make Professional**: Convert to professional tone
   - **Make Casual**: Convert to casual, friendly tone
   - **Summarize**: Create a summary of the text
   - **Translate**: Translate to another language
   - **Explain Text**: Get analysis and insights about the text

4. **Review Results**: The AI response will appear in a modal with options to:
   - Copy the result to clipboard
   - Replace the original text
   - Insert at cursor position

### API Endpoints

The backend provides the following AI endpoints:

- `POST /ai/generate` - Generate text based on prompt
- `POST /ai/improve` - Improve text quality
- `POST /ai/summarize` - Summarize text
- `POST /ai/translate` - Translate text
- `POST /ai/explain` - Analyze and explain text

## Project Structure

```
writo.io/
├── backend/
│   ├── models/
│   │   └── User.js
│   └── server.js
├── frontend/
│   ├── editor.html
│   ├── editor.js
│   ├── index.html
│   └── script.js
├── .env
├── package.json
└── README.md
```

## Technologies Used

- **Backend**: Node.js, Express.js, MongoDB, Mongoose
- **Frontend**: HTML5, CSS3 (Tailwind), JavaScript (ES6+)
- **AI Integration**: Google Gemini AI API
- **Authentication**: bcrypt for password hashing
- **Styling**: Tailwind CSS, Font Awesome icons

## Configuration

### Environment Variables
- `GEMINI_API_KEY`: Your Google Gemini API key
- `MONGO_URI`: MongoDB connection string

### API Configuration
The frontend is configured to connect to the backend at `http://localhost:3000`. If you deploy to a different URL, update the `API_BASE_URL` in `frontend/editor.js`.

## Troubleshooting

### Common Issues

1. **AI features not working**:
   - Ensure your Gemini API key is valid and set in `.env`
   - Check that the backend server is running
   - Verify the API_BASE_URL in the frontend matches your backend URL

2. **Database connection issues**:
   - Verify your MongoDB URI is correct
   - Ensure your MongoDB instance is running
   - Check network connectivity to MongoDB

3. **CORS errors**:
   - The backend includes CORS middleware
   - If serving frontend from a different domain, update CORS settings

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the ISC License.

## Support

For issues and questions:
1. Check the troubleshooting section
2. Review the Google Gemini API documentation
3. Open an issue in the project repository