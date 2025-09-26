"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useGameState } from "@/lib/game-state"
import { Trophy, Star, Zap, Gift } from "lucide-react"

interface LevelUpModalProps {
  isOpen: boolean
  onClose: () => void
  newLevel: number
  newRank: string
}

const rankRewards = {
  "Street Trader": { coins: 50, description: "You've learned the basics of trading!" },
  "Market Analyst": { coins: 100, description: "Your analytical skills are improving!" },
  "Pro Trader": { coins: 200, description: "You're becoming a seasoned professional!" },
  Whale: { coins: 500, description: "You now move markets with your trades!" },
  "Legendary Trader": { coins: 1000, description: "You've mastered the art of crypto trading!" },
}

export function LevelUpModal({ isOpen, onClose, newLevel, newRank }: LevelUpModalProps) {
  const { addCoins } = useGameState()
  const [showRewards, setShowRewards] = useState(false)

  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => setShowRewards(true), 1000)
      return () => clearTimeout(timer)
    }
  }, [isOpen])

  if (!isOpen) return null

  const reward = rankRewards[newRank as keyof typeof rankRewards] || { coins: 25, description: "Keep growing!" }

  const handleClaim = () => {
    addCoins(reward.coins)
    onClose()
  }

  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <Card className="max-w-md w-full p-8 bg-card/95 backdrop-blur-sm border-primary/50 text-center relative overflow-hidden">
        {/* Background glow effect */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-accent/10" />

        <div className="relative z-10 space-y-6">
          {/* Level up animation */}
          <div className="flex justify-center">
            <div className="relative">
              <Trophy className="h-16 w-16 text-primary glow" />
              <div className="absolute -top-2 -right-2 w-6 h-6 bg-accent rounded-full flex items-center justify-center">
                <Star className="h-3 w-3 text-background" />
              </div>
            </div>
          </div>

          <div>
            <h2 className="text-3xl font-bold text-primary neon-text mb-2">Level Up!</h2>
            <p className="text-lg text-foreground">You've reached Level {newLevel}</p>
          </div>

          <Badge className="text-lg px-4 py-2 bg-primary text-primary-foreground">{newRank}</Badge>

          <p className="text-muted-foreground">{reward.description}</p>

          {showRewards && (
            <div className="space-y-4 animate-in fade-in duration-500">
              <div className="flex items-center justify-center gap-2 p-4 bg-secondary/50 rounded-lg border border-accent/50">
                <Gift className="h-5 w-5 text-accent" />
                <span className="font-semibold text-foreground">Reward:</span>
                <span className="text-chart-2 font-bold">+{reward.coins} Coins</span>
              </div>

              <Button onClick={handleClaim} size="lg" className="w-full bg-primary hover:bg-primary/90 glow">
                <Zap className="h-4 w-4 mr-2" />
                Claim Rewards
              </Button>
            </div>
          )}
        </div>
      </Card>
    </div>
  )
}
