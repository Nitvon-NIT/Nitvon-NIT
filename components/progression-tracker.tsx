"use client"

import { Card } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { useGameState } from "@/lib/game-state"
import { Trophy, Star, Target } from "lucide-react"

export function ProgressionTracker() {
  const { player } = useGameState()

  const xpToNextLevel = player.level * 100 - player.xp
  const progressPercent = player.xp % 100

  const achievements = [
    { id: "first-trade", name: "First Trade", completed: player.xp > 0, icon: <Target className="h-4 w-4" /> },
    { id: "level-5", name: "Level 5", completed: player.level >= 5, icon: <Star className="h-4 w-4" /> },
    {
      id: "whale-status",
      name: "Whale Status",
      completed: player.rank === "Whale",
      icon: <Trophy className="h-4 w-4" />,
    },
  ]

  return (
    <Card className="p-4 bg-card/80 backdrop-blur-sm">
      <h3 className="font-semibold mb-4 text-foreground">Progression</h3>

      <div className="space-y-4">
        {/* Level Progress */}
        <div>
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm text-muted-foreground">Level {player.level}</span>
            <span className="text-sm text-muted-foreground">{xpToNextLevel} XP to next level</span>
          </div>
          <Progress value={progressPercent} className="h-2" />
        </div>

        {/* Current Rank */}
        <div className="text-center">
          <Badge variant="outline" className="border-primary text-primary">
            {player.rank}
          </Badge>
        </div>

        {/* Achievements */}
        <div>
          <h4 className="text-sm font-semibold text-foreground mb-2">Achievements</h4>
          <div className="space-y-2">
            {achievements.map((achievement) => (
              <div
                key={achievement.id}
                className={`flex items-center gap-2 p-2 rounded ${
                  achievement.completed ? "bg-primary/20 text-primary" : "bg-secondary/30 text-muted-foreground"
                }`}
              >
                {achievement.icon}
                <span className="text-sm">{achievement.name}</span>
                {achievement.completed && <Star className="h-3 w-3 ml-auto" />}
              </div>
            ))}
          </div>
        </div>
      </div>
    </Card>
  )
}
