'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { toast } from 'sonner'
import { 
  Search, 
  TrendingUp, 
  Zap, 
  Bot, 
  User, 
  Settings,
  Download,
  ExternalLink,
  Star,
  Heart,
  ArrowRight,
  Sparkles,
  Code,
  MessageSquare,
  FileText,
  Mail,
  Calendar,
  Briefcase,
  Shield,
  Plane,
  Stethoscope,
  PenTool,
  Smartphone,
  ClipboardList,
  Rocket,
  Layers,
  Zap as ZapIcon,
  Cpu,
  Database,
  Globe,
  Lightbulb,
  Target,
  Wand2,
  Flame,
  Crown,
  Trophy,
  Plus,
  Share,
  Copy,
  Eye,
  Users,
  ThumbsUp,
  MessageCircle,
  BookOpen,
  Wrench,
  PlayCircle,
  Link,
  Palette,
  BrainCircuit
} from 'lucide-react'

const aiAgents = [
  { id: 'resume', name: 'Resume Builder', icon: FileText, description: 'Create professional resumes', color: 'from-blue-500 to-blue-600' },
  { id: 'product', name: 'Product Description', icon: PenTool, description: 'Generate compelling product descriptions', color: 'from-purple-500 to-purple-600' },
  { id: 'email', name: 'Email Summarizer', icon: Mail, description: 'Summarize long emails', color: 'from-green-500 to-green-600' },
  { id: 'pdf', name: 'PDF Explainer', icon: FileText, description: 'Explain PDF documents', color: 'from-red-500 to-red-600' },
  { id: 'instagram', name: 'Instagram Caption', icon: MessageSquare, description: 'Create engaging Instagram captions', color: 'from-pink-500 to-pink-600' },
  { id: 'social', name: 'Social Media Calendar', icon: Calendar, description: 'Plan social media content', color: 'from-indigo-500 to-indigo-600' },
  { id: 'business', name: 'Business Name Generator', icon: Briefcase, description: 'Generate business names', color: 'from-yellow-500 to-yellow-600' },
  { id: 'support', name: 'Customer Support Bot', icon: Bot, description: 'Handle customer inquiries', color: 'from-teal-500 to-teal-600' },
  { id: 'medical', name: 'Medical Symptoms', icon: Stethoscope, description: 'Explain medical symptoms', color: 'from-cyan-500 to-cyan-600' },
  { id: 'travel', name: 'Travel Planner', icon: Plane, description: 'Plan travel itineraries', color: 'from-orange-500 to-orange-600' },
  { id: 'chatbot', name: 'Custom Chatbot', icon: MessageSquare, description: 'Build custom chatbots', color: 'from-violet-500 to-violet-600' },
  { id: 'legal', name: 'Legal Document', icon: Shield, description: 'Simplify legal documents', color: 'from-gray-500 to-gray-600' },
  { id: 'linkedin', name: 'LinkedIn Bio', icon: User, description: 'Create LinkedIn bios', color: 'from-blue-400 to-blue-500' },
  { id: 'whatsapp', name: 'WhatsApp Formatter', icon: Smartphone, description: 'Format WhatsApp messages', color: 'from-green-400 to-green-500' },
  { id: 'planner', name: 'Daily Planner', icon: ClipboardList, description: 'Organize daily tasks', color: 'from-purple-400 to-purple-500' }
]

