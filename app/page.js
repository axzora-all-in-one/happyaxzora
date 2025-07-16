'use client'

import { useState, useEffect } from 'react'
import { auth } from '@/lib/firebase'
import { onAuthStateChanged, RecaptchaVerifier, signInWithPhoneNumber, PhoneAuthProvider, signInWithCredential } from 'firebase/auth'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Separator } from '@/components/ui/separator'
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
  LogOut,
  Phone
} from 'lucide-react'

// Phone Auth Component
function PhoneAuth() {
  const [phoneNumber, setPhoneNumber] = useState('')
  const [verificationCode, setVerificationCode] = useState('')
  const [verificationId, setVerificationId] = useState('')
  const [showVerification, setShowVerification] = useState(false)
  const [loading, setLoading] = useState(false)
  const [recaptchaVerifier, setRecaptchaVerifier] = useState(null)

  useEffect(() => {
    const setupRecaptcha = () => {
      if (!recaptchaVerifier) {
        const verifier = new RecaptchaVerifier(auth, 'recaptcha-container', {
          size: 'normal',
          callback: (response) => {
            console.log('reCAPTCHA verified')
          },
          'expired-callback': () => {
            console.log('reCAPTCHA expired')
          }
        })
        setRecaptchaVerifier(verifier)
      }
    }

    setupRecaptcha()
    
    return () => {
      if (recaptchaVerifier) {
        recaptchaVerifier.clear()
      }
    }
  }, [recaptchaVerifier])

  const handleSendCode = async () => {
    if (!phoneNumber) {
      toast.error('Please enter a phone number')
      return
    }

    setLoading(true)
    try {
      const formattedNumber = phoneNumber.startsWith('+') ? phoneNumber : `+${phoneNumber}`
      
      const confirmationResult = await signInWithPhoneNumber(auth, formattedNumber, recaptchaVerifier)
      setVerificationId(confirmationResult.verificationId)
      setShowVerification(true)
      toast.success('Verification code sent!')
    } catch (error) {
      console.error('Error sending verification code:', error)
      toast.error('Failed to send verification code. Please try again.')
      
      if (recaptchaVerifier) {
        recaptchaVerifier.clear()
        setRecaptchaVerifier(null)
      }
    } finally {
      setLoading(false)
    }
  }

  const handleVerifyCode = async () => {
    if (!verificationCode) {
      toast.error('Please enter the verification code')
      return
    }

    setLoading(true)
    try {
      const credential = PhoneAuthProvider.credential(verificationId, verificationCode)
      await signInWithCredential(auth, credential)
      toast.success('Phone number verified successfully!')
    } catch (error) {
      console.error('Error verifying code:', error)
      toast.error('Invalid verification code. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      {!showVerification ? (
        <div className="space-y-4">
          <div>
            <Label htmlFor="phone">Phone Number</Label>
            <div className="flex space-x-2">
              <Input
                id="phone"
                type="tel"
                placeholder="+1234567890"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                className="flex-1"
              />
            </div>
            <p className="text-sm text-muted-foreground mt-1">
              Include country code (e.g., +1 for US)
            </p>
          </div>
          
          <div id="recaptcha-container"></div>
          
          <Button 
            onClick={handleSendCode} 
            disabled={loading || !phoneNumber}
            className="w-full"
          >
            {loading ? (
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
            ) : (
              <Phone className="h-4 w-4 mr-2" />
            )}
            Send Verification Code
          </Button>
        </div>
      ) : (
        <div className="space-y-4">
          <div>
            <Label htmlFor="code">Verification Code</Label>
            <Input
              id="code"
              type="text"
              placeholder="123456"
              value={verificationCode}
              onChange={(e) => setVerificationCode(e.target.value)}
              maxLength={6}
            />
            <p className="text-sm text-muted-foreground mt-1">
              Enter the 6-digit code sent to {phoneNumber}
            </p>
          </div>
          
          <Button 
            onClick={handleVerifyCode} 
            disabled={loading || !verificationCode}
            className="w-full"
          >
            {loading ? (
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
            ) : (
              <MessageSquare className="h-4 w-4 mr-2" />
            )}
            Verify Code
          </Button>
          
          <Button 
            variant="outline" 
            onClick={() => {
              setShowVerification(false)
              setVerificationCode('')
              setVerificationId('')
            }}
            className="w-full"
          >
            Back to Phone Number
          </Button>
        </div>
      )}
    </div>
  )
}

