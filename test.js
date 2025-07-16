const React = require('react'); const { useState, useEffect } = React;
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
