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
  Wand2
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

  useEffect(() => {
    fetchAiTools()
  }, [])

  const fetchAiTools = async () => {
    setToolsLoading(true)
    try {
      const response = await fetch('/api/ai-tools')
      const data = await response.json()
      
      // Sort tools by date (newest first) and votes
      const sortedTools = (data.tools || []).sort((a, b) => {
        // If tools have dates, sort by date first
        if (a.date && b.date) {
          return new Date(b.date) - new Date(a.date)
        }
        // Otherwise sort by votes
        return (b.votes || 0) - (a.votes || 0)
      })
      
      setAiTools(sortedTools)
    } catch (error) {
      toast.error('Failed to fetch AI tools')
    } finally {
      setToolsLoading(false)
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

  // Group tools by recency (today, this week, older)
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
      <div className="min-h-screen hero-gradient flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-4 border-white mx-auto mb-4"></div>
          <p className="text-white text-xl font-semibold">Loading HappyAxzora...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Animated Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 rounded-full bg-gradient-to-r from-purple-400 to-pink-400 opacity-20 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 rounded-full bg-gradient-to-r from-blue-400 to-cyan-400 opacity-20 animate-pulse"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full bg-gradient-to-r from-green-400 to-blue-400 opacity-10 animate-pulse"></div>
      </div>

      {/* Header */}
      <header className="relative z-10 border-b border-white/10 backdrop-blur-md bg-black/20">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="relative">
                <Sparkles className="h-10 w-10 text-purple-400 floating-animation" />
                <div className="absolute inset-0 h-10 w-10 rounded-full bg-purple-400/20 blur-xl"></div>
              </div>
              <h1 className="text-3xl font-bold text-gradient">
                HappyAxzora
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              <Badge variant="secondary" className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white border-0 px-4 py-2 button-3d">
                <Rocket className="h-4 w-4 mr-2" />
                Demo Mode
              </Badge>
              <div className="flex items-center space-x-2 glass-card-dark px-4 py-2 rounded-full">
                <User className="h-5 w-5 text-purple-400" />
                <span className="text-sm text-white">Demo User</span>
              </div>
              <Button variant="ghost" size="sm" onClick={handleSignOut} className="button-3d text-white hover:bg-white/10">
                <Settings className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10 container mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h2 className="text-5xl font-bold text-white mb-4">
            Discover the Future of <span className="text-gradient">AI Tools</span>
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Explore trending AI tools, generate powerful workflows, and access cutting-edge AI agents - all in one revolutionary platform
          </p>
        </div>

        <Tabs defaultValue="tools" className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-8 glass-card-dark p-2 rounded-2xl">
            <TabsTrigger value="tools" className="flex items-center space-x-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500 data-[state=active]:to-pink-500 data-[state=active]:text-white rounded-xl button-3d">
              <Search className="h-4 w-4" />
              <span>AI Tools</span>
            </TabsTrigger>
            <TabsTrigger value="workflows" className="flex items-center space-x-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-cyan-500 data-[state=active]:text-white rounded-xl button-3d">
              <Code className="h-4 w-4" />
              <span>Workflows</span>
            </TabsTrigger>
            <TabsTrigger value="agents" className="flex items-center space-x-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-green-500 data-[state=active]:to-teal-500 data-[state=active]:text-white rounded-xl button-3d">
              <Bot className="h-4 w-4" />
              <span>AI Agents</span>
            </TabsTrigger>
          </TabsList>

          {/* AI Tools Discovery */}
          <TabsContent value="tools" className="space-y-8">
            <div className="text-center space-y-6">
              <div className="relative inline-block">
                <h3 className="text-4xl font-bold text-white mb-4">Trending AI Tools</h3>
                <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-20 h-1 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full"></div>
              </div>
              <p className="text-gray-300 text-lg">
                Latest AI tools from Product Hunt, updated daily
              </p>
              <div className="max-w-lg mx-auto">
                <div className="relative">
                  <Search className="absolute left-4 top-4 h-5 w-5 text-gray-400" />
                  <Input
                    placeholder="Search AI tools..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-12 h-12 glass-card-dark border-white/20 text-white placeholder-gray-400 rounded-full"
                  />
                </div>
              </div>
            </div>

            {toolsLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="morphism-card-dark p-6 rounded-xl">
                    <div className="loading-shimmer h-6 w-3/4 mb-4 rounded"></div>
                    <div className="loading-shimmer h-4 w-full mb-2 rounded"></div>
                    <div className="loading-shimmer h-4 w-2/3 mb-4 rounded"></div>
                    <div className="loading-shimmer h-10 w-full rounded"></div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="space-y-8">
                {/* Today's Tools */}
                {groupedTools.today.length > 0 && (
                  <div>
                    <h4 className="text-2xl font-bold text-white mb-6 flex items-center">
                      <Zap className="h-6 w-6 mr-2 text-yellow-400" />
                      Today's Latest
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {groupedTools.today.map((tool, index) => (
                        <Card key={index} className="morphism-card-dark border-white/20 card-3d group overflow-hidden">
                          <CardHeader className="pb-3">
                            <div className="flex items-center justify-between">
                              <CardTitle className="text-lg text-white group-hover:text-purple-400 transition-colors">
                                {tool.name}
                              </CardTitle>
                              <Badge variant="secondary" className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white border-0 flex items-center space-x-1">
                                <TrendingUp className="h-3 w-3" />
                                <span>{tool.votes || 0}</span>
                              </Badge>
                            </div>
                          </CardHeader>
                          <CardContent>
                            <CardDescription className="mb-4 text-gray-300">
                              {tool.description}
                            </CardDescription>
                            <div className="flex items-center justify-between">
                              <Button variant="outline" size="sm" asChild className="button-3d border-purple-400 text-purple-400 hover:bg-purple-400 hover:text-white">
                                <a href={tool.url} target="_blank" rel="noopener noreferrer">
                                  <ExternalLink className="h-4 w-4 mr-2" />
                                  Visit
                                </a>
                              </Button>
                              <Button variant="ghost" size="sm" className="text-red-400 hover:text-red-300">
                                <Heart className="h-4 w-4" />
                              </Button>
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
                    <h4 className="text-2xl font-bold text-white mb-6 flex items-center">
                      <Calendar className="h-6 w-6 mr-2 text-blue-400" />
                      This Week
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {groupedTools.thisWeek.map((tool, index) => (
                        <Card key={index} className="morphism-card-dark border-white/20 card-3d group overflow-hidden">
                          <CardHeader className="pb-3">
                            <div className="flex items-center justify-between">
                              <CardTitle className="text-lg text-white group-hover:text-blue-400 transition-colors">
                                {tool.name}
                              </CardTitle>
                              <Badge variant="secondary" className="bg-gradient-to-r from-blue-400 to-cyan-500 text-white border-0 flex items-center space-x-1">
                                <TrendingUp className="h-3 w-3" />
                                <span>{tool.votes || 0}</span>
                              </Badge>
                            </div>
                          </CardHeader>
                          <CardContent>
                            <CardDescription className="mb-4 text-gray-300">
                              {tool.description}
                            </CardDescription>
                            <div className="flex items-center justify-between">
                              <Button variant="outline" size="sm" asChild className="button-3d border-blue-400 text-blue-400 hover:bg-blue-400 hover:text-white">
                                <a href={tool.url} target="_blank" rel="noopener noreferrer">
                                  <ExternalLink className="h-4 w-4 mr-2" />
                                  Visit
                                </a>
                              </Button>
                              <Button variant="ghost" size="sm" className="text-red-400 hover:text-red-300">
                                <Heart className="h-4 w-4" />
                              </Button>
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
                    <h4 className="text-2xl font-bold text-white mb-6 flex items-center">
                      <Database className="h-6 w-6 mr-2 text-gray-400" />
                      Previous Tools
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {groupedTools.older.map((tool, index) => (
                        <Card key={index} className="morphism-card-dark border-white/20 card-3d group overflow-hidden">
                          <CardHeader className="pb-3">
                            <div className="flex items-center justify-between">
                              <CardTitle className="text-lg text-white group-hover:text-gray-400 transition-colors">
                                {tool.name}
                              </CardTitle>
                              <Badge variant="secondary" className="bg-gradient-to-r from-gray-400 to-gray-500 text-white border-0 flex items-center space-x-1">
                                <TrendingUp className="h-3 w-3" />
                                <span>{tool.votes || 0}</span>
                              </Badge>
                            </div>
                          </CardHeader>
                          <CardContent>
                            <CardDescription className="mb-4 text-gray-300">
                              {tool.description}
                            </CardDescription>
                            <div className="flex items-center justify-between">
                              <Button variant="outline" size="sm" asChild className="button-3d border-gray-400 text-gray-400 hover:bg-gray-400 hover:text-white">
                                <a href={tool.url} target="_blank" rel="noopener noreferrer">
                                  <ExternalLink className="h-4 w-4 mr-2" />
                                  Visit
                                </a>
                              </Button>
                              <Button variant="ghost" size="sm" className="text-red-400 hover:text-red-300">
                                <Heart className="h-4 w-4" />
                              </Button>
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
            <div className="text-center space-y-6">
              <div className="relative inline-block">
                <h3 className="text-4xl font-bold text-white mb-4">Workflow Builder</h3>
                <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-20 h-1 bg-gradient-to-r from-blue-400 to-cyan-400 rounded-full"></div>
              </div>
              <p className="text-gray-300 text-lg">
                Generate n8n or Make.com workflows from simple prompts
              </p>
            </div>

            <Card className="max-w-4xl mx-auto morphism-card-dark border-white/20 card-3d">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <Wand2 className="h-6 w-6 mr-2 text-blue-400" />
                  Create Workflow
                </CardTitle>
                <CardDescription className="text-gray-300">
                  Describe what you want your workflow to do
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <Label htmlFor="workflow-type" className="text-white">Workflow Type</Label>
                  <Select value={workflowType} onValueChange={setWorkflowType}>
                    <SelectTrigger className="glass-card-dark border-white/20 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="glass-card-dark border-white/20">
                      <SelectItem value="n8n">n8n</SelectItem>
                      <SelectItem value="make">Make.com</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label htmlFor="workflow-prompt" className="text-white">Workflow Description</Label>
                  <Textarea
                    id="workflow-prompt"
                    placeholder="E.g., Create a workflow that sends a Slack message when a new email arrives in Gmail..."
                    value={workflowPrompt}
                    onChange={(e) => setWorkflowPrompt(e.target.value)}
                    rows={4}
                    className="glass-card-dark border-white/20 text-white placeholder-gray-400"
                  />
                </div>

                <Button 
                  onClick={handleWorkflowGenerate}
                  disabled={!workflowPrompt.trim() || workflowLoading}
                  className="w-full button-3d bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 border-0"
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
              <Card className="max-w-6xl mx-auto morphism-card-dark border-white/20 card-3d">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-white flex items-center">
                      <Layers className="h-6 w-6 mr-2 text-green-400" />
                      Generated Workflow
                    </CardTitle>
                    <Button onClick={downloadWorkflow} variant="outline" className="button-3d border-green-400 text-green-400 hover:bg-green-400 hover:text-white">
                      <Download className="h-4 w-4 mr-2" />
                      Download JSON
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <ScrollArea className="h-96 w-full custom-scrollbar">
                    <pre className="text-sm glass-card-dark p-4 rounded-lg overflow-x-auto text-gray-300">
                      {JSON.stringify(generatedWorkflow, null, 2)}
                    </pre>
                  </ScrollArea>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* AI Agents */}
          <TabsContent value="agents" className="space-y-8">
            <div className="text-center space-y-6">
              <div className="relative inline-block">
                <h3 className="text-4xl font-bold text-white mb-4">AI Agents</h3>
                <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-20 h-1 bg-gradient-to-r from-green-400 to-teal-400 rounded-full"></div>
              </div>
              <p className="text-gray-300 text-lg">
                Ready-to-use AI agents for common tasks
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {aiAgents.map((agent) => (
                <Dialog key={agent.id}>
                  <DialogTrigger asChild>
                    <Card className="morphism-card-dark border-white/20 card-3d group cursor-pointer overflow-hidden">
                      <CardHeader className="pb-3">
                        <div className="flex items-center space-x-3">
                          <div className={`p-3 rounded-xl bg-gradient-to-r ${agent.color} button-3d`}>
                            <agent.icon className="h-6 w-6 text-white" />
                          </div>
                          <div>
                            <CardTitle className="text-lg text-white group-hover:text-purple-400 transition-colors">
                              {agent.name}
                            </CardTitle>
                            <CardDescription className="text-gray-300">
                              {agent.description}
                            </CardDescription>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <Button variant="outline" className="w-full button-3d border-purple-400 text-purple-400 hover:bg-purple-400 hover:text-white">
                          <ArrowRight className="h-4 w-4 mr-2" />
                          Use Agent
                        </Button>
                      </CardContent>
                    </Card>
                  </DialogTrigger>
                  <DialogContent className="max-w-3xl morphism-card-dark border-white/20">
                    <DialogHeader>
                      <DialogTitle className="flex items-center space-x-2 text-white">
                        <div className={`p-2 rounded-lg bg-gradient-to-r ${agent.color}`}>
                          <agent.icon className="h-5 w-5 text-white" />
                        </div>
                        <span>{agent.name}</span>
                      </DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="agent-input" className="text-white">Input</Label>
                        <Textarea
                          id="agent-input"
                          placeholder={`Enter your ${agent.name.toLowerCase()} requirements...`}
                          value={selectedAgent?.id === agent.id ? agentInput : ''}
                          onChange={(e) => {
                            setSelectedAgent(agent)
                            setAgentInput(e.target.value)
                          }}
                          rows={4}
                          className="glass-card-dark border-white/20 text-white placeholder-gray-400"
                        />
                      </div>
                      
                      <Button 
                        onClick={handleAgentRun}
                        disabled={!agentInput.trim() || agentLoading}
                        className={`w-full button-3d bg-gradient-to-r ${agent.color} hover:opacity-90 border-0`}
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
                          <Label className="text-white">Output</Label>
                          <ScrollArea className="h-64 w-full custom-scrollbar">
                            <div className="glass-card-dark p-4 rounded-lg">
                              <pre className="text-sm whitespace-pre-wrap text-gray-300">
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
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}