const aiAgents = [
  { id: 'resume', name: 'Resume Builder', icon: FileText, description: 'Create professional resumes' },
  { id: 'product', name: 'Product Description', icon: PenTool, description: 'Generate compelling product descriptions' },
  { id: 'email', name: 'Email Summarizer', icon: Mail, description: 'Summarize long emails' },
  { id: 'pdf', name: 'PDF Explainer', icon: FileText, description: 'Explain PDF documents' },
  { id: 'instagram', name: 'Instagram Caption', icon: MessageSquare, description: 'Create engaging Instagram captions' },
  { id: 'social', name: 'Social Media Calendar', icon: Calendar, description: 'Plan social media content' },
  { id: 'business', name: 'Business Name Generator', icon: Briefcase, description: 'Generate business names' },
  { id: 'support', name: 'Customer Support Bot', icon: Bot, description: 'Handle customer inquiries' },
  { id: 'medical', name: 'Medical Symptoms', icon: Stethoscope, description: 'Explain medical symptoms' },
  { id: 'travel', name: 'Travel Planner', icon: Plane, description: 'Plan travel itineraries' },
  { id: 'chatbot', name: 'Custom Chatbot', icon: MessageSquare, description: 'Build custom chatbots' },
  { id: 'legal', name: 'Legal Document', icon: Shield, description: 'Simplify legal documents' },
  { id: 'linkedin', name: 'LinkedIn Bio', icon: User, description: 'Create LinkedIn bios' },
  { id: 'whatsapp', name: 'WhatsApp Formatter', icon: Smartphone, description: 'Format WhatsApp messages' },
  { id: 'planner', name: 'Daily Planner', icon: ClipboardList, description: 'Organize daily tasks' }
]

