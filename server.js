// server.js
const express = require('express');
const axios = require('axios');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
app.use(cors());
app.use(express.json());

const LM_STUDIO_URL = 'http://localhost:1234/v1/chat/completions';
const MESSAGES_FILE = path.join(__dirname, 'smartWindows-smartCalculate.json');

function getPrependMessages() {

  try {
    const rawData = fs.readFileSync(MESSAGES_FILE);
    const data = JSON.parse(rawData);
    return data.prepend_messages || [];
  } catch (error) {
    console.error('Error reading messages file:', error);
    return [];
  }
}

app.post('/api/chat', async (req, res) => {
  try {
    const userMessages = req.body.messages || [];
    const prependMessages = getPrependMessages();
    
    // JSON'dan okunan mesajları kullanıcı mesajlarının önüne ekle
    const combinedMessages = [...prependMessages, ...userMessages];
    
    const response = await axios.post(LM_STUDIO_URL, {
      model: 'google/gemma-3-4b',
      messages: combinedMessages,
      stream: req.body.stream || false,
    }, {
      responseType: req.body.stream ? 'stream' : 'json',
      headers: {
        'Content-Type': 'application/json'
      }
    });

    if (req.body.stream) {
      response.data.pipe(res);
    } else {
      res.json(response.data);
    }
  } catch (error) {
    console.error('API error:', error);
    res.status(500).json({ error: 'Failed to process chat request' });
  }
});

// Mesajları güncellemek için yeni endpoint
app.post('/api/update-messages', express.json(), (req, res) => {
  try {
    const newMessages = req.body.messages;
    if (!Array.isArray(newMessages)) {
      return res.status(400).json({ error: 'Messages should be an array' });
    }

    const data = { prepend_messages: newMessages };
    fs.writeFileSync(MESSAGES_FILE, JSON.stringify(data, null, 2));
    res.json({ success: true, message: 'Messages updated successfully' });
  } catch (error) {
    console.error('Error updating messages:', error);
    res.status(500).json({ error: 'Failed to update messages' });
  }
});

// Mevcut mesajları getirmek için endpoint
app.get('/api/get-messages', (req, res) => {
  try {
    const messages = getPrependMessages();
    res.json({ messages });
  } catch (error) {
    console.error('Error getting messages:', error);
    res.status(500).json({ error: 'Failed to get messages' });
  }
});

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`API server running on http://localhost:${PORT}`);
});