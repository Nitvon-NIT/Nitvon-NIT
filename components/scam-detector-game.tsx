"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useGameState } from "@/lib/game-state"
import { Shield, AlertTriangle, CheckCircle, XCircle } from "lucide-react"

interface Project {
  id: string
  name: string
  description: string
  features: string[]
  redFlags: string[]
  isScam: boolean
}

const projects: Project[] = [
  {
    id: "legit-defi",
    name: "SolidSwap Protocol",
    description: "A decentralized exchange with innovative automated market making algorithms.",
    features: [
      "Open source code on GitHub",
      "Audited by reputable security firms",
      "Experienced team with LinkedIn profiles",
      "Realistic roadmap with achievable milestones",
      "Active community on Discord",
    ],
    redFlags: [],
    isScam: false,
  },
  {
    id: "obvious-scam",
    name: "MoonRocket Finance",
    description: "Get rich quick with our revolutionary AI-powered trading bot that guarantees 1000% returns!",
    features: [
      "Anonymous team members",
      "Promises guaranteed returns",
      "No technical documentation",
      "Copied whitepaper from other projects",
      "Heavy focus on referral rewards",
    ],
    redFlags: [
      "Unrealistic return promises",
      "Anonymous team",
      "No code repository",
      "Plagiarized content",
      "Pyramid scheme structure",
    ],
    isScam: true,
  },
  {
    id: "subtle-scam",
    name: "CryptoVault Pro",
    description: "Advanced yield farming protocol with sustainable tokenomics and community governance.",
    features: [
      "Professional website design",
      "Detailed tokenomics paper",
      "Partnership announcements",
      "Celebrity endorsements",
      "High APY rewards",
    ],
    redFlags: [
      "Unverified partnerships",
      "Paid celebrity endorsements",
      "Unsustainable yield rates",
      "Complex tokenomics hiding flaws",
      "No real utility for token",
    ],
    isScam: true,
  },
]

export function ScamDetectorGame() {
  const { setScreen, addXP, addCoins } = useGameState()
  const [currentProject, setCurrentProject] = useState(() => projects[Math.floor(Math.random() * projects.length)])
  const [selectedAnswer, setSelectedAnswer] = useState<boolean | null>(null)
  const [showResult, setShowResult] = useState(false)
  const [timeLeft, setTimeLeft] = useState(30)

  const handleAnswer = (isScam: boolean) => {
    setSelectedAnswer(isScam)
    setShowResult(true)

    const isCorrect = isScam === currentProject.isScam
    if (isCorrect) {
      addXP(50)
      addCoins(25)
    } else {
      addXP(10)
    }

    setTimeout(() => {
      setScreen("dashboard")
    }, 3000)
  }

  if (showResult) {
    const isCorrect = selectedAnswer === currentProject.isScam
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <Card className="max-w-2xl w-full p-8 bg-card/90 backdrop-blur-sm text-center">
          <div className="space-y-6">
            <div className="flex justify-center">
              {isCorrect ? (
                <CheckCircle className="h-16 w-16 text-chart-5" />
              ) : (
                <XCircle className="h-16 w-16 text-destructive" />
              )}
            </div>

            <div>
              <h2 className="text-3xl font-bold text-foreground mb-2">{isCorrect ? "Correct!" : "Wrong!"}</h2>
              <p className="text-lg text-muted-foreground">
                {currentProject.isScam
                  ? "This was indeed a scam project with multiple red flags."
                  : "This was a legitimate project with proper documentation and transparency."}
              </p>
            </div>

            {currentProject.isScam && (
              <div className="text-left">
                <h3 className="font-semibold text-destructive mb-2">Red Flags Detected:</h3>
                <ul className="space-y-1 text-sm text-muted-foreground">
                  {currentProject.redFlags.map((flag, index) => (
                    <li key={index} className="flex items-center gap-2">
                      <AlertTriangle className="h-3 w-3 text-destructive" />
                      {flag}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div className="grid grid-cols-2 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">+{isCorrect ? 50 : 10} XP</div>
                <div className="text-sm text-muted-foreground">Experience</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-chart-2">+{isCorrect ? 25 : 0} Coins</div>
                <div className="text-sm text-muted-foreground">Reward</div>
              </div>
            </div>
          </div>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen p-4">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="flex justify-center">
            <Shield className="h-12 w-12 text-accent" />
          </div>
          <h1 className="text-3xl font-bold text-foreground">Scam Detector Challenge</h1>
          <p className="text-muted-foreground">
            Analyze this crypto project and determine if it's legitimate or a scam
          </p>
          <Badge variant="outline" className="text-lg px-4 py-2">
            Time: {timeLeft}s
          </Badge>
        </div>

        {/* Project Analysis */}
        <Card className="p-6 bg-card/80 backdrop-blur-sm">
          <div className="space-y-4">
            <div>
              <h2 className="text-2xl font-bold text-primary mb-2">{currentProject.name}</h2>
              <p className="text-foreground leading-relaxed">{currentProject.description}</p>
            </div>

            <div>
              <h3 className="font-semibold text-foreground mb-3">Project Features:</h3>
              <div className="grid md:grid-cols-2 gap-2">
                {currentProject.features.map((feature, index) => (
                  <div key={index} className="flex items-center gap-2 p-2 bg-secondary/30 rounded">
                    <div className="w-2 h-2 bg-accent rounded-full" />
                    <span className="text-sm text-foreground">{feature}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Card>

        {/* Decision Buttons */}
        <div className="grid md:grid-cols-2 gap-4">
          <Button
            onClick={() => handleAnswer(false)}
            size="lg"
            className="h-20 bg-chart-5 hover:bg-chart-5/90 text-white flex-col gap-2"
          >
            <CheckCircle className="h-6 w-6" />
            <span className="text-lg font-semibold">Legitimate Project</span>
            <span className="text-sm opacity-90">This looks safe to invest</span>
          </Button>

          <Button onClick={() => handleAnswer(true)} size="lg" variant="destructive" className="h-20 flex-col gap-2">
            <AlertTriangle className="h-6 w-6" />
            <span className="text-lg font-semibold">Scam Project</span>
            <span className="text-sm opacity-90">Too many red flags</span>
          </Button>
        </div>

        {/* Skip option */}
        <div className="text-center">
          <Button variant="ghost" onClick={() => setScreen("dashboard")}>
            Skip Mini-Game
          </Button>
        </div>
      </div>
    </div>
  )
}
