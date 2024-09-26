import { useState } from 'react';
import axios from 'axios';

function App() {
  const [query, setQuery] = useState('');
  const [response, setResponse] = useState('');
  const [isSpeaking, setIsSpeaking] = useState(false); // State to track if speech is in progress

  const handleSearch = async () => {
    try {
      const res = await axios.post('http://localhost:5000/api/search', {
        query,
      });
      setResponse(res.data.answer);
    } catch (err) {
      console.error(err);
    }
  };

  const handleSpeak = () => {
    if ('speechSynthesis' in window) {
      // Cancel any existing speech to avoid repetition
      if (window.speechSynthesis.speaking) {
        window.speechSynthesis.cancel();
      }

      // Create a new utterance
      const utterance = new SpeechSynthesisUtterance(response);

      // Mark as speaking
      setIsSpeaking(true);

      // Listen for when the speech ends
      utterance.onend = () => {
        setIsSpeaking(false);  // Reset state when speaking ends
        console.log('Speech has finished.');
      };

      // Speak the text
      window.speechSynthesis.speak(utterance);
    } else {
      alert('Speech synthesis not supported in this browser.');
    }
  };

  return (
    <div style={{ padding: '50px' }}>
      <h1>GPT Search with Text-to-Speech</h1>
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Ask me anything"
        style={{ width: '300px', marginRight: '10px' }}
      />
      <button onClick={handleSearch}>Search</button>
      <div>
        <p>{response}</p>
        {/* Disable the speak button if speech is in progress */}
        {response && (
          <button onClick={handleSpeak} disabled={isSpeaking}>
            {isSpeaking ? '🔊 Speaking...' : '🔊 Speak'}
          </button>
        )}
      </div>
    </div>
  );
}

export default App;
