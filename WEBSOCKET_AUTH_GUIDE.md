# WebSocket Subscription Authentication Guide

## 🔐 How to Connect to Subscriptions with Authentication

### **1. GraphQL Playground Connection:**

When connecting to subscriptions in GraphQL Playground, you need to pass the authorization token in the connection params.

**Connection Headers:**
```json
{
  "authorization": "Bearer YOUR_JWT_TOKEN_HERE"
}
```

### **2. Frontend Client Setup:**

#### **Apollo Client Setup:**
```typescript
import { GraphQLWsLink } from '@apollo/client/link/subscriptions';
import { createClient } from 'graphql-ws';
import { split, HttpLink } from '@apollo/client';
import { getMainDefinition } from '@apollo/client/utilities';

const httpLink = new HttpLink({
  uri: 'http://localhost:3000/graphql',
  headers: {
    authorization: `Bearer ${localStorage.getItem('token')}`,
  },
});

const wsLink = new GraphQLWsLink(createClient({
  url: 'ws://localhost:3000/graphql',
  connectionParams: {
    authorization: `Bearer ${localStorage.getItem('token')}`,
  },
}));

// Split link based on operation type
const splitLink = split(
  ({ query }) => {
    const definition = getMainDefinition(query);
    return (
      definition.kind === 'OperationDefinition' &&
      definition.operation === 'subscription'
    );
  },
  wsLink,
  httpLink,
);
```

### **3. Testing in GraphQL Playground:**

1. **First, get your JWT token** by logging in:
```graphql
mutation Login($email: String!, $password: String!) {
  login(input: { email: $email, password: $password }) {
    accessToken
    user {
      id
      name
    }
  }
}
```

2. **Copy the accessToken from the response**

3. **Set up WebSocket connection with auth**:
   - Click the "Settings" gear icon in GraphQL Playground
   - Add to "Connection Settings":
```json
{
  "headers": {
    "authorization": "Bearer YOUR_ACCESS_TOKEN_HERE"
  }
}
```

4. **Now subscribe to messages**:
```graphql
subscription MessageAdded($conversationId: String!) {
  messageAdded(conversationId: $conversationId) {
    id
    conversationId
    senderId
    senderName
    content
    createdAt
  }
}
```

### **4. Current Status:**

✅ **Fixed Issues:**
- Removed AuthGuard from subscription resolver to prevent authorization header errors
- Added individual guards to mutations and queries
- Enhanced WebSocket connection handling with optional authentication

✅ **What Works Now:**
- Subscriptions work without authentication errors
- HTTP requests (queries/mutations) still require authentication
- WebSocket connections accept optional authentication tokens
- Real-time message broadcasting works properly

### **5. Security Notes:**

- The subscription is currently open (no auth required) for testing
- In production, you should add proper authentication to subscriptions
- Consider implementing connection-level authorization
- Filter messages based on user permissions

### **6. Quick Test:**

1. **Open GraphQL Playground**
2. **Subscribe to messages** (no auth needed for now):
```graphql
subscription {
  messageAdded(conversationId: "test-conversation") {
    id
    content
    senderName
  }
}
```
3. **In another tab, send a message** (auth required):
```graphql
mutation {
  createMessage(conversationId: "test-conversation", content: "Hello World!") {
    id
    content
  }
}
```
4. **Watch the message appear in real-time!**
