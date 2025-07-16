'use client'

import { useState, useEffect } from 'react'
import { auth } from '@/lib/firebase'
import { RecaptchaVerifier, signInWithPhoneNumber, PhoneAuthProvider, signInWithCredential } from 'firebase/auth'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { toast } from 'sonner'
import { Phone, MessageSquare } from 'lucide-react'

export default function PhoneAuth() {
  const [phoneNumber, setPhoneNumber] = useState('')
  const [verificationCode, setVerificationCode] = useState('')
  const [verificationId, setVerificationId] = useState('')
  const [showVerification, setShowVerification] = useState(false)
  const [loading, setLoading] = useState(false)
  const [recaptchaVerifier, setRecaptchaVerifier] = useState(null)

  useEffect(() => {
    // Initialize reCAPTCHA
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
      
      // Reset reCAPTCHA
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