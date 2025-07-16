# GraphQL Module Configuration Explained

## 🏗️ **Architecture Overview:**

```
Frontend Client
     │
     ├── HTTP Requests (Queries/Mutations)
     │   └── Uses: { req, res } context
     │
     └── WebSocket (Subscriptions)
         └── Uses: { connection } context
```

## 📋 **Step-by-Step Breakdown:**

### **1. Basic Setup:**
```typescript
GraphQLModule.forRoot<ApolloDriverConfig>({
  driver: ApolloDriver,              // 🚀 Apollo Server as GraphQL engine
  autoSchemaFile: 'schema.gql',     // 📄 Auto-generates schema.gql file
  playground: false,                 // 🚫 Disable old playground
})
```

**What happens:**
- NestJS scans your `@Resolver()` classes
- Automatically builds GraphQL schema from your decorators
- Creates a `schema.gql` file you can inspect

### **2. Context Function - The Bridge:**
```typescript
context: ({ req, res, connection }) => {
  if (req) {
    // 📡 HTTP Request (Query/Mutation)
    return { req, res } as GqlContext;
  }
  if (connection) {
    // 🔌 WebSocket Connection (Subscription)
    return { connection };
  }
},
```

**Why this matters:**
- **HTTP**: Your mutations/queries get `req.headers.authorization` for auth
- **WebSocket**: Your subscriptions get `connection.context` for auth
- **Context** = Data available in all your resolvers via `@Context()` decorator

### **3. Subscription Lifecycle:**

#### **onConnect - When WebSocket Starts:**
```typescript
onConnect: (context) => {
  // 🔍 Check if client sent auth token
  const authToken = context.connectionParams?.authorization;
  
  if (authToken) {
    // ✅ Authenticated connection
    return { authToken, isAuthenticated: true };
  } else {
    // ❌ Anonymous connection
    return { isAuthenticated: false };
  }
}
```

#### **onDisconnect - When WebSocket Ends:**
```typescript
onDisconnect: () => {
  console.log('WebSocket disconnected');
  // 🧹 Cleanup code would go here
}
```

## 🔄 **Real-World Flow:**

### **HTTP Request (Mutation/Query):**
```
1. Client sends: POST /graphql with Authorization header
2. Context function receives: { req, res }
3. AuthGuard reads: req.headers.authorization
4. Resolver executes with authenticated user
```

### **WebSocket Subscription:**
```
1. Client connects: ws://localhost:3000/graphql with connectionParams
2. onConnect receives: { connectionParams: { authorization: "Bearer ..." } }
3. Context function receives: { connection }
4. Subscription streams data to authenticated client
```

## 🎯 **Why Each Part Exists:**

| Configuration | Purpose | Example |
|---------------|---------|---------|
| `autoSchemaFile` | Generate schema.gql | See all your GraphQL types/queries |
| `context` | Pass data to resolvers | User authentication, request info |
| `onConnect` | Handle WebSocket auth | Validate JWT token on connection |
| `'graphql-ws'` | WebSocket protocol | Modern replacement for old subscriptions-transport-ws |

## 🔧 **Common Patterns:**

### **Authentication Flow:**
```typescript
// HTTP (Queries/Mutations)
@UseGuards(AuthGuard)  // Reads req.headers.authorization
@Query(() => String)
myQuery(@CurrentUser() user: User) { ... }

// WebSocket (Subscriptions) 
@Subscription(() => String)
mySubscription() {
  // No guard needed - auth handled in onConnect
  return this.pubSub.asyncIterator('topic');
}
```

### **Error Handling:**
```typescript
onConnect: (context) => {
  try {
    const token = context.connectionParams?.authorization;
    const user = validateToken(token); // Your validation logic
    return { user, isAuthenticated: true };
  } catch (error) {
    throw new Error('Authentication failed');
  }
}
```

## 🎨 **Visual Flow:**

```
Client App
    │
    ├─ Login ──────────────────┐
    │                          │
    ├─ HTTP Query ─────────────┼─── AuthGuard ──── Resolver
    │   (with JWT header)      │     (checks req)
    │                          │
    └─ WebSocket Subscribe ────┼─── onConnect ──── Subscription
        (with JWT in params)   │     (checks connection)
                               │
                          Your Server
```

## 🚀 **Key Takeaways:**

1. **Two Different Protocols**: HTTP for queries/mutations, WebSocket for subscriptions
2. **Two Different Contexts**: `{req, res}` vs `{connection}`
3. **Two Different Auth Methods**: Headers vs Connection Params
4. **Same End Goal**: Secure, real-time GraphQL API

This setup allows your app to handle both traditional GraphQL operations AND real-time subscriptions with proper authentication! 🎉