export default function App() {
  const [user, setUser] = useState({ uid: 'demo_user', phoneNumber: '+1234567890' })
  const [loading, setLoading] = useState(false)
  const [aiTools, setAiTools] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedAgent, setSelectedAgent] = useState(null)
  const [agentInput, setAgentInput] = useState('')
  const [agentOutput, setAgentOutput] = useState('')
  const [workflowPrompt, setWorkflowPrompt] = useState('')
  const [workflowType, setWorkflowType] = useState('n8n')
  const [generatedWorkflow, setGeneratedWorkflow] = useState(null)
  const [agentLoading, setAgentLoading] = useState(false)
  const [workflowLoading, setWorkflowLoading] = useState(false)
  const [toolsLoading, setToolsLoading] = useState(false)

  // Chatbot Builder States
  const [chatbotName, setChatbotName] = useState('')
  const [chatbotDescription, setChatbotDescription] = useState('')
  const [knowledgeBase, setKnowledgeBase] = useState('')
  const [chatbotColor, setChatbotColor] = useState('#6366f1')
  const [createdChatbots, setCreatedChatbots] = useState([])
  const [chatbotLoading, setChatbotLoading] = useState(false)
  const [selectedChatbot, setSelectedChatbot] = useState(null)
  const [chatbotTestMessage, setChatbotTestMessage] = useState('')
  const [chatbotTestResponse, setChatbotTestResponse] = useState('')

  useEffect(() => {
    fetchAiTools()
    fetchChatbots()
  }, [])

  const fetchAiTools = async () => {
    setToolsLoading(true)
    try {
      const response = await fetch('/api/ai-tools')
      const data = await response.json()
      
      const sortedTools = (data.tools || []).sort((a, b) => {
        if (a.date && b.date) {
          return new Date(b.date) - new Date(a.date)
        }
        return (b.votes || 0) - (a.votes || 0)
      })
      
      setAiTools(sortedTools)
    } catch (error) {
      toast.error('Failed to fetch AI tools')
    } finally {
      setToolsLoading(false)
    }
  }

  const fetchChatbots = async () => {
    try {
      const response = await fetch('/api/chatbots')
      const data = await response.json()
      setCreatedChatbots(data.chatbots || [])
    } catch (error) {
      console.error('Failed to fetch chatbots:', error)
    }
  }

  const handleAgentRun = async () => {
    if (!agentInput.trim()) return
    
    setAgentLoading(true)
    try {
      const response = await fetch('/api/ai-agents', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          agentId: selectedAgent.id,
          input: agentInput,
          userId: user.uid
        })
      })
      
      const data = await response.json()
      setAgentOutput(data.output)
      toast.success('Agent executed successfully!')
    } catch (error) {
      toast.error('Failed to run agent')
    } finally {
      setAgentLoading(false)
    }
  }

  const handleWorkflowGenerate = async () => {
    if (!workflowPrompt.trim()) return
    
    setWorkflowLoading(true)
    try {
      const response = await fetch('/api/workflows', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: workflowPrompt,
          type: workflowType,
          userId: user.uid
        })
      })
      
      const data = await response.json()
      setGeneratedWorkflow(data.workflow)
      toast.success('Workflow generated successfully!')
    } catch (error) {
      toast.error('Failed to generate workflow')
    } finally {
      setWorkflowLoading(false)
    }
  }

  const handleCreateChatbot = async () => {
    if (!chatbotName.trim() || !knowledgeBase.trim()) {
      toast.error('Please fill in all required fields')
      return
    }
    
    setChatbotLoading(true)
    try {
      const response = await fetch('/api/chatbots', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: chatbotName,
          description: chatbotDescription,
          knowledgeBase: knowledgeBase,
          color: chatbotColor,
          userId: user.uid
        })
      })
      
      const data = await response.json()
      if (data.chatbot) {
        setCreatedChatbots([data.chatbot, ...createdChatbots])
        setChatbotName('')
        setChatbotDescription('')
        setKnowledgeBase('')
        setChatbotColor('#6366f1')
        toast.success('Chatbot created successfully!')
      }
    } catch (error) {
      toast.error('Failed to create chatbot')
    } finally {
      setChatbotLoading(false)
    }
  }

  const handleTestChatbot = async () => {
    if (!chatbotTestMessage.trim() || !selectedChatbot) return
    
    try {
      const response = await fetch('/api/chatbots/test', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chatbotId: selectedChatbot.id,
          message: chatbotTestMessage,
          userId: user.uid
        })
      })
      
      const data = await response.json()
      setChatbotTestResponse(data.response)
      toast.success('Chatbot tested successfully!')
    } catch (error) {
      toast.error('Failed to test chatbot')
    }
  }

  const copyEmbedCode = (chatbotId) => {
    const embedCode = `<script>
  (function() {
    var script = document.createElement('script');
    script.src = '${window.location.origin}/embed/${chatbotId}';
    script.async = true;
    document.head.appendChild(script);
  })();
</script>`
    navigator.clipboard.writeText(embedCode)
    toast.success('Embed code copied to clipboard!')
  }

  const downloadWorkflow = () => {
    if (!generatedWorkflow) return
    
    const blob = new Blob([JSON.stringify(generatedWorkflow, null, 2)], { 
      type: 'application/json' 
    })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${workflowType}-workflow.json`
    a.click()
    URL.revokeObjectURL(url)
  }

  const handleSignOut = async () => {
    toast.success('Demo mode - authentication disabled')
  }

  const filteredTools = aiTools.filter(tool => 
    tool.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    tool.description.toLowerCase().includes(searchTerm.toLowerCase())
  )

  // Group tools by recency
  const groupedTools = {
    today: [],
    thisWeek: [],
    older: []
  }

  const now = new Date()
  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate())
  const weekStart = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)

  filteredTools.forEach(tool => {
    const toolDate = tool.date ? new Date(tool.date) : new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000)
    
    if (toolDate >= todayStart) {
      groupedTools.today.push(tool)
    } else if (toolDate >= weekStart) {
      groupedTools.thisWeek.push(tool)
    } else {
      groupedTools.older.push(tool)
    }
  })

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-4 border-orange-500 border-t-transparent mx-auto mb-4"></div>
          <p className="text-gray-600 text-xl font-semibold">Loading HappyAxzora...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      {/* Header - Product Hunt Style */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-3">
                <div className="relative">
                  <div className="w-10 h-10 bg-gradient-to-r from-orange-500 to-pink-500 rounded-xl flex items-center justify-center shadow-lg">
                    <Sparkles className="h-6 w-6 text-white" />
                  </div>
                  <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">HappyAxzora</h1>
                  <p className="text-xs text-gray-500">AI Discovery Platform</p>
                </div>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <Badge className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white border-0 px-3 py-1">
                <Crown className="h-3 w-3 mr-1" />
                Demo Mode
              </Badge>
              <div className="flex items-center space-x-2 bg-gray-100 rounded-full px-3 py-1">
                <Avatar className="h-6 w-6">
                  <AvatarFallback className="text-xs bg-gradient-to-r from-blue-500 to-purple-500 text-white">
                    DU
                  </AvatarFallback>
                </Avatar>
                <span className="text-sm font-medium text-gray-700">Demo User</span>
              </div>
              <Button variant="ghost" size="sm" onClick={handleSignOut} className="text-gray-500 hover:text-gray-700">
                <Settings className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-6xl font-bold text-gray-900 mb-4">
            Discover amazing <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-pink-500">AI tools</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
            The best AI tools, curated daily. Generate workflows, build chatbots, and access powerful AI agents.
          </p>
          <div className="flex items-center justify-center space-x-4">
            <Badge className="bg-orange-100 text-orange-700 px-4 py-2">
              <Fire className="h-4 w-4 mr-2" />
              50+ AI Tools
            </Badge>
            <Badge className="bg-blue-100 text-blue-700 px-4 py-2">
              <Bot className="h-4 w-4 mr-2" />
              15+ AI Agents
            </Badge>
            <Badge className="bg-purple-100 text-purple-700 px-4 py-2">
              <BrainCircuit className="h-4 w-4 mr-2" />
              Custom Chatbots
            </Badge>
          </div>
        </div>

        <Tabs defaultValue="tools" className="w-full">
          <TabsList className="grid w-full grid-cols-4 mb-8 bg-white shadow-sm border border-gray-200 rounded-2xl p-1">
            <TabsTrigger value="tools" className="flex items-center space-x-2 data-[state=active]:bg-orange-500 data-[state=active]:text-white rounded-xl font-medium transition-all">
              <Search className="h-4 w-4" />
              <span>AI Tools</span>
            </TabsTrigger>
            <TabsTrigger value="workflows" className="flex items-center space-x-2 data-[state=active]:bg-blue-500 data-[state=active]:text-white rounded-xl font-medium transition-all">
              <Code className="h-4 w-4" />
              <span>Workflows</span>
            </TabsTrigger>
            <TabsTrigger value="agents" className="flex items-center space-x-2 data-[state=active]:bg-purple-500 data-[state=active]:text-white rounded-xl font-medium transition-all">
              <Bot className="h-4 w-4" />
              <span>AI Agents</span>
            </TabsTrigger>
            <TabsTrigger value="chatbots" className="flex items-center space-x-2 data-[state=active]:bg-green-500 data-[state=active]:text-white rounded-xl font-medium transition-all">
              <BrainCircuit className="h-4 w-4" />
              <span>Chatbot Builder</span>
            </TabsTrigger>
          </TabsList>

          {/* AI Tools Discovery - Product Hunt Style */}
          <TabsContent value="tools" className="space-y-8">
            {/* Search Bar */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
              <div className="relative max-w-2xl mx-auto">
                <Search className="absolute left-4 top-4 h-5 w-5 text-gray-400" />
                <Input
                  placeholder="Search AI tools..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-12 h-12 border-gray-200 focus:border-orange-500 focus:ring-orange-500 rounded-xl"
                />
              </div>
            </div>

            {toolsLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                    <div className="animate-pulse">
                      <div className="h-6 bg-gray-200 rounded mb-4"></div>
                      <div className="h-4 bg-gray-200 rounded mb-2"></div>
                      <div className="h-4 bg-gray-200 rounded w-2/3 mb-4"></div>
                      <div className="h-10 bg-gray-200 rounded"></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="space-y-8">
                {/* Today's Tools */}
                {groupedTools.today.length > 0 && (
                  <div>
                    <div className="flex items-center mb-6">
                      <Flame className="h-6 w-6 text-red-500 mr-2" />
                      <h3 className="text-2xl font-bold text-gray-900">Today's Latest</h3>
                      <Badge className="ml-3 bg-red-100 text-red-700">
                        {groupedTools.today.length}
                      </Badge>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {groupedTools.today.map((tool, index) => (
                        <Card key={index} className="bg-white border border-gray-200 hover:border-orange-300 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 rounded-xl overflow-hidden">
                          <CardHeader className="pb-3">
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <CardTitle className="text-lg text-gray-900 font-bold mb-1 hover:text-orange-600 transition-colors">
                                  {tool.name}
                                </CardTitle>
                                <CardDescription className="text-gray-600 text-sm">
                                  {tool.description}
                                </CardDescription>
                              </div>
                              <div className="flex items-center space-x-2 ml-4">
                                <Badge className="bg-orange-100 text-orange-700 flex items-center space-x-1">
                                  <TrendingUp className="h-3 w-3" />
                                  <span>{tool.votes || 0}</span>
                                </Badge>
                              </div>
                            </div>
                          </CardHeader>
                          <CardContent>
                            <div className="flex items-center justify-between">
                              <Button size="sm" asChild className="bg-orange-500 hover:bg-orange-600 text-white rounded-lg">
                                <a href={tool.url} target="_blank" rel="noopener noreferrer">
                                  <ExternalLink className="h-4 w-4 mr-2" />
                                  Visit
                                </a>
                              </Button>
                              <div className="flex items-center space-x-2">
                                <Button variant="ghost" size="sm" className="text-gray-500 hover:text-red-500">
                                  <Heart className="h-4 w-4" />
                                </Button>
                                <Button variant="ghost" size="sm" className="text-gray-500 hover:text-blue-500">
                                  <Share className="h-4 w-4" />
                                </Button>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>
                )}

                {/* This Week's Tools */}
                {groupedTools.thisWeek.length > 0 && (
                  <div>
                    <div className="flex items-center mb-6">
                      <Calendar className="h-6 w-6 text-blue-500 mr-2" />
                      <h3 className="text-2xl font-bold text-gray-900">This Week</h3>
                      <Badge className="ml-3 bg-blue-100 text-blue-700">
                        {groupedTools.thisWeek.length}
                      </Badge>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {groupedTools.thisWeek.map((tool, index) => (
                        <Card key={index} className="bg-white border border-gray-200 hover:border-blue-300 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 rounded-xl overflow-hidden">
                          <CardHeader className="pb-3">
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <CardTitle className="text-lg text-gray-900 font-bold mb-1 hover:text-blue-600 transition-colors">
                                  {tool.name}
                                </CardTitle>
                                <CardDescription className="text-gray-600 text-sm">
                                  {tool.description}
                                </CardDescription>
                              </div>
                              <div className="flex items-center space-x-2 ml-4">
                                <Badge className="bg-blue-100 text-blue-700 flex items-center space-x-1">
                                  <TrendingUp className="h-3 w-3" />
                                  <span>{tool.votes || 0}</span>
                                </Badge>
                              </div>
                            </div>
                          </CardHeader>
                          <CardContent>
                            <div className="flex items-center justify-between">
                              <Button size="sm" asChild className="bg-blue-500 hover:bg-blue-600 text-white rounded-lg">
                                <a href={tool.url} target="_blank" rel="noopener noreferrer">
                                  <ExternalLink className="h-4 w-4 mr-2" />
                                  Visit
                                </a>
                              </Button>
                              <div className="flex items-center space-x-2">
                                <Button variant="ghost" size="sm" className="text-gray-500 hover:text-red-500">
                                  <Heart className="h-4 w-4" />
                                </Button>
                                <Button variant="ghost" size="sm" className="text-gray-500 hover:text-blue-500">
                                  <Share className="h-4 w-4" />
                                </Button>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>
                )}

                {/* Older Tools */}
                {groupedTools.older.length > 0 && (
                  <div>
                    <div className="flex items-center mb-6">
                      <Database className="h-6 w-6 text-gray-500 mr-2" />
                      <h3 className="text-2xl font-bold text-gray-900">Previous Tools</h3>
                      <Badge className="ml-3 bg-gray-100 text-gray-700">
                        {groupedTools.older.length}
                      </Badge>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {groupedTools.older.map((tool, index) => (
                        <Card key={index} className="bg-white border border-gray-200 hover:border-gray-300 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 rounded-xl overflow-hidden">
                          <CardHeader className="pb-3">
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <CardTitle className="text-lg text-gray-900 font-bold mb-1 hover:text-gray-600 transition-colors">
                                  {tool.name}
                                </CardTitle>
                                <CardDescription className="text-gray-600 text-sm">
                                  {tool.description}
                                </CardDescription>
                              </div>
                              <div className="flex items-center space-x-2 ml-4">
                                <Badge className="bg-gray-100 text-gray-700 flex items-center space-x-1">
                                  <TrendingUp className="h-3 w-3" />
                                  <span>{tool.votes || 0}</span>
                                </Badge>
                              </div>
                            </div>
                          </CardHeader>
                          <CardContent>
                            <div className="flex items-center justify-between">
                              <Button size="sm" asChild className="bg-gray-500 hover:bg-gray-600 text-white rounded-lg">
                                <a href={tool.url} target="_blank" rel="noopener noreferrer">
                                  <ExternalLink className="h-4 w-4 mr-2" />
                                  Visit
                                </a>
                              </Button>
                              <div className="flex items-center space-x-2">
                                <Button variant="ghost" size="sm" className="text-gray-500 hover:text-red-500">
                                  <Heart className="h-4 w-4" />
                                </Button>
                                <Button variant="ghost" size="sm" className="text-gray-500 hover:text-blue-500">
                                  <Share className="h-4 w-4" />
                                </Button>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </TabsContent>

          {/* Workflow Builder */}
          <TabsContent value="workflows" className="space-y-8">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
              <div className="text-center mb-8">
                <h3 className="text-3xl font-bold text-gray-900 mb-4">Workflow Builder</h3>
                <p className="text-gray-600 text-lg">
                  Generate n8n or Make.com workflows from simple prompts
                </p>
              </div>

              <Card className="max-w-4xl mx-auto border-gray-200">
                <CardHeader>
                  <CardTitle className="text-gray-900 flex items-center">
                    <Wand2 className="h-6 w-6 mr-2 text-blue-500" />
                    Create Workflow
                  </CardTitle>
                  <CardDescription className="text-gray-600">
                    Describe what you want your workflow to do
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <Label htmlFor="workflow-type" className="text-gray-700 font-medium">Workflow Type</Label>
                    <Select value={workflowType} onValueChange={setWorkflowType}>
                      <SelectTrigger className="border-gray-200 focus:border-blue-500">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="n8n">n8n</SelectItem>
                        <SelectItem value="make">Make.com</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <Label htmlFor="workflow-prompt" className="text-gray-700 font-medium">Workflow Description</Label>
                    <Textarea
                      id="workflow-prompt"
                      placeholder="E.g., Create a workflow that sends a Slack message when a new email arrives in Gmail..."
                      value={workflowPrompt}
                      onChange={(e) => setWorkflowPrompt(e.target.value)}
                      rows={4}
                      className="border-gray-200 focus:border-blue-500"
                    />
                  </div>

                  <Button 
                    onClick={handleWorkflowGenerate}
                    disabled={!workflowPrompt.trim() || workflowLoading}
                    className="w-full bg-blue-500 hover:bg-blue-600 text-white h-12 rounded-lg font-medium"
                  >
                    {workflowLoading ? (
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    ) : (
                      <ZapIcon className="h-5 w-5 mr-2" />
                    )}
                    Generate Workflow
                  </Button>
                </CardContent>
              </Card>

              {generatedWorkflow && (
                <Card className="max-w-6xl mx-auto mt-8 border-gray-200">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-gray-900 flex items-center">
                        <Layers className="h-6 w-6 mr-2 text-green-500" />
                        Generated Workflow
                      </CardTitle>
                      <Button onClick={downloadWorkflow} className="bg-green-500 hover:bg-green-600 text-white">
                        <Download className="h-4 w-4 mr-2" />
                        Download JSON
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <ScrollArea className="h-96 w-full">
                      <pre className="text-sm bg-gray-50 p-4 rounded-lg overflow-x-auto text-gray-800 border border-gray-200">
                        {JSON.stringify(generatedWorkflow, null, 2)}
                      </pre>
                    </ScrollArea>
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>

          {/* AI Agents */}
          <TabsContent value="agents" className="space-y-8">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
              <div className="text-center mb-8">
                <h3 className="text-3xl font-bold text-gray-900 mb-4">AI Agents</h3>
                <p className="text-gray-600 text-lg">
                  Ready-to-use AI agents for common tasks
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {aiAgents.map((agent) => (
                  <Dialog key={agent.id}>
                    <DialogTrigger asChild>
                      <Card className="bg-white border border-gray-200 hover:border-purple-300 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 rounded-xl overflow-hidden cursor-pointer">
                        <CardHeader className="pb-3">
                          <div className="flex items-center space-x-3">
                            <div className={`p-3 rounded-xl bg-gradient-to-r ${agent.color} shadow-lg`}>
                              <agent.icon className="h-6 w-6 text-white" />
                            </div>
                            <div className="flex-1">
                              <CardTitle className="text-lg text-gray-900 font-bold mb-1">
                                {agent.name}
                              </CardTitle>
                              <CardDescription className="text-gray-600 text-sm">
                                {agent.description}
                              </CardDescription>
                            </div>
                          </div>
                        </CardHeader>
                        <CardContent>
                          <Button className="w-full bg-purple-500 hover:bg-purple-600 text-white rounded-lg">
                            <ArrowRight className="h-4 w-4 mr-2" />
                            Use Agent
                          </Button>
                        </CardContent>
                      </Card>
                    </DialogTrigger>
                    <DialogContent className="max-w-3xl bg-white border-gray-200">
                      <DialogHeader>
                        <DialogTitle className="flex items-center space-x-2 text-gray-900">
                          <div className={`p-2 rounded-lg bg-gradient-to-r ${agent.color}`}>
                            <agent.icon className="h-5 w-5 text-white" />
                          </div>
                          <span>{agent.name}</span>
                        </DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div>
                          <Label htmlFor="agent-input" className="text-gray-700 font-medium">Input</Label>
                          <Textarea
                            id="agent-input"
                            placeholder={`Enter your ${agent.name.toLowerCase()} requirements...`}
                            value={selectedAgent?.id === agent.id ? agentInput : ''}
                            onChange={(e) => {
                              setSelectedAgent(agent)
                              setAgentInput(e.target.value)
                            }}
                            rows={4}
                            className="border-gray-200 focus:border-purple-500"
                          />
                        </div>
                        
                        <Button 
                          onClick={handleAgentRun}
                          disabled={!agentInput.trim() || agentLoading}
                          className={`w-full bg-gradient-to-r ${agent.color} hover:opacity-90 text-white h-12 rounded-lg font-medium`}
                        >
                          {agentLoading ? (
                            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                          ) : (
                            <Bot className="h-5 w-5 mr-2" />
                          )}
                          Run Agent
                        </Button>

                        {selectedAgent?.id === agent.id && agentOutput && (
                          <div>
                            <Label className="text-gray-700 font-medium">Output</Label>
                            <ScrollArea className="h-64 w-full">
                              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                                <pre className="text-sm whitespace-pre-wrap text-gray-800">
                                  {agentOutput}
                                </pre>
                              </div>
                            </ScrollArea>
                          </div>
                        )}
                      </div>
                    </DialogContent>
                  </Dialog>
                ))}
              </div>
            </div>
          </TabsContent>

          {/* Chatbot Builder */}
          <TabsContent value="chatbots" className="space-y-8">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
              <div className="text-center mb-8">
                <h3 className="text-3xl font-bold text-gray-900 mb-4">Chatbot Builder</h3>
                <p className="text-gray-600 text-lg">
                  Create custom chatbots with your own knowledge base
                </p>
              </div>

              {/* Create New Chatbot */}
              <Card className="max-w-4xl mx-auto border-gray-200 mb-8">
                <CardHeader>
                  <CardTitle className="text-gray-900 flex items-center">
                    <BrainCircuit className="h-6 w-6 mr-2 text-green-500" />
                    Create New Chatbot
                  </CardTitle>
                  <CardDescription className="text-gray-600">
                    Build a custom chatbot powered by your knowledge base
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <Label htmlFor="chatbot-name" className="text-gray-700 font-medium">Chatbot Name</Label>
                      <Input
                        id="chatbot-name"
                        placeholder="My Support Bot"
                        value={chatbotName}
                        onChange={(e) => setChatbotName(e.target.value)}
                        className="border-gray-200 focus:border-green-500"
                      />
                    </div>
                    <div>
                      <Label htmlFor="chatbot-color" className="text-gray-700 font-medium">Color Theme</Label>
                      <div className="flex items-center space-x-2">
                        <Input
                          id="chatbot-color"
                          type="color"
                          value={chatbotColor}
                          onChange={(e) => setChatbotColor(e.target.value)}
                          className="w-16 h-10 border-gray-200 rounded-lg cursor-pointer"
                        />
                        <div className="flex-1 text-sm text-gray-600">{chatbotColor}</div>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <Label htmlFor="chatbot-description" className="text-gray-700 font-medium">Description</Label>
                    <Input
                      id="chatbot-description"
                      placeholder="A helpful support bot for my website"
                      value={chatbotDescription}
                      onChange={(e) => setChatbotDescription(e.target.value)}
                      className="border-gray-200 focus:border-green-500"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="knowledge-base" className="text-gray-700 font-medium">Knowledge Base</Label>
                    <Textarea
                      id="knowledge-base"
                      placeholder="Enter your knowledge base here. This will be used to train your chatbot. Include FAQ, product information, company details, etc."
                      value={knowledgeBase}
                      onChange={(e) => setKnowledgeBase(e.target.value)}
                      rows={8}
                      className="border-gray-200 focus:border-green-500"
                    />
                    <p className="text-sm text-gray-500 mt-1">
                      The more detailed your knowledge base, the better your chatbot will respond.
                    </p>
                  </div>

                  <Button 
                    onClick={handleCreateChatbot}
                    disabled={!chatbotName.trim() || !knowledgeBase.trim() || chatbotLoading}
                    className="w-full bg-green-500 hover:bg-green-600 text-white h-12 rounded-lg font-medium"
                  >
                    {chatbotLoading ? (
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    ) : (
                      <Plus className="h-5 w-5 mr-2" />
                    )}
                    Create Chatbot
                  </Button>
                </CardContent>
              </Card>

              {/* Created Chatbots */}
              <div>
                <h4 className="text-2xl font-bold text-gray-900 mb-6">Your Chatbots</h4>
                {createdChatbots.length === 0 ? (
                  <Card className="border-gray-200 text-center py-12">
                    <CardContent>
                      <BrainCircuit className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-600">No chatbots created yet. Create your first chatbot above!</p>
                    </CardContent>
                  </Card>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {createdChatbots.map((chatbot) => (
                      <Card key={chatbot.id} className="bg-white border border-gray-200 hover:shadow-lg transition-all duration-300 rounded-xl overflow-hidden">
                        <CardHeader className="pb-3">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                              <div 
                                className="w-10 h-10 rounded-full flex items-center justify-center"
                                style={{ backgroundColor: chatbot.color }}
                              >
                                <BrainCircuit className="h-5 w-5 text-white" />
                              </div>
                              <div>
                                <CardTitle className="text-lg text-gray-900 font-bold">
                                  {chatbot.name}
                                </CardTitle>
                                <CardDescription className="text-gray-600 text-sm">
                                  {chatbot.description}
                                </CardDescription>
                              </div>
                            </div>
                            <Badge className="bg-green-100 text-green-700">
                              Active
                            </Badge>
                          </div>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-3">
                            <div className="flex items-center space-x-2">
                              <Button
                                size="sm"
                                onClick={() => setSelectedChatbot(chatbot)}
                                className="bg-blue-500 hover:bg-blue-600 text-white"
                              >
                                <PlayCircle className="h-4 w-4 mr-2" />
                                Test
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => copyEmbedCode(chatbot.id)}
                                className="border-gray-300 text-gray-700 hover:bg-gray-50"
                              >
                                <Copy className="h-4 w-4 mr-2" />
                                Embed
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                asChild
                                className="border-gray-300 text-gray-700 hover:bg-gray-50"
                              >
                                <a href={`/chat/${chatbot.id}`} target="_blank" rel="noopener noreferrer">
                                  <ExternalLink className="h-4 w-4 mr-2" />
                                  View
                                </a>
                              </Button>
                            </div>
                            <div className="text-xs text-gray-500">
                              Created: {new Date(chatbot.createdAt).toLocaleDateString()}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </div>

              {/* Test Chatbot Modal */}
              {selectedChatbot && (
                <Dialog open={!!selectedChatbot} onOpenChange={() => setSelectedChatbot(null)}>
                  <DialogContent className="max-w-2xl bg-white border-gray-200">
                    <DialogHeader>
                      <DialogTitle className="flex items-center space-x-2 text-gray-900">
                        <div 
                          className="w-8 h-8 rounded-full flex items-center justify-center"
                          style={{ backgroundColor: selectedChatbot.color }}
                        >
                          <BrainCircuit className="h-4 w-4 text-white" />
                        </div>
                        <span>Test {selectedChatbot.name}</span>
                      </DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="test-message" className="text-gray-700 font-medium">Test Message</Label>
                        <Textarea
                          id="test-message"
                          placeholder="Ask your chatbot a question..."
                          value={chatbotTestMessage}
                          onChange={(e) => setChatbotTestMessage(e.target.value)}
                          rows={3}
                          className="border-gray-200 focus:border-blue-500"
                        />
                      </div>
                      
                      <Button 
                        onClick={handleTestChatbot}
                        disabled={!chatbotTestMessage.trim()}
                        className="w-full bg-blue-500 hover:bg-blue-600 text-white h-10 rounded-lg font-medium"
                      >
                        <MessageCircle className="h-4 w-4 mr-2" />
                        Send Message
                      </Button>

                      {chatbotTestResponse && (
                        <div>
                          <Label className="text-gray-700 font-medium">Response</Label>
                          <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 mt-2">
                            <p className="text-gray-800">{chatbotTestResponse}</p>
                          </div>
                        </div>
                      )}
                    </div>
                  </DialogContent>
                </Dialog>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}