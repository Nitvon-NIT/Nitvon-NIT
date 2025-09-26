"use client"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { useGameState } from "@/lib/game-state"
import Image from "next/image"
import { Rocket, BookOpen } from "lucide-react"

export function CharacterIntro() {
  const { setScreen } = useGameState()

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="max-w-4xl w-full">
        <Card className="p-8 bg-card/80 backdrop-blur-sm border-border/50 relative overflow-hidden">
          {/* Background glow effect */}
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5" />

          <div className="relative z-10 grid md:grid-cols-2 gap-8 items-center">
            {/* Character Image */}
            <div className="flex justify-center">
              <div className="relative">
                <Image
                  src="/images/nitvon-character.jpeg"
                  alt="Nitvon Character"
                  width={300}
                  height={300}
                  className="rounded-lg float glow"
                />
                <div className="absolute -top-2 -right-2 w-4 h-4 bg-neon-green rounded-full pulse-glow" />
              </div>
            </div>

            {/* Character Dialog */}
            <div className="space-y-6">
              <div className="space-y-4">
                <h2 className="text-3xl font-bold text-primary neon-text">Welcome to Cryptonia</h2>
                <div className="bg-secondary/50 p-4 rounded-lg border-l-4 border-accent">
                  <p className="text-lg text-foreground leading-relaxed">
                    "Hey there! I'm Nitvon, your guide through the wild world of crypto trading. Cryptonia is full of
                    opportunities, but also dangers. Are you ready to learn the art of digital trading and become a
                    legendary trader?"
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-3">
                <Button
                  onClick={() => setScreen("dashboard")}
                  size="lg"
                  className="w-full h-14 text-lg font-semibold bg-primary hover:bg-primary/90 text-primary-foreground glow"
                >
                  <Rocket className="mr-3 h-5 w-5" />
                  Start Trading
                </Button>

                <Button
                  onClick={() => setScreen("dashboard")}
                  variant="outline"
                  size="lg"
                  className="w-full h-14 text-lg font-semibold border-accent text-accent hover:bg-accent/10"
                >
                  <BookOpen className="mr-3 h-5 w-5" />
                  Learn Basics (Tutorial)
                </Button>
              </div>

              {/* Quick Stats */}
              <div className="grid grid-cols-3 gap-4 pt-4 border-t border-border/50">
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">$1,000</div>
                  <div className="text-sm text-muted-foreground">Starting Portfolio</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-accent">Level 1</div>
                  <div className="text-sm text-muted-foreground">Rookie Trader</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-chart-2">100</div>
                  <div className="text-sm text-muted-foreground">Coins</div>
                </div>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}
