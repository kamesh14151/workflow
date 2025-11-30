# ⚙️ Tomo Chat - n8n Workflow Setup Guide

This repository contains a beautiful chat interface that connects to an n8n workflow for AI-powered conversations with session management.

## 🚀 Quick Setup

### 1. Configure n8n Workflow with CORS Support

#### Method A: Using Webhook + Respond to Webhook (Recommended)

1. **Create a new workflow** in n8n with these nodes:
   ```
   Webhook Trigger → [Your AI Logic] → Respond to Webhook
   ```

2. **Configure Webhook Trigger**:
   - Set HTTP Method: `POST`
   - Set Path: `tomo-chat`
   - Enable "Respond to Webhook" option

3. **Configure Respond to Webhook Node**:
   - Response Body: `{{ {"response": $json.aiResponse} }}`
   - Response Headers:
     ```json
     {
       "Access-Control-Allow-Origin": "*",
       "Access-Control-Allow-Methods": "POST, OPTIONS",
       "Access-Control-Allow-Headers": "Content-Type",
       "Content-Type": "application/json"
     }
     ```

4. **Activate the workflow** and copy your webhook URL:
   ```
   https://kamesh14151.app.n8n.cloud/webhook/tomo-chat
   ```

#### Method B: Import Ready-Made Workflow Template

1. **Import the workflow template**:
   - Copy the content from `n8n-workflow-template.json`
   - In n8n, go to "Import from File" 
   - Paste the JSON and import

2. **Customize the AI Logic**:
   - Replace the demo code in "AI Logic" node with your AI service calls
   - Configure API keys and endpoints as needed

3. **Activate and test** the workflow

#### Method C: Alternative CORS-friendly Setup

If the above methods don't work:
1. Use an **HTTP Request** node instead of webhook response
2. Set up a simple server endpoint that handles CORS
3. Configure your n8n workflow to call that endpoint

### 2. Configure Your Chat Interface

The chat interface is already pre-configured with the webhook URL in `index.html`. If you need to change it:

```javascript
// In the script section of index.html, update this line:
const WEBHOOK_URL = 'https://kamesh14151.app.n8n.cloud/webhook/tomo-chat';
```

### 3. Deploy Your Chat Interface

You can deploy the `index.html` file to any hosting service:

#### Option A: Vercel (Recommended)
1. Push this repository to GitHub
2. Connect your GitHub account to Vercel
3. Deploy the repository
4. Your chat will be available at your Vercel domain

#### Option B: Netlify
1. Drag and drop the `index.html` file to Netlify
2. Your chat will be available instantly

#### Option C: GitHub Pages
1. Go to your repository settings
2. Enable GitHub Pages
3. Select the main branch
4. Your chat will be available at `https://yourusername.github.io/workflow`

## 🔧 Integration with Custom Apps

### Vercel App Integration

If you want to integrate Tomo into your existing Vercel app, here's the complete implementation:

```javascript
// In your chat component or API route
const sendMessage = async (userMessage) => {
  const response = await fetch('https://kamesh14151.app.n8n.cloud/webhook/tomo-chat', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      message: userMessage,
      sessionId: generateSessionId() // Use user ID or generate UUID
    })
  });
  
  const data = await response.json();
  return data.response; // This is Tomo's reply
};

// Generate or retrieve session ID
function generateSessionId() {
  // Option 1: Use existing user ID
  // return userId;
  
  // Option 2: Generate and store in localStorage
  let sessionId = localStorage.getItem('tomoSessionId');
  if (!sessionId) {
    sessionId = crypto.randomUUID();
    localStorage.setItem('tomoSessionId', sessionId);
  }
  return sessionId;
}
```

### React Component Example

