"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useGameState } from "@/lib/game-state"
import { AlertTriangle, TrendingDown, TrendingUp, Clock, Zap } from "lucide-react"

interface MarketEventData {
  id: string
  title: string
  description: string
  type: "crash" | "pump" | "hack" | "regulation" | "whale" | "fomo"
  severity: "low" | "medium" | "high" | "extreme"
  choices: {
    id: string
    text: string
    icon: React.ReactNode
    outcome: "positive" | "negative" | "neutral"
    xpReward: number
    portfolioChange: number
    description: string
  }[]
}

const marketEvents: MarketEventData[] = [
  {
    id: "exchange-hack",
    title: "Exchange Hacked!",
    description:
      "A major cryptocurrency exchange has been compromised. Hackers have stolen $100M worth of crypto, causing panic across all markets. Prices are dropping rapidly!",
    type: "hack",
    severity: "extreme",
    choices: [
      {
        id: "buy-dip",
        text: "Buy the Dip",
        icon: <TrendingUp className="h-4 w-4" />,
        outcome: "positive",
        xpReward: 25,
        portfolioChange: 0.15,
        description: "Risky but potentially rewarding - you believe the market will recover quickly.",
      },
      {
        id: "sell-all",
        text: "Sell Everything",
        icon: <TrendingDown className="h-4 w-4" />,
        outcome: "negative",
        xpReward: 10,
        portfolioChange: -0.05,
        description: "Play it safe and minimize losses, but you might miss the recovery.",
      },
      {
        id: "hold-strong",
        text: "Hold Strong",
        icon: <Clock className="h-4 w-4" />,
        outcome: "neutral",
        xpReward: 15,
        portfolioChange: -0.08,
        description: "Weather the storm and wait for markets to stabilize.",
      },
    ],
  },
  {
    id: "whale-movement",
    title: "Whale Alert!",
    description:
      "A crypto whale just moved 50,000 BTC to an unknown wallet. The community is speculating whether this is a sign of an incoming dump or institutional adoption.",
    type: "whale",
    severity: "high",
    choices: [
      {
        id: "follow-whale",
        text: "Follow the Whale",
        icon: <Zap className="h-4 w-4" />,
        outcome: "positive",
        xpReward: 20,
        portfolioChange: 0.12,
        description: "Trust the whale's judgment and make similar moves.",
      },
      {
        id: "contrarian-bet",
        text: "Bet Against It",
        icon: <AlertTriangle className="h-4 w-4" />,
        outcome: "negative",
        xpReward: 30,
        portfolioChange: -0.1,
        description: "Go against the crowd - sometimes whales are wrong.",
      },
      {
        id: "wait-and-see",
        text: "Wait and See",
        icon: <Clock className="h-4 w-4" />,
        outcome: "neutral",
        xpReward: 10,
        portfolioChange: 0.02,
        description: "Observe the market reaction before making any moves.",
      },
    ],
  },
  {
    id: "fomo-wave",
    title: "FOMO Wave Incoming!",
    description:
      "Social media is buzzing about a new 'revolutionary' cryptocurrency. Influencers are promoting it heavily, and retail investors are rushing in. The price has already pumped 300%!",
    type: "fomo",
    severity: "medium",
    choices: [
      {
        id: "join-fomo",
        text: "Join the FOMO",
        icon: <TrendingUp className="h-4 w-4" />,
        outcome: "negative",
        xpReward: 5,
        portfolioChange: -0.15,
        description: "Jump on the bandwagon - but you might be too late.",
      },
      {
        id: "avoid-fomo",
        text: "Avoid the Hype",
        icon: <AlertTriangle className="h-4 w-4" />,
        outcome: "positive",
        xpReward: 25,
        portfolioChange: 0.05,
        description: "Stay disciplined and avoid the obvious trap.",
      },
      {
        id: "small-bet",
        text: "Small Speculative Bet",
        icon: <Zap className="h-4 w-4" />,
        outcome: "neutral",
        xpReward: 15,
        portfolioChange: -0.03,
        description: "Risk a small amount just in case it's legitimate.",
      },
    ],
  },
]

