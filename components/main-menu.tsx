"use client"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { useGameState } from "@/lib/game-state"
import Image from "next/image"
import { Play, Trophy, Settings, ExternalLink, ShoppingBag } from "lucide-react"

export function MainMenu() {
  const { setScreen, startGame } = useGameState()

  const handleStartGame = () => {
    startGame()
  }

  const socialLinks = [
    { name: "X/Twitter", url: "https://twitter.com/nitvon", icon: "𝕏" },
    { name: "Telegram", url: "https://t.me/Nitvon1", icon: "📱" },
    { name: "Instagram", url: "https://instagram.com/nitvon.io", icon: "📷" },
    { name: "Facebook", url: "https://facebook.com/nitvon", icon: "📘" },
  ]

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 relative">
      {/* Background cityscape effect */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-background/95 to-background/90" />
      <div className="absolute bottom-0 left-0 right-0 h-1/3 bg-gradient-to-t from-primary/10 to-transparent" />

      {/* Floating particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-accent rounded-full pulse-glow"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${2 + Math.random() * 2}s`,
            }}
          />
        ))}
      </div>

      <div className="relative z-10 max-w-4xl w-full text-center space-y-8">
        {/* Logo and Title */}
        <div className="space-y-6">
          <div className="flex justify-center">
            <div className="relative">
              <Image src="/images/nitvon-logo.png" alt="Nitvon Logo" width={120} height={120} className="float glow" />
            </div>
          </div>

          <div className="space-y-4">
            <h1 className="text-6xl md:text-8xl font-bold neon-text text-primary">NITVON</h1>
            <h2 className="text-2xl md:text-3xl font-semibold text-accent">The Crypto Quest</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto text-balance">
              Master cryptocurrency trading in the futuristic digital city of Cryptonia. Guide Nitvon through market
              volatility, avoid scams, and become a legendary trader.
            </p>
          </div>
        </div>

        {/* Main Menu Buttons */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl mx-auto">
          <Button
            onClick={handleStartGame}
            size="lg"
            className="h-16 text-xl font-semibold bg-primary hover:bg-primary/90 text-primary-foreground glow group"
          >
            <Play className="mr-3 h-6 w-6 group-hover:scale-110 transition-transform" />
            Start Game
          </Button>

          <Button
            onClick={() => setScreen("leaderboard")}
            variant="outline"
            size="lg"
            className="h-16 text-xl font-semibold border-accent text-accent hover:bg-accent/10"
          >
            <Trophy className="mr-3 h-6 w-6" />
            Leaderboards
          </Button>

          <Button
            onClick={() => setScreen("shop")}
            variant="outline"
            size="lg"
            className="h-16 text-xl font-semibold border-chart-2 text-chart-2 hover:bg-chart-2/10"
          >
            <ShoppingBag className="mr-3 h-6 w-6" />
            Shop
          </Button>

          <Button
            variant="outline"
            size="lg"
            className="h-16 text-xl font-semibold border-muted-foreground text-muted-foreground hover:bg-muted/10 bg-transparent"
          >
            <Settings className="mr-3 h-6 w-6" />
            Settings
          </Button>
        </div>

        {/* Community Links */}
        <Card className="p-6 bg-card/50 backdrop-blur-sm border-border/50">
          <h3 className="text-xl font-semibold mb-4 text-foreground">Join the Community</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {socialLinks.map((link) => (
              <Button
                key={link.name}
                variant="ghost"
                size="sm"
                className="h-12 flex-col gap-1 hover:bg-accent/10 hover:text-accent transition-colors"
                onClick={() => window.open(link.url, "_blank")}
              >
                <span className="text-lg">{link.icon}</span>
                <span className="text-xs">{link.name}</span>
                <ExternalLink className="h-3 w-3 opacity-50" />
              </Button>
            ))}
          </div>
        </Card>

        {/* Settings */}
        <div className="flex justify-center">
          <Button
            variant="ghost"
            size="sm"
            className="text-muted-foreground hover:text-foreground"
            onClick={() => setScreen("menu")}
          >
            <Settings className="mr-2 h-4 w-4" />
            Settings
          </Button>
        </div>
      </div>

      {/* Version info */}
      <div className="absolute bottom-4 right-4 text-xs text-muted-foreground">v1.0.0 Alpha</div>
    </div>
  )
}
