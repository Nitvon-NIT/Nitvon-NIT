"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useGameState } from "@/lib/game-state"
import { Trophy, Medal, Crown, TrendingUp, ArrowLeft, Calendar, Globe } from "lucide-react"
import Image from "next/image"

interface LeaderboardEntry {
  id: string
  name: string
  rank: string
  level: number
  portfolio: number
  xp: number
  avatar?: string
  isCurrentPlayer?: boolean
}

const mockLeaderboard: LeaderboardEntry[] = [
  {
    id: "1",
    name: "CryptoKing",
    rank: "Legendary Trader",
    level: 15,
    portfolio: 2500000,
    xp: 1500,
    avatar: "/images/nitvon-logo.png",
  },
  {
    id: "2",
    name: "WhaleWatcher",
    rank: "Whale",
    level: 12,
    portfolio: 1800000,
    xp: 1200,
  },
  {
    id: "3",
    name: "DiamondHands",
    rank: "Pro Trader",
    level: 10,
    portfolio: 950000,
    xp: 1000,
  },
  {
    id: "4",
    name: "MoonShot",
    rank: "Pro Trader",
    level: 9,
    portfolio: 750000,
    xp: 900,
  },
  {
    id: "5",
    name: "HODLer",
    rank: "Market Analyst",
    level: 7,
    portfolio: 500000,
    xp: 700,
  },
]

export function Leaderboard() {
  const { setScreen, player } = useGameState()
  const [activeTab, setActiveTab] = useState("global")

  // Add current player to leaderboard for demonstration
  const leaderboardWithPlayer: LeaderboardEntry[] = [
    ...mockLeaderboard,
    {
      id: "current",
      name: "You",
      rank: player.rank,
      level: player.level,
      portfolio: player.portfolio,
      xp: player.xp,
      isCurrentPlayer: true,
    },
  ].sort((a, b) => b.portfolio - a.portfolio)

  const getRankIcon = (position: number) => {
    switch (position) {
      case 1:
        return <Crown className="h-6 w-6 text-yellow-500" />
      case 2:
        return <Medal className="h-6 w-6 text-gray-400" />
      case 3:
        return <Medal className="h-6 w-6 text-amber-600" />
      default:
        return <Trophy className="h-5 w-5 text-muted-foreground" />
    }
  }

  const getRankBadgeColor = (position: number) => {
    switch (position) {
      case 1:
        return "bg-yellow-500 text-black"
      case 2:
        return "bg-gray-400 text-white"
      case 3:
        return "bg-amber-600 text-white"
      default:
        return "bg-secondary text-secondary-foreground"
    }
  }

  return (
    <div className="min-h-screen p-4">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setScreen("menu")}
              className="text-muted-foreground hover:text-foreground"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-primary neon-text">Leaderboard</h1>
              <p className="text-muted-foreground">Top traders in Cryptonia</p>
            </div>
          </div>
          <Badge variant="outline" className="border-accent text-accent">
            Your Rank: #{leaderboardWithPlayer.findIndex((p) => p.isCurrentPlayer) + 1}
          </Badge>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="global" className="flex items-center gap-2">
              <Globe className="h-4 w-4" />
              Global
            </TabsTrigger>
            <TabsTrigger value="weekly" className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              Weekly
            </TabsTrigger>
          </TabsList>

          <TabsContent value="global" className="space-y-4">
            {/* Top 3 Podium */}
            <Card className="p-6 bg-card/80 backdrop-blur-sm">
              <h3 className="font-semibold mb-4 text-center text-foreground">Top Traders</h3>
              <div className="grid grid-cols-3 gap-4">
                {leaderboardWithPlayer.slice(0, 3).map((entry, index) => (
                  <div
                    key={entry.id}
                    className={`text-center p-4 rounded-lg ${
                      entry.isCurrentPlayer ? "bg-primary/20 border border-primary" : "bg-secondary/30"
                    }`}
                  >
                    <div className="flex justify-center mb-2">{getRankIcon(index + 1)}</div>
                    <div className="space-y-2">
                      <div className="flex justify-center">
                        {entry.avatar ? (
                          <Image
                            src={entry.avatar || "/placeholder.svg"}
                            alt={entry.name}
                            width={40}
                            height={40}
                            className="rounded-full"
                          />
                        ) : (
                          <div className="w-10 h-10 bg-accent rounded-full flex items-center justify-center">
                            <span className="text-sm font-bold text-background">{entry.name[0]}</span>
                          </div>
                        )}
                      </div>
                      <div>
                        <div className="font-semibold text-foreground">{entry.name}</div>
                        <div className="text-xs text-muted-foreground">{entry.rank}</div>
                      </div>
                      <div className="text-sm">
                        <div className="font-bold text-primary">${entry.portfolio.toLocaleString()}</div>
                        <div className="text-xs text-muted-foreground">Level {entry.level}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            {/* Full Leaderboard */}
            <Card className="p-4 bg-card/80 backdrop-blur-sm">
              <div className="space-y-2">
                {leaderboardWithPlayer.map((entry, index) => (
                  <div
                    key={entry.id}
                    className={`flex items-center gap-4 p-4 rounded-lg transition-colors ${
                      entry.isCurrentPlayer
                        ? "bg-primary/20 border border-primary"
                        : "bg-secondary/30 hover:bg-secondary/50"
                    }`}
                  >
                    {/* Rank */}
                    <div className="flex items-center gap-2 min-w-[60px]">
                      <Badge className={getRankBadgeColor(index + 1)}>#{index + 1}</Badge>
                    </div>

                    {/* Avatar */}
                    <div className="flex-shrink-0">
                      {entry.avatar ? (
                        <Image
                          src={entry.avatar || "/placeholder.svg"}
                          alt={entry.name}
                          width={32}
                          height={32}
                          className="rounded-full"
                        />
                      ) : (
                        <div className="w-8 h-8 bg-accent rounded-full flex items-center justify-center">
                          <span className="text-xs font-bold text-background">{entry.name[0]}</span>
                        </div>
                      )}
                    </div>

                    {/* Player Info */}
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-foreground">{entry.name}</span>
                        {entry.isCurrentPlayer && (
                          <Badge variant="outline" className="text-xs border-primary text-primary">
                            You
                          </Badge>
                        )}
                      </div>
                      <div className="text-sm text-muted-foreground">{entry.rank}</div>
                    </div>

                    {/* Stats */}
                    <div className="text-right">
                      <div className="font-bold text-primary">${entry.portfolio.toLocaleString()}</div>
                      <div className="text-sm text-muted-foreground">Level {entry.level}</div>
                    </div>

                    {/* Trend */}
                    <div className="flex-shrink-0">
                      <TrendingUp className="h-4 w-4 text-chart-5" />
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="weekly" className="space-y-4">
            <Card className="p-8 bg-card/80 backdrop-blur-sm text-center">
              <Trophy className="h-16 w-16 text-accent mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-foreground mb-2">Weekly Tournament</h3>
              <p className="text-muted-foreground mb-4">
                Compete with other traders in weekly challenges for exclusive rewards!
              </p>
              <Button className="bg-accent hover:bg-accent/90 text-accent-foreground">Join Tournament</Button>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
