import React, { useState } from 'react';
import axios from 'axios';
import FileUploader from './FileUploader';

const Chat = () => {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([]);
  const [context, setContext] = useState([]);

  // Handle sending chat messages
  const handleSend = async () => {
    if (input.trim() === '') return;

    const userMessage = { role: 'user', content: input };
    setMessages((prevMessages) => [...prevMessages, userMessage]);
    setInput('');

    try {
      const chatResponse = await axios.post('http://localhost:5001/chat', {
        messages: [...context, userMessage],
      });

      const assistantMessage = chatResponse.data.message;
      setMessages((prevMessages) => [...prevMessages, assistantMessage]);
    } catch (error) {
      alert('Error communicating with the server');
      console.error(error);
    }
  };

  return (
    <div>
      <FileUploader setContext={setContext} />

      <div>
        {messages.map((msg, index) => (
          <div key={index}>
            <strong>{msg.role === 'user' ? 'You' : 'Fee'}: </strong>
            {msg.content}
          </div>
        ))}
      </div>

      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Type your message..."
      />
      <button onClick={handleSend}>Send</button>
    </div>
  );
};

export default Chat;
