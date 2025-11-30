// n8n Webhook Debug Script
// Run this to test your webhook directly and see the exact error

const testWebhook = async () => {
    const webhookUrl = 'https://sanju14151.app.n8n.cloud/webhook/70551e0c-8eff-434d-8c1a-e4107e5e8a43/chat';
    
    const testPayloads = [
        // Test 1: Basic message
        {
            name: "Basic Message",
            payload: {
                chatInput: "Hello test message",
                sessionId: "test-123",
                action: "sendMessage"
            }
        },
        // Test 2: Email request
        {
            name: "Email Request", 
            payload: {
                chatInput: "Send a thank you email to john@example.com",
                sessionId: "test-456",
                action: "sendMessage"
            }
        },
        // Test 3: Alternative field names
        {
            name: "Alternative Fields",
            payload: {
                message: "Help me write an email",
                session_id: "test-789",
                action: "sendMessage"
            }
        }
    ];

    for (const test of testPayloads) {
        console.log(`\n🧪 Testing: ${test.name}`);
        console.log(`📤 Payload:`, JSON.stringify(test.payload, null, 2));
        
        try {
            const response = await fetch(webhookUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(test.payload)
            });

            console.log(`📊 Status: ${response.status}`);
            console.log(`📋 Headers:`, [...response.headers.entries()]);

            const responseText = await response.text();
            console.log(`📄 Raw Response: "${responseText}"`);

            if (response.ok) {
                try {
                    const data = JSON.parse(responseText);
                    console.log(`✅ Success:`, data);
                } catch (e) {
                    console.log(`⚠️ Non-JSON response but status OK`);
                }
            } else {
                try {
                    const errorData = JSON.parse(responseText);
                    console.log(`❌ Error Details:`, JSON.stringify(errorData, null, 2));
                } catch (e) {
                    console.log(`❌ Raw Error: "${responseText}"`);
                }
            }
        } catch (error) {
            console.log(`🚫 Network Error:`, error.message);
        }
        
        console.log('─'.repeat(50));
    }
};

// Run the tests
testWebhook().catch(console.error);