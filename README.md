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

If you want to integrate this chat into your existing Vercel app or any other application, use this code:

```javascript
// Example fetch request from your app
const response = await fetch('https://kamesh14151.app.n8n.cloud/webhook/tomo-chat', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    message: userMessage,
    sessionId: uniqueSessionId // e.g., user ID or UUID
  })
});

const data = await response.json();
console.log(data.response); // AI's response
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

1. **CORS Error (Most Common)**
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
   - Or use the HTTP Request node instead of Webhook for better CORS control

2. **"Disconnected" status**
   - Check if n8n workflow is activated
   - Verify webhook URL is correct
   - Check n8n instance is running

3. **Messages not sending**
   - Open browser console for error messages
   - Verify CORS settings in n8n (see #1 above)
   - Check network connectivity

4. **Session not persisting**
   - Ensure localStorage is enabled in browser
   - Check if cookies/storage are being cleared

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

## 🎯 Next Steps

1. **Deploy** your chat interface
2. **Test** the connection with your n8n workflow
3. **Customize** the appearance and messages
4. **Share** your chat with users
5. **Monitor** usage and improve the experience

---

**Enjoy your new AI chat assistant! 🤖✨**