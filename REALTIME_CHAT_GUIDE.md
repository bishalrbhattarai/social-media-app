# Real-Time Chat Implementation Guide

## 🚀 How Your Real-Time Chat Works Now:

### **1. Architecture Overview:**
```
User A ───── Subscribe to messages ───── Server
User B ───── Subscribe to messages ───── Server
                    │
User A ───── Send Message ───── Server ───── Publish to Redis PubSub
                    │
User A ←─── Receive Message ←─── Server
User B ←─── Receive Message ←─── Server
```

### **2. What Happens When a Message is Sent:**

1. **User A** calls `createMessage` mutation
2. **Server** saves message to database
3. **Server** publishes message via Redis PubSub to `messageAdded.{conversationId}`
4. **All subscribed users** in that conversation receive the message instantly

### **3. Frontend Usage Examples:**

#### **Subscribe to New Messages:**
```graphql
subscription MessageAdded($conversationId: String!) {
  messageAdded(conversationId: $conversationId) {
    id
    conversationId
    senderId
    senderName
    senderAvatar
    content
    read
    createdAt
    updatedAt
  }
}
```

#### **Send a Message:**
```graphql
mutation CreateMessage($conversationId: String!, $content: String!) {
  createMessage(conversationId: $conversationId, content: $content) {
    id
    conversationId
    senderId
    senderName
    senderAvatar
    content
    read
    createdAt
    updatedAt
  }
}
```

#### **Get Message History:**
```graphql
query GetMessages($conversationId: String!, $first: Int, $after: String) {
  getMessages(conversationId: $conversationId, first: $first, after: $after) {
    edges {
      node {
        id
        conversationId
        senderId
        senderName
        senderAvatar
        content
        read
        createdAt
        updatedAt
      }
      cursor
    }
    pageInfo {
      endCursor
      hasNextPage
    }
  }
}
```

### **4. React/Next.js Example:**

```typescript
import { useSubscription, useMutation } from '@apollo/client';
import { useState } from 'react';

const SUBSCRIBE_TO_MESSAGES = gql`
  subscription MessageAdded($conversationId: String!) {
    messageAdded(conversationId: $conversationId) {
      id
      senderId
      senderName
      content
      createdAt
    }
  }
`;

const SEND_MESSAGE = gql`
  mutation CreateMessage($conversationId: String!, $content: String!) {
    createMessage(conversationId: $conversationId, content: $content) {
      id
      content
    }
  }
`;

function ChatComponent({ conversationId }: { conversationId: string }) {
  const [messages, setMessages] = useState([]);
  const [messageInput, setMessageInput] = useState('');
  
  // Subscribe to new messages
  useSubscription(SUBSCRIBE_TO_MESSAGES, {
    variables: { conversationId },
    onSubscriptionData: ({ subscriptionData }) => {
      if (subscriptionData.data) {
        setMessages(prev => [...prev, subscriptionData.data.messageAdded]);
      }
    },
  });
  
  // Send message mutation
  const [sendMessage] = useMutation(SEND_MESSAGE);
  
  const handleSendMessage = async () => {
    if (messageInput.trim()) {
      await sendMessage({
        variables: {
          conversationId,
          content: messageInput,
        },
      });
      setMessageInput('');
    }
  };
  
  return (
    <div>
      <div className="messages">
        {messages.map((message) => (
          <div key={message.id}>
            <strong>{message.senderName}:</strong> {message.content}
          </div>
        ))}
      </div>
      
      <div className="input-area">
        <input
          value={messageInput}
          onChange={(e) => setMessageInput(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
          placeholder="Type a message..."
        />
        <button onClick={handleSendMessage}>Send</button>
      </div>
    </div>
  );
}
```

### **5. Key Benefits:**

✅ **Instant Delivery** - Messages appear immediately for all users
✅ **Scalable** - Redis PubSub can handle many concurrent users
✅ **Efficient** - No polling needed, WebSocket keeps connection alive
✅ **Secure** - Only conversation participants receive messages
✅ **Persistent** - Messages saved to database for history

### **6. Testing Your Setup:**

1. **Start your server** with Redis running
2. **Open GraphQL Playground** at your server URL
3. **Subscribe to messages** in one tab
4. **Send a message** in another tab
5. **Watch the real-time delivery** happen instantly!

### **7. Production Considerations:**

- **Authentication**: Add proper auth for WebSocket connections
- **Rate Limiting**: Prevent message spam
- **Message Status**: Add delivered/read receipts
- **Typing Indicators**: Show when users are typing
- **File Sharing**: Support image/file messages
- **Push Notifications**: For offline users