export function MarketEvent() {
  const { setScreen, addXP, updatePlayer, player } = useGameState()
  const [currentEvent] = useState(() => marketEvents[Math.floor(Math.random() * marketEvents.length)])
  const [selectedChoice, setSelectedChoice] = useState<string | null>(null)
  const [showResult, setShowResult] = useState(false)

  const handleChoice = (choice: MarketEventData["choices"][0]) => {
    setSelectedChoice(choice.id)
    setShowResult(true)

    // Apply rewards/penalties
    addXP(choice.xpReward)
    const portfolioChange = player.portfolio * choice.portfolioChange
    updatePlayer({ portfolio: player.portfolio + portfolioChange })

    // Auto-return to dashboard after 3 seconds
    setTimeout(() => {
      setScreen("dashboard")
    }, 3000)
  }

  const getSeverityColor = (severity: MarketEventData["severity"]) => {
    switch (severity) {
      case "extreme":
        return "bg-destructive text-destructive-foreground"
      case "high":
        return "bg-yellow-600 text-white"
      case "medium":
        return "bg-blue-600 text-white"
      default:
        return "bg-secondary text-secondary-foreground"
    }
  }

  const getTypeIcon = (type: MarketEventData["type"]) => {
    switch (type) {
      case "hack":
        return <AlertTriangle className="h-6 w-6 text-destructive" />
      case "pump":
        return <TrendingUp className="h-6 w-6 text-chart-5" />
      case "crash":
        return <TrendingDown className="h-6 w-6 text-destructive" />
      default:
        return <Zap className="h-6 w-6 text-accent" />
    }
  }

  if (showResult) {
    const choice = currentEvent.choices.find((c) => c.id === selectedChoice)!
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <Card className="max-w-2xl w-full p-8 bg-card/90 backdrop-blur-sm border-border/50 text-center">
          <div className="space-y-6">
            <div className="flex justify-center">
              {choice.outcome === "positive" ? (
                <TrendingUp className="h-16 w-16 text-chart-5" />
              ) : choice.outcome === "negative" ? (
                <TrendingDown className="h-16 w-16 text-destructive" />
              ) : (
                <Clock className="h-16 w-16 text-accent" />
              )}
            </div>

            <div>
              <h2 className="text-3xl font-bold text-foreground mb-2">
                {choice.outcome === "positive"
                  ? "Good Choice!"
                  : choice.outcome === "negative"
                    ? "Tough Break!"
                    : "Steady Move!"}
              </h2>
              <p className="text-lg text-muted-foreground">{choice.description}</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">+{choice.xpReward} XP</div>
                <div className="text-sm text-muted-foreground">Experience Gained</div>
              </div>
              <div className="text-center">
                <div
                  className={`text-2xl font-bold ${choice.portfolioChange >= 0 ? "text-chart-5" : "text-destructive"}`}
                >
                  {choice.portfolioChange >= 0 ? "+" : ""}${(player.portfolio * choice.portfolioChange).toFixed(0)}
                </div>
                <div className="text-sm text-muted-foreground">Portfolio Change</div>
              </div>
            </div>

            <div className="text-sm text-muted-foreground">Returning to dashboard...</div>
          </div>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="max-w-4xl w-full p-8 bg-card/90 backdrop-blur-sm border-border/50 relative overflow-hidden">
        {/* Background effect */}
        <div className="absolute inset-0 bg-gradient-to-br from-destructive/5 via-transparent to-accent/5" />

        <div className="relative z-10 space-y-6">
          {/* Event Header */}
          <div className="text-center space-y-4">
            <div className="flex justify-center items-center gap-4">
              {getTypeIcon(currentEvent.type)}
              <Badge className={getSeverityColor(currentEvent.severity)}>
                {currentEvent.severity.toUpperCase()} IMPACT
              </Badge>
            </div>

            <h1 className="text-4xl font-bold text-foreground neon-text">{currentEvent.title}</h1>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              {currentEvent.description}
            </p>
          </div>

          {/* Choices */}
          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-center text-foreground">How do you respond?</h3>
            <div className="grid md:grid-cols-3 gap-4">
              {currentEvent.choices.map((choice) => (
                <Button
                  key={choice.id}
                  onClick={() => handleChoice(choice)}
                  variant="outline"
                  size="lg"
                  className="h-auto p-6 flex-col gap-3 hover:bg-accent/10 hover:border-accent transition-all duration-200 group"
                >
                  <div className="flex items-center gap-2 text-lg font-semibold">
                    {choice.icon}
                    {choice.text}
                  </div>
                  <p className="text-sm text-muted-foreground text-center leading-relaxed group-hover:text-foreground transition-colors">
                    {choice.description}
                  </p>
                  <div className="flex justify-between w-full text-xs">
                    <span className="text-primary">+{choice.xpReward} XP</span>
                    <span className={choice.portfolioChange >= 0 ? "text-chart-5" : "text-destructive"}>
                      {choice.portfolioChange >= 0 ? "+" : ""}
                      {(choice.portfolioChange * 100).toFixed(1)}%
                    </span>
                  </div>
                </Button>
              ))}
            </div>
          </div>

          {/* Skip option */}
          <div className="text-center">
            <Button variant="ghost" size="sm" onClick={() => setScreen("dashboard")} className="text-muted-foreground">
              Skip Event
            </Button>
          </div>
        </div>
      </Card>
    </div>
  )
}
