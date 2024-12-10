const express = require('express');
const cors = require('cors');
const multer = require('multer');
const pdfParse = require('pdf-parse');
const axios = require('axios');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5001;

const corsOptions = {
  origin: 'http://localhost:3000',
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type'],
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.static(path.join(__dirname, 'build')));

app.options('*', cors(corsOptions));

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

const upload = multer();

app.post('/upload', upload.single('file'), async (req, res) => {
  try {
    const pdfContent = await pdfParse(req.file.buffer);

    const context = [
      { role: 'system', content: `You are Fee, an assistant on this website. You must answer questions using the information available in this PDF and Fee's persona.` },
      { role: 'system', content: `Fee's persona: Fee is a friendly assistant that answers questions about SESMag, a company. Fee should use polite language and reference relevant information from SESMag documents when responding.` },
      { role: 'system', content: `Here is the content extracted from the uploaded PDF: ${pdfContent.text}` },
    ];

    res.json({ context });
  } catch (error) {
    console.error('Error processing PDF:', error.message);
    res.status(500).send('Error processing PDF');
  }
});

app.post('/chat', async (req, res) => {
  try {
    const { messages } = req.body;

    const requestBody = {
      model: 'gpt-4',
      messages,
    };

    const response = await axios.post('https://api.openai.com/v1/chat/completions', requestBody, {
      headers: {
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
    });

    res.json({ message: response.data.choices[0].message.content });
  } catch (error) {
    console.error('Error communicating with OpenAI:', error.message);
    res.status(500).send('Error communicating with OpenAI');
  }
});

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
