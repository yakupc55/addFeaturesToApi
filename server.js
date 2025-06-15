// server.js
const express = require('express');
const axios = require('axios');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static('public')); // public klasörünü statik dosyalar için kullan
const jsonFileDir = "jsonFiles/";
const LM_STUDIO_URL = 'http://localhost:1234/v1/chat/completions';
let CURRENT_MESSAGES_FILE = path.join(jsonFileDir, 'smartWindows-smartCalculate3.json'); // Varsayılan dosya

function getPrependMessages() {
  try {
    const rawData = fs.readFileSync(CURRENT_MESSAGES_FILE);
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

// Mesajları güncellemek için endpoint
app.post('/api/update-messages', express.json(), (req, res) => {
  try {
    const newMessages = req.body.messages;
    if (!Array.isArray(newMessages)) {
      return res.status(400).json({ error: 'Messages should be an array' });
    }

    const data = { prepend_messages: newMessages };
    fs.writeFileSync(CURRENT_MESSAGES_FILE, JSON.stringify(data, null, 2));
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

// JSON dosyasını değiştirmek için yeni endpoint
app.post('/api/set-messages-file', express.json(), (req, res) => {
  try {
    const newFileName = req.body.filename;
    if (!newFileName) {
      return res.status(400).json({ error: 'Filename is required' });
    }

    const newFilePath = path.join(jsonFileDir , newFileName);
    if (!fs.existsSync(newFilePath)) {
      return res.status(404).json({ error: 'File not found' });
    }

    CURRENT_MESSAGES_FILE = newFilePath;
    res.json({ success: true, message: `Messages file set to ${newFileName}` });
  } catch (error) {
    console.error('Error changing messages file:', error);
    res.status(500).json({ error: 'Failed to change messages file' });
  }
});
// JSON dosyalarını listeleme endpointi
app.get('/api/list-json-files', (req, res) => {
  try {
    const files = fs.readdirSync(jsonFileDir )
      .filter(file => file.endsWith('.json'))
      .map(file => ({
        filename: file,
        path: path.join(__dirname, file)
      }));
    
    res.json({ files });
  } catch (error) {
    console.error('Error listing JSON files:', error);
    res.status(500).json({ error: 'Failed to list JSON files' });
  }
});
// Mevcut JSON dosyasını getirmek için endpoint
app.get('/api/get-current-file', (req, res) => {
  try {
    res.json({ filename: path.basename(CURRENT_MESSAGES_FILE) });
  } catch (error) {
    console.error('Error getting current file:', error);
    res.status(500).json({ error: 'Failed to get current file' });
  }
});
app.use(express.static('public')); 
const PORT = 3001;
app.listen(PORT, () => {
  console.log(`API server running on http://localhost:${PORT}`);
});