```jsx
import { useState, useEffect } from 'react';

export default function ChatComponent() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const sendMessage = async (userMessage) => {
    setLoading(true);
    try {
      const response = await fetch('https://kamesh14151.app.n8n.cloud/webhook/tomo-chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: userMessage,
          sessionId: generateSessionId()
        })
      });
      
      const data = await response.json();
      return data.response;
    } catch (error) {
      console.error('Chat error:', error);
      return "Sorry, I'm having trouble connecting right now.";
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage = input.trim();
    setInput('');
    
    // Add user message
    setMessages(prev => [...prev, { text: userMessage, sender: 'user' }]);
    
    // Get AI response
    const aiResponse = await sendMessage(userMessage);
    setMessages(prev => [...prev, { text: aiResponse, sender: 'ai' }]);
  };

  return (
    <div className="chat-container">
      <div className="messages">
        {messages.map((msg, index) => (
          <div key={index} className={`message ${msg.sender}`}>
            {msg.text}
          </div>
        ))}
        {loading && <div className="typing">Tomo is typing...</div>}
      </div>
      
      <form onSubmit={handleSubmit}>
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type your message..."
          disabled={loading}
        />
        <button type="submit" disabled={loading || !input.trim()}>
          Send
        </button>
      </form>
    </div>
  );
}
```

### API Route Example (Next.js)

```javascript
// pages/api/chat.js or app/api/chat/route.js
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { message, sessionId } = req.body;

  try {
    const response = await fetch('https://kamesh14151.app.n8n.cloud/webhook/tomo-chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message, sessionId })
    });

    const data = await response.json();
    res.status(200).json({ response: data.response });
  } catch (error) {
    res.status(500).json({ error: 'Failed to get AI response' });
  }
}
```

## 💾 Session Management

The chat interface automatically handles session management:

### Automatic Session ID Generation
- Each user gets a unique `sessionId` stored in localStorage
- Format: `session_` + random string
- Persists across browser sessions

### Custom Session Management
If you want to implement your own session logic:

```javascript
// Generate a unique sessionId per user/conversation
const sessionId = 'user_' + userId; // or UUID.v4()

// Send the same sessionId for all messages in a conversation
const payload = {
  message: userMessage,
  sessionId: sessionId
};
```

### Session Benefits
- **Conversation Memory**: The AI remembers previous messages in the same session
- **Context Preservation**: Maintains conversation context across multiple messages
- **User Personalization**: Each user has their own conversation thread

## 🎨 Features

### Built-in Features
- ✅ **Real-time messaging** with typing indicators
- ✅ **Session persistence** with localStorage
- ✅ **Dark/Light mode** toggle
- ✅ **Connection status** monitoring
- ✅ **Mobile responsive** design
- ✅ **Quick reply buttons** for common messages
- ✅ **Auto-scroll** to latest messages
- ✅ **Animated interactions** and smooth transitions

### Customization Options
- Change colors by modifying CSS variables in `:root`
- Update the bot name and avatar
- Add more quick reply buttons
- Modify the welcome message
- Customize the webhook URL

## 🔗 API Endpoint Details

### Request Format
```json
{
  "message": "User's message text",
  "sessionId": "unique_session_identifier"
}
```

### Response Format
```json
{
  "response": "AI's response text"
}
```

### Error Handling
The interface automatically handles:
- Connection timeouts
- Network errors  
- Server errors
- Invalid responses

## 🛠️ Troubleshooting

### Common Issues

1. **HTTP 500 Internal Server Error**
   ```
   Failed to load resource: the server responded with a status of 500
   Error: HTTP error! Status: 500
   ```
   **This means your n8n workflow has an internal error:**
   - ✅ CORS is working (request reaches n8n)
   - ❌ Something is wrong inside your workflow
   
   **Debug Steps**:
   1. **Check n8n Execution Logs**:
      - Go to your n8n dashboard
      - Check "Executions" tab for failed runs
      - Look for error messages in red
   
   2. **Common n8n Workflow Issues**:
      - Missing or incorrect AI API keys
      - Wrong node configuration
      - Invalid JSON in response body
      - Missing required fields in webhook data
   
   3. **Test Your Workflow**:
      - In n8n, click "Test Workflow" 
      - Send a manual test with this data:
        ```json
        {
          "message": "Hello",
          "sessionId": "test-session"
        }
        ```

   4. **"Unused Respond to Webhook node" Error**:
      ```json
      {"code": 0, "message": "Unused Respond to Webhook node found in the workflow"}
      ```
      **Fix**: Connect all nodes in your workflow properly:
      - Ensure Webhook → AI Logic → Respond to Webhook are connected
      - The "Respond to Webhook" node must be the FINAL node
      - No orphaned/disconnected nodes should exist