export default function App() {
  const [user, setUser] = useState({ uid: 'demo_user', phoneNumber: '+1234567890' }) // Mock user for demo
  const [loading, setLoading] = useState(false) // Skip loading state
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
    // Skip auth state changes for demo
    fetchAiTools()
  }, [])

  const fetchAiTools = async () => {
    setToolsLoading(true)
    try {
      const response = await fetch('/api/ai-tools')
      const data = await response.json()
      setAiTools(data.tools || [])
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
    // Mock signout - just show a message
    toast.success('Demo mode - authentication disabled')
  }

  const filteredTools = aiTools.filter(tool => 
    tool.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    tool.description.toLowerCase().includes(searchTerm.toLowerCase())
  )

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    )
  }

  // Always show main content - authentication temporarily disabled
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Sparkles className="h-8 w-8 text-primary" />
              <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-purple-500 bg-clip-text text-transparent">
                HappyAxzora
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              <Badge variant="secondary" className="bg-yellow-500/20 text-yellow-700">
                Demo Mode
              </Badge>
              <div className="flex items-center space-x-2">
                <User className="h-5 w-5" />
                <span className="text-sm">Demo User</span>
              </div>
              <Button variant="ghost" size="sm" onClick={handleSignOut}>
                <Settings className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <Tabs defaultValue="tools" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="tools" className="flex items-center space-x-2">
              <Search className="h-4 w-4" />
              <span>AI Tools</span>
            </TabsTrigger>
            <TabsTrigger value="workflows" className="flex items-center space-x-2">
              <Code className="h-4 w-4" />
              <span>Workflows</span>
            </TabsTrigger>
            <TabsTrigger value="agents" className="flex items-center space-x-2">
              <Bot className="h-4 w-4" />
              <span>AI Agents</span>
            </TabsTrigger>
          </TabsList>

          {/* AI Tools Discovery */}
          <TabsContent value="tools" className="space-y-6">
            <div className="text-center space-y-4">
              <h2 className="text-3xl font-bold">Discover Trending AI Tools</h2>
              <p className="text-muted-foreground">
                Latest AI tools from Product Hunt, updated daily
              </p>
              <div className="max-w-md mx-auto">
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search AI tools..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
            </div>

            {toolsLoading ? (
              <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredTools.map((tool, index) => (
                  <Card key={index} className="hover:shadow-lg transition-shadow">
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-lg">{tool.name}</CardTitle>
                        <Badge variant="secondary" className="flex items-center space-x-1">
                          <TrendingUp className="h-3 w-3" />
                          <span>{tool.votes || 0}</span>
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <CardDescription className="mb-4">
                        {tool.description}
                      </CardDescription>
                      <div className="flex items-center justify-between">
                        <Button variant="outline" size="sm" asChild>
                          <a href={tool.url} target="_blank" rel="noopener noreferrer">
                            <ExternalLink className="h-4 w-4 mr-2" />
                            Visit
                          </a>
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Heart className="h-4 w-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          {/* Workflow Builder */}
          <TabsContent value="workflows" className="space-y-6">
            <div className="text-center space-y-4">
              <h2 className="text-3xl font-bold">Workflow Builder</h2>
              <p className="text-muted-foreground">
                Generate n8n or Make.com workflows from simple prompts
              </p>
            </div>

            <Card className="max-w-2xl mx-auto">
              <CardHeader>
                <CardTitle>Create Workflow</CardTitle>
                <CardDescription>
                  Describe what you want your workflow to do
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="workflow-type">Workflow Type</Label>
                  <Select value={workflowType} onValueChange={setWorkflowType}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="n8n">n8n</SelectItem>
                      <SelectItem value="make">Make.com</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label htmlFor="workflow-prompt">Workflow Description</Label>
                  <Textarea
                    id="workflow-prompt"
                    placeholder="E.g., Create a workflow that sends a Slack message when a new email arrives in Gmail..."
                    value={workflowPrompt}
                    onChange={(e) => setWorkflowPrompt(e.target.value)}
                    rows={4}
                  />
                </div>

                <Button 
                  onClick={handleWorkflowGenerate}
                  disabled={!workflowPrompt.trim() || workflowLoading}
                  className="w-full"
                >
                  {workflowLoading ? (
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  ) : (
                    <Zap className="h-4 w-4 mr-2" />
                  )}
                  Generate Workflow
                </Button>
              </CardContent>
            </Card>

            {generatedWorkflow && (
              <Card className="max-w-4xl mx-auto">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>Generated Workflow</CardTitle>
                    <Button onClick={downloadWorkflow} variant="outline">
                      <Download className="h-4 w-4 mr-2" />
                      Download JSON
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <ScrollArea className="h-96 w-full">
                    <pre className="text-sm bg-muted p-4 rounded-lg overflow-x-auto">
                      {JSON.stringify(generatedWorkflow, null, 2)}
                    </pre>
                  </ScrollArea>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* AI Agents */}
          <TabsContent value="agents" className="space-y-6">
            <div className="text-center space-y-4">
              <h2 className="text-3xl font-bold">AI Agents</h2>
              <p className="text-muted-foreground">
                Ready-to-use AI agents for common tasks
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {aiAgents.map((agent) => (
                <Dialog key={agent.id}>
                  <DialogTrigger asChild>
                    <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                      <CardHeader className="pb-3">
                        <div className="flex items-center space-x-3">
                          <div className="p-2 bg-primary/10 rounded-lg">
                            <agent.icon className="h-5 w-5 text-primary" />
                          </div>
                          <div>
                            <CardTitle className="text-lg">{agent.name}</CardTitle>
                            <CardDescription>{agent.description}</CardDescription>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <Button variant="outline" className="w-full">
                          <ArrowRight className="h-4 w-4 mr-2" />
                          Use Agent
                        </Button>
                      </CardContent>
                    </Card>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl">
                    <DialogHeader>
                      <DialogTitle className="flex items-center space-x-2">
                        <agent.icon className="h-5 w-5" />
                        <span>{agent.name}</span>
                      </DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="agent-input">Input</Label>
                        <Textarea
                          id="agent-input"
                          placeholder={`Enter your ${agent.name.toLowerCase()} requirements...`}
                          value={selectedAgent?.id === agent.id ? agentInput : ''}
                          onChange={(e) => {
                            setSelectedAgent(agent)
                            setAgentInput(e.target.value)
                          }}
                          rows={4}
                        />
                      </div>
                      
                      <Button 
                        onClick={handleAgentRun}
                        disabled={!agentInput.trim() || agentLoading}
                        className="w-full"
                      >
                        {agentLoading ? (
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        ) : (
                          <Bot className="h-4 w-4 mr-2" />
                        )}
                        Run Agent
                      </Button>

                      {selectedAgent?.id === agent.id && agentOutput && (
                        <div>
                          <Label>Output</Label>
                          <ScrollArea className="h-48 w-full">
                            <div className="p-4 bg-muted rounded-lg">
                              <pre className="text-sm whitespace-pre-wrap">
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