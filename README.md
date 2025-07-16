# 🚀 HappyAxzora - AI Tools Discovery & Workflow Platform

[![Next.js](https://img.shields.io/badge/Next.js-14.2.3-black)](https://nextjs.org/)
[![Firebase](https://img.shields.io/badge/Firebase-10.14.1-orange)](https://firebase.google.com/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-3.4.1-blue)](https://tailwindcss.com/)
[![Groq API](https://img.shields.io/badge/Groq%20API-Integrated-green)](https://groq.com/)
[![Product Hunt](https://img.shields.io/badge/Product%20Hunt-API-red)](https://api.producthunt.com/)

A modern, vibrant AI discovery platform featuring trending AI tools, workflow generation, and powerful AI agents - all with stunning 3D UI and glassmorphism design.

## ✨ Features

### 🔍 AI Tools Discovery
- **Real-time trending AI tools** from Product Hunt API
- **Smart categorization** (Today's Latest, This Week, Previous Tools)
- **Advanced search & filtering**
- **Vibrant 3D cards** with hover effects
- **Direct links** to explore tools

### ⚙️ Workflow Builder
- **AI-powered workflow generation** using Groq API
- **n8n and Make.com support**
- **JSON export functionality**
- **Interactive 3D interface**
- **Real-time preview**

### 🤖 AI Agents (15 Agents)
- **Resume Builder** - Create professional resumes
- **Product Description Generator** - Compelling product descriptions
- **Email Summarizer** - Summarize long emails
- **Instagram Caption Writer** - Engaging social media captions
- **Business Name Generator** - Creative business names
- **Customer Support Bot** - Handle customer inquiries
- **Travel Planner** - Plan travel itineraries
- **Legal Document Simplifier** - Simplify legal documents
- **And 7 more specialized agents...**

### 🎨 Modern 3D UI
- **Glassmorphism design** with backdrop blur effects
- **3D card animations** and hover effects
- **Vibrant gradient backgrounds**
- **Smooth loading animations**
- **Responsive design** for all devices
- **Dark theme** with neon accents

## 🛠️ Technology Stack

### Frontend
- **Next.js 14.2.3** - React framework
- **Tailwind CSS** - Utility-first CSS framework
- **Shadcn/ui** - Modern UI components
- **Lucide React** - Icon library

### Backend
- **Next.js API Routes** - Serverless functions
- **Firebase Firestore** - NoSQL database
- **Firebase Authentication** - User management

### AI & APIs
- **Groq API** - Fast LLM inference
- **Product Hunt GraphQL API** - Trending tools data
- **Firebase SDK** - Backend services

### UI/UX
- **3D CSS transforms** - Card animations
- **Glassmorphism effects** - Modern glass design
- **Gradient animations** - Dynamic backgrounds
- **Custom scrollbars** - Styled scroll areas

## 📦 Installation

### Prerequisites
- Node.js 18+ and npm/yarn
- Firebase project with Firestore
- Groq API key
- Product Hunt API credentials

### 1. Clone the Repository
```bash
git clone https://github.com/yourusername/happyaxzora.git
cd happyaxzora
```

### 2. Install Dependencies
```bash
yarn install
# or
npm install
```

### 3. Environment Setup
Create `.env` file in the root directory:

```env
# Firebase Configuration
NEXT_PUBLIC_FIREBASE_API_KEY=your_firebase_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=your_measurement_id

# API Keys
GROQ_API_KEY=your_groq_api_key
PRODUCTHUNT_API_KEY=your_producthunt_api_key
PRODUCTHUNT_API_SECRET=your_producthunt_api_secret
PRODUCTHUNT_DEVELOPER_TOKEN=your_producthunt_developer_token

# Application
NEXT_PUBLIC_BASE_URL=http://localhost:3000
```

### 4. Database Setup (Firebase Firestore)

The application uses **Firebase Firestore** as the database. Here's how to set it up:

1. **Create Firebase Project**
   - Go to [Firebase Console](https://console.firebase.google.com/)
   - Create a new project
   - Enable Firestore Database

2. **Configure Firestore Rules**
   ```javascript
   rules_version = '2';
   service cloud.firestore {
     match /databases/{database}/documents {
       match /{document=**} {
         allow read, write: if request.auth != null;
       }
     }
   }
   ```

3. **Collections Structure**
   ```
   📦 Firestore Database
   ├── 📁 agent_runs
   │   ├── 📄 document_id
   │   │   ├── userId: string
   │   │   ├── agentId: string
   │   │   ├── input: string
   │   │   ├── output: string
   │   │   └── timestamp: timestamp
   │   
   ├── 📁 workflows
   │   ├── 📄 document_id
   │   │   ├── userId: string
   │   │   ├── prompt: string
   │   │   ├── type: string (n8n|make)
   │   │   ├── workflow: object
   │   │   └── timestamp: timestamp
   │   
   └── 📁 users
       ├── 📄 user_id
       │   ├── phoneNumber: string
       │   ├── displayName: string
       │   └── createdAt: timestamp
   ```

### 5. API Keys Setup

#### Groq API
1. Visit [Groq Console](https://console.groq.com/)
2. Create account and get API key
3. Add to `.env` as `GROQ_API_KEY`

#### Product Hunt API
1. Visit [Product Hunt API](https://api.producthunt.com/v2/docs)
2. Create developer account
3. Get API credentials:
   - API Key
   - API Secret
   - Developer Token
4. Add to `.env` file

### 6. Run Development Server
```bash
yarn dev
# or
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) to see the application.

## 🚀 Deployment

### Deploy to Vercel (Recommended)

1. **Install Vercel CLI**
   ```bash
   npm install -g vercel
   ```

2. **Deploy to Vercel**
   ```bash
   vercel
   ```

3. **Add Environment Variables**
   - Go to your Vercel dashboard
   - Navigate to your project settings
   - Add all environment variables from `.env`

4. **Configure Build Settings**
   ```json
   {
     "buildCommand": "yarn build",
     "outputDirectory": ".next",
     "installCommand": "yarn install"
   }
   ```

### Deploy to Netlify

1. **Build the Project**
   ```bash
   yarn build
   yarn export
   ```

2. **Deploy to Netlify**
   ```bash
   # Install Netlify CLI
   npm install -g netlify-cli
   
   # Deploy
   netlify deploy --prod --dir=out
   ```

3. **Configure Netlify**
   - Build command: `yarn build && yarn export`
   - Publish directory: `out`
   - Add environment variables in Netlify dashboard

### Deploy to Other Platforms

#### Railway
```bash
# Install Railway CLI
npm install -g @railway/cli

# Deploy
railway login
railway deploy
```

#### Heroku
```bash
# Install Heroku CLI
npm install -g heroku

# Deploy
heroku create your-app-name
git push heroku main
```

## 🔧 Configuration

### Firebase Admin SDK (Optional)
For server-side operations, you can configure Firebase Admin SDK:

```javascript
// lib/firebase-admin.js
import { initializeApp, getApps, cert } from 'firebase-admin/app'
import { getFirestore } from 'firebase-admin/firestore'

const firebaseAdminConfig = {
  credential: cert({
    projectId: process.env.FIREBASE_PROJECT_ID,
    privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
  }),
}

const app = getApps().length > 0 ? getApps()[0] : initializeApp(firebaseAdminConfig)
const db = getFirestore(app)

export { db }
```

Add to `.env`:
```env
FIREBASE_PROJECT_ID=your_project_id
FIREBASE_PRIVATE_KEY=your_private_key
FIREBASE_CLIENT_EMAIL=your_client_email
```

## 📊 Performance Optimizations

### 1. Image Optimization
- Use Next.js Image component for optimized loading
- Implement lazy loading for cards
- Compress images before serving

### 2. Code Splitting
- Dynamic imports for heavy components
- Route-based code splitting
- Tree shaking for unused code

### 3. Caching Strategy
- API response caching
- Static generation for tool pages
- Browser caching for assets

### 4. Bundle Optimization
```javascript
// next.config.js
module.exports = {
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },
  experimental: {
    optimizeCss: true,
  },
}
```

## 🧪 Testing

### Unit Tests
```bash
yarn test
# or
npm test
```

### E2E Tests
```bash
yarn test:e2e
# or
npm run test:e2e
```

## 📝 API Documentation

### Endpoints

#### GET /api/ai-tools
Fetch trending AI tools from Product Hunt
```javascript
Response: {
  tools: [
    {
      id: string,
      name: string,
      description: string,
      url: string,
      votes: number,
      topics: string[]
    }
  ]
}
```

#### POST /api/ai-agents
Execute AI agent with user input
```javascript
Request: {
  agentId: string,
  input: string,
  userId: string
}

Response: {
  output: string
}
```

#### POST /api/workflows
Generate workflow JSON
```javascript
Request: {
  prompt: string,
  type: 'n8n' | 'make',
  userId: string
}

Response: {
  workflow: object
}
```

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/) for the amazing React framework
- [Firebase](https://firebase.google.com/) for backend services
- [Groq](https://groq.com/) for lightning-fast AI inference
- [Product Hunt](https://producthunt.com/) for AI tools data
- [Tailwind CSS](https://tailwindcss.com/) for utility-first CSS
- [Shadcn/ui](https://ui.shadcn.com/) for beautiful components

## 🆘 Support

For support, email support@happyaxzora.ai or join our Discord community.

---

Made with ❤️ by the HappyAxzora Team