2. **CORS Error (If still occurring)**
   ```
   Access to fetch at 'webhook-url' has been blocked by CORS policy
   ```
   **Solution**: Configure CORS in your n8n webhook:
   - In your n8n workflow, add a **"Respond to Webhook"** node
   - Set these headers:
     ```json
     {
       "Access-Control-Allow-Origin": "*",
       "Access-Control-Allow-Methods": "POST, OPTIONS",
       "Access-Control-Allow-Headers": "Content-Type"
     }
     ```

3. **"Disconnected" status**
   - Check if n8n workflow is activated
   - Verify webhook URL is correct
   - Check n8n instance is running

4. **Messages not sending**
   - Open browser console for error messages
   - Check n8n execution logs for workflow errors
   - Verify all API keys are configured correctly

5. **Session not persisting**
   - Ensure localStorage is enabled in browser
   - Check if cookies/storage are being cleared

### 🔍 Quick n8n Debugging Checklist

**Step 1: Check Workflow Status**
- ✅ Is your workflow **ACTIVE** in n8n?
- ✅ Does the webhook path match: `/webhook/tomo-chat`?

**Step 2: Test Webhook Manually**
```bash
curl -X POST https://kamesh14151.app.n8n.cloud/webhook/tomo-chat \
  -H "Content-Type: application/json" \
  -d '{"message": "test", "sessionId": "test-123"}'
```

**Step 3: Check Response Format**
Your n8n workflow MUST return exactly this format:
```json
{
  "response": "Your AI response text here"
}
```

**Step 4: Common n8n Fixes**
- **Missing AI API Key**: Add your OpenAI/Claude/etc. API key
- **Wrong Response Body**: Use `{{ {"response": $json.aiResponse} }}`
- **Node Errors**: Check each node for red error indicators
- **Timeout Issues**: Increase workflow timeout settings

### Testing the Connection
The chat interface automatically tests the connection on page load. Check the connection status indicator in the top-right corner.

## 📱 Mobile Support

The chat interface is fully responsive and works great on:
- 📱 Mobile phones (iOS/Android)
- 📋 Tablets (iPad/Android tablets)  
- 💻 Desktop browsers (Chrome, Firefox, Safari, Edge)

## 🔒 Security Notes

- Session IDs are generated client-side for simplicity
- For production use, consider server-side session management
- Implement rate limiting in your n8n workflow
- Consider adding authentication for sensitive use cases

## 🚀 Deployment & Testing

### Deploy to Vercel

1. **Push your code** to GitHub repository
2. **Connect to Vercel**:
   - Go to [vercel.com](https://vercel.com)
   - Import your GitHub repository
   - Deploy automatically

3. **Redeploy** after updating the code:
   ```bash
   git add .
   git commit -m "Update chat integration"
   git push origin main
   ```

### Test Your Integration

1. **Visit your deployed app**: `https://your-app.vercel.app`
2. **Send a test message** in the chat
3. **Verify Tomo responds** with styled, emoji-rich responses
4. **Check conversation memory** by referencing previous messages

### Live Demo

🌐 **Working Example**: https://workflow-one-gamma.vercel.app/
- Send a message to see Tomo in action
- Test conversation memory with follow-up questions
- Try the dark/light mode toggle

## ✅ Important Testing Notes

- ✅ **Session ID**: Enables conversation memory - use the same ID for entire conversations
- ✅ **Active Workflow**: Make sure your n8n workflow is **ACTIVE** before testing  
- ✅ **Execution Logs**: Check n8n execution logs if messages aren't working
- ✅ **CORS Headers**: Ensure proper CORS configuration (see troubleshooting section)
- ✅ **Response Format**: n8n should return `{"response": "AI message text"}`

## 🚀 Next Steps

1. **Deploy** your chat interface to Vercel
2. **Configure** your n8n workflow with proper CORS headers
3. **Test** the integration thoroughly
4. **Customize** the appearance and AI responses
5. **Share** your chat with users
6. **Monitor** n8n execution logs and optimize performance

---

**Enjoy your new AI chat assistant! 🤖✨**

*Need help? Check the troubleshooting section or create an issue in the repository.*