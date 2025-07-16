'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { toast } from 'sonner'
import { 
  Search, 
  TrendingUp, 
  Bot, 
  User, 
  Settings,
  ExternalLink,
  Heart,
  Sparkles,
  Code,
  MessageSquare,
  FileText,
  Flame,
  Crown,
  BrainCircuit,
  Calendar,
  Database
} from 'lucide-react'

export default function App() {
  const [user, setUser] = useState({ uid: 'demo_user', phoneNumber: '+1234567890' })
  const [loading, setLoading] = useState(false)
  const [aiTools, setAiTools] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [toolsLoading, setToolsLoading] = useState(false)

  useEffect(() => {
    fetchAiTools()
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
              <Flame className="h-4 w-4 mr-2" />
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
                              <Button variant="ghost" size="sm" className="text-gray-500 hover:text-red-500">
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
                              <Button variant="ghost" size="sm" className="text-gray-500 hover:text-red-500">
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
                              <Button variant="ghost" size="sm" className="text-gray-500 hover:text-red-500">
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

          {/* Other tabs */}
          <TabsContent value="workflows" className="space-y-8">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
              <div className="text-center">
                <h3 className="text-3xl font-bold text-gray-900 mb-4">Workflow Builder</h3>
                <p className="text-gray-600 text-lg mb-8">
                  Generate n8n or Make.com workflows from simple prompts
                </p>
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                  <p className="text-blue-800">Workflow builder feature coming soon...</p>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="agents" className="space-y-8">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
              <div className="text-center">
                <h3 className="text-3xl font-bold text-gray-900 mb-4">AI Agents</h3>
                <p className="text-gray-600 text-lg mb-8">
                  Ready-to-use AI agents for common tasks
                </p>
                <div className="bg-purple-50 border border-purple-200 rounded-lg p-6">
                  <p className="text-purple-800">AI agents feature coming soon...</p>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="chatbots" className="space-y-8">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
              <div className="text-center">
                <h3 className="text-3xl font-bold text-gray-900 mb-4">Chatbot Builder</h3>
                <p className="text-gray-600 text-lg mb-8">
                  Create custom chatbots with your own knowledge base
                </p>
                <div className="bg-green-50 border border-green-200 rounded-lg p-6">
                  <p className="text-green-800">Chatbot builder feature coming soon...</p>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}