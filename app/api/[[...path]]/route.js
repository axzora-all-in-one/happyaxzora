import { NextResponse } from 'next/server'
import { db } from '@/lib/firebase'
import { collection, addDoc, getDocs, query, where, orderBy, limit } from 'firebase/firestore'
import Groq from 'groq-sdk'

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
})

// Debug: Log environment variables (remove in production)
console.log('Environment check:', {
  hasGroqKey: !!process.env.GROQ_API_KEY,
  hasProductHuntToken: !!process.env.PRODUCTHUNT_DEVELOPER_TOKEN,
  groqKeyPrefix: process.env.GROQ_API_KEY?.substring(0, 10)
})

// Helper function to fetch from Product Hunt
async function fetchFromProductHunt() {
  const response = await fetch(`https://api.producthunt.com/v2/api/graphql`, {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${process.env.PRODUCTHUNT_DEVELOPER_TOKEN}`,
    },
    body: JSON.stringify({
      query: `
        query {
          posts(first: 50, order: VOTES, postedAfter: "${new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]}") {
            edges {
              node {
                id
                name
                tagline
                description
                url
                votesCount
                createdAt
                featuredAt
                topics {
                  edges {
                    node {
                      name
                    }
                  }
                }
              }
            }
          }
        }
      `
    })
  })

  if (!response.ok) {
    throw new Error(`Product Hunt API error: ${response.status}`)
  }

  return response.json()
}

export async function GET(request) {
  const { pathname } = new URL(request.url)
  
  try {
    // AI Tools endpoint
    if (pathname.includes('/api/ai-tools')) {
      const data = await fetchFromProductHunt()
      
      if (data.errors) {
        throw new Error(data.errors[0].message)
      }
      
      const tools = data.data.posts.edges
        .filter(edge => {
          const topics = edge.node.topics.edges.map(t => t.node.name.toLowerCase())
          return topics.some(topic => 
            topic.includes('ai') || 
            topic.includes('artificial intelligence') || 
            topic.includes('machine learning') ||
            topic.includes('automation') ||
            topic.includes('chatbot') ||
            topic.includes('neural') ||
            topic.includes('deep learning')
          )
        })
        .map(edge => ({
          id: edge.node.id,
          name: edge.node.name,
          description: edge.node.tagline || edge.node.description,
          url: edge.node.url,
          votes: edge.node.votesCount,
          topics: edge.node.topics.edges.map(t => t.node.name),
          createdAt: edge.node.createdAt,
          featuredAt: edge.node.featuredAt,
          date: edge.node.featuredAt || edge.node.createdAt
        }))
        .sort((a, b) => {
          // Sort by date first (newest first), then by votes
          const dateA = new Date(a.date || a.createdAt)
          const dateB = new Date(b.date || b.createdAt)
          
          if (dateA.getTime() !== dateB.getTime()) {
            return dateB.getTime() - dateA.getTime()
          }
          
          return (b.votes || 0) - (a.votes || 0)
        })
      
      return NextResponse.json({ tools })
    }
    
    return NextResponse.json({ error: 'Not found' }, { status: 404 })
    
  } catch (error) {
    console.error('API Error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function POST(request) {
  const { pathname } = new URL(request.url)
  
  try {
    const body = await request.json()
    
    // AI Agents endpoint
    if (pathname.includes('/api/ai-agents')) {
      const { agentId, input, userId } = body
      
      // Define agent prompts
      const agentPrompts = {
        resume: `Create a professional resume based on the following information: ${input}. Format it properly with sections for Contact Information, Professional Summary, Experience, Education, and Skills.`,
        product: `Create a compelling product description for: ${input}. Include key features, benefits, and a call-to-action.`,
        email: `Summarize the following email content: ${input}. Provide key points and action items.`,
        pdf: `Explain the following PDF content: ${input}. Break it down into key concepts and main points.`,
        instagram: `Create engaging Instagram captions for: ${input}. Include relevant hashtags and emojis.`,
        social: `Create a social media content calendar for: ${input}. Suggest post ideas, timing, and platforms.`,
        business: `Generate creative business names for: ${input}. Provide 10 options with brief explanations.`,
        support: `Provide customer support response for: ${input}. Be helpful, professional, and solution-oriented.`,
        medical: `Explain the following medical symptoms: ${input}. Provide general information only, not medical advice.`,
        travel: `Create a travel itinerary for: ${input}. Include attractions, accommodations, and logistics.`,
        chatbot: `Create a custom chatbot script for: ${input}. Define conversation flows and responses.`,
        legal: `Simplify the following legal document: ${input}. Explain in plain language.`,
        linkedin: `Create a professional LinkedIn bio for: ${input}. Highlight achievements and skills.`,
        whatsapp: `Format the following message for WhatsApp: ${input}. Make it clear and engaging.`,
        planner: `Create a daily planner for: ${input}. Include tasks, priorities, and time blocks.`
      }
      
      const prompt = agentPrompts[agentId] || `Process the following request: ${input}`
      
      const completion = await groq.chat.completions.create({
        messages: [
          {
            role: "system",
            content: "You are a helpful AI assistant. Provide clear, actionable, and professional responses."
          },
          {
            role: "user",
            content: prompt
          }
        ],
        model: "llama3-70b-8192",
        temperature: 0.7,
        max_tokens: 1000,
      })
      
      const output = completion.choices[0]?.message?.content || "No response generated"
      
      // Save to Firestore - temporarily commented out for testing
      try {
        await addDoc(collection(db, 'agent_runs'), {
          userId,
          agentId,
          input,
          output,
          timestamp: new Date()
        })
        console.log('Successfully saved to Firestore')
      } catch (firebaseError) {
        console.log('Firebase save failed (expected in testing):', firebaseError.message)
        // Continue execution - don't fail the API call due to Firebase issues
      }
      
      return NextResponse.json({ output })
    }
    
    // Workflows endpoint
    if (pathname.includes('/api/workflows')) {
      const { prompt, type, userId } = body
      
      const systemPrompt = type === 'n8n' 
        ? `You are an expert n8n workflow generator. Create a complete n8n workflow JSON configuration based on the user's request. Include all necessary nodes, connections, and configurations. Return only valid JSON.`
        : `You are an expert Make.com workflow generator. Create a complete Make.com scenario JSON configuration based on the user's request. Include all necessary modules, connections, and configurations. Return only valid JSON.`
      
      const completion = await groq.chat.completions.create({
        messages: [
          {
            role: "system",
            content: systemPrompt
          },
          {
            role: "user",
            content: `Create a ${type} workflow for: ${prompt}`
          }
        ],
        model: "llama3-70b-8192",
        temperature: 0.3,
        max_tokens: 2000,
      })
      
      let workflow
      try {
        const response = completion.choices[0]?.message?.content || "{}"
        // Clean the response to extract JSON
        const jsonMatch = response.match(/\{[\s\S]*\}/)
        workflow = jsonMatch ? JSON.parse(jsonMatch[0]) : { error: "Invalid JSON generated" }
      } catch (error) {
        workflow = {
          error: "Failed to parse workflow JSON",
          raw_response: completion.choices[0]?.message?.content
        }
      }
      
      // Save to Firestore - temporarily commented out for testing
      try {
        await addDoc(collection(db, 'workflows'), {
          userId,
          prompt,
          type,
          workflow,
          timestamp: new Date()
        })
        console.log('Successfully saved workflow to Firestore')
      } catch (firebaseError) {
        console.log('Firebase save failed (expected in testing):', firebaseError.message)
        // Continue execution - don't fail the API call due to Firebase issues
      }
      
      return NextResponse.json({ workflow })
    }
    
    return NextResponse.json({ error: 'Not found' }, { status: 404 })
    
  } catch (error) {
    console.error('API Error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

// Handle other HTTP methods
export async function PUT(request) {
  return NextResponse.json({ error: 'Method not allowed' }, { status: 405 })
}

export async function DELETE(request) {
  return NextResponse.json({ error: 'Method not allowed' }, { status: 405 })
}