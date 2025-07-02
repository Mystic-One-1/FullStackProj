import React, { useState } from 'react';
import './MovieChatbot.css';

const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent';

const GEMINI_API_KEY = process.env.REACT_APP_GEMINI_API_KEY;

const MovieChatbot = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const handleAsk = async () => {
    if (!input.trim()) return;

    const newMessages = [...messages, { from: 'user', text: input }];
    setMessages(newMessages);
    setInput('');
    setLoading(true);

    try {
      const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
text: `You are a movie expert AI. Always respond with:
- A friendly tone
- A short summary if the movie is real
- 3 to 5 similar movies with brief reasons
Only answer movie-related queries. User input: "${input}"`
                },
              ],
            },
          ],
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${await response.text()}`);
      }

      const data = await response.json();
      const output = data?.candidates?.[0]?.content?.parts?.[0]?.text?.trim() || '🎬 Sorry, I couldn’t think of a movie.';

      setMessages([...newMessages, { from: 'bot', text: output }]);
    } catch (err) {
      console.error('Gemini API Error:', err);
      setMessages([...newMessages, { from: 'bot', text: '❌ Error fetching response.' }]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') handleAsk();
  };

  return (
    <div className="chatbot-container">
      <h2>🎬 Your Friendly Movie Recommendation AI</h2>
      <div className="chat-window">
        {messages.map((msg, idx) => (
          <div key={idx} className={`chat-bubble ${msg.from}`}>{msg.text}</div>
        ))}
        {loading && <div className="chat-bubble bot">💭 Thinking...</div>}
      </div>
      <div className="chat-input-area">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Ask for movie suggestions..."
        />
        <button onClick={handleAsk} disabled={loading}>Send</button>
      </div>
    </div>
  );
};

export default MovieChatbot;
