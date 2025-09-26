"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Slider } from "@/components/ui/slider"
import { Badge } from "@/components/ui/badge"
import { useGameState } from "@/lib/game-state"
import { TrendingUp, TrendingDown, Menu, Gamepad2 } from "lucide-react"
import { NewsPanel } from "./news-panel"
import { NitvonAvatar } from "./nitvon-avatar"
import { ProgressionTracker } from "./progression-tracker"
import { RealTimeCandlestickChart } from "./real-time-candlestick-chart"

interface CryptoData {
  symbol: string
  name: string
  price: number
  change: number
  changePercent: number
  volume: string
  marketCap: string
}

export function TradingDashboard() {
  const { player, setScreen, addXP, addCoins, updatePlayer } = useGameState()
  const [selectedCrypto, setSelectedCrypto] = useState("BTC")
  const [tradeAmount, setTradeAmount] = useState([50])
  const [cryptoData, setCryptoData] = useState<CryptoData[]>([])
  const [nitvonAdvice, setNitvonAdvice] = useState("Welcome to the trading floor! Choose your first trade wisely.")

  useEffect(() => {
    const generateCryptoData = (): CryptoData[] => [
      {
        symbol: "BTC",
        name: "Bitcoin",
        price: 45000 + Math.random() * 10000,
        change: (Math.random() - 0.5) * 2000,
        changePercent: (Math.random() - 0.5) * 10,
        volume: "2.1B",
        marketCap: "850B",
      },
      {
        symbol: "ETH",
        name: "Ethereum",
        price: 2800 + Math.random() * 800,
        change: (Math.random() - 0.5) * 200,
        changePercent: (Math.random() - 0.5) * 8,
        volume: "1.8B",
        marketCap: "340B",
      },
      {
        symbol: "SOL",
        name: "Solana",
        price: 120 + Math.random() * 40,
        change: (Math.random() - 0.5) * 20,
        changePercent: (Math.random() - 0.5) * 15,
        volume: "890M",
        marketCap: "52B",
      },
      {
        symbol: "ADA",
        name: "Cardano",
        price: 0.45 + Math.random() * 0.2,
        change: (Math.random() - 0.5) * 0.1,
        changePercent: (Math.random() - 0.5) * 12,
        volume: "420M",
        marketCap: "15B",
      },
      {
        symbol: "DOT",
        name: "Polkadot",
        price: 6.5 + Math.random() * 2,
        change: (Math.random() - 0.5) * 0.8,
        changePercent: (Math.random() - 0.5) * 14,
        volume: "180M",
        marketCap: "8B",
      },
      {
        symbol: "MATIC",
        name: "Polygon",
        price: 0.85 + Math.random() * 0.3,
        change: (Math.random() - 0.5) * 0.15,
        changePercent: (Math.random() - 0.5) * 16,
        volume: "320M",
        marketCap: "7B",
      },
      {
        symbol: "NITVON",
        name: "Nitvon Token",
        price: 1.5 + Math.random() * 0.5,
        change: (Math.random() - 0.5) * 0.3,
        changePercent: (Math.random() - 0.5) * 20,
        volume: "45M",
        marketCap: "150M",
      },
    ]

    setCryptoData(generateCryptoData())
    const interval = setInterval(() => {
      setCryptoData(generateCryptoData())
    }, 5000)

    return () => clearInterval(interval)
  }, [])

  const selectedCryptoData = cryptoData.find((crypto) => crypto.symbol === selectedCrypto)

  const handleTrade = (type: "buy" | "sell") => {
    if (!selectedCryptoData) return

    const amount = tradeAmount[0]
    const isProfit = Math.random() > 0.4 // 60% chance of profit
    const multiplier = isProfit ? 1 + Math.random() * 0.2 : 1 - Math.random() * 0.15
    const result = amount * multiplier
    const profit = result - amount

    // Update player portfolio
    updatePlayer({ portfolio: player.portfolio + profit })

    // Add XP based on trade success
    const xpGain = isProfit ? Math.floor(profit / 10) + 10 : 5
    addXP(xpGain)

    // Update Nitvon's advice
    if (isProfit) {
      setNitvonAdvice(`Nice trade! You made $${profit.toFixed(2)}. Keep it up!`)
    } else {
      setNitvonAdvice(`Tough break. You lost $${Math.abs(profit).toFixed(2)}. Learn from this!`)
    }

    // Trigger market event or mini-game occasionally
    const random = Math.random()
    if (random < 0.2) {
      setScreen("event")
    } else if (random < 0.3) {
      setScreen("minigame")
    }
  }

  return (
    <div className="min-h-screen p-4 space-y-4">
      {/* Top Bar */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setScreen("menu")}
            className="text-muted-foreground hover:text-foreground"
          >
            <Menu className="h-4 w-4 mr-2" />
            Menu
          </Button>
          <Badge variant="outline" className="border-primary text-primary">
            {player.rank}
          </Badge>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setScreen("minigame")}
            className="border-accent text-accent hover:bg-accent/10"
          >
            <Gamepad2 className="h-4 w-4 mr-2" />
            Mini-Game
          </Button>
        </div>

        <div className="flex items-center gap-6">
          <div className="text-right">
            <div className="text-sm text-muted-foreground">Portfolio</div>
            <div className="text-xl font-bold text-primary">${player.portfolio.toLocaleString()}</div>
          </div>
          <div className="text-right">
            <div className="text-sm text-muted-foreground">Level {player.level}</div>
            <div className="text-sm text-accent">{player.xp} XP</div>
          </div>
          <div className="text-right">
            <div className="text-sm text-muted-foreground">Coins</div>
            <div className="text-lg font-semibold text-chart-2">{player.coins}</div>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-4 gap-4">
        {/* Crypto List */}
        <Card className="p-4 bg-card/80 backdrop-blur-sm">
          <h3 className="font-semibold mb-4 text-foreground">Live Markets</h3>
          <div className="space-y-2">
            {cryptoData.map((crypto) => (
              <button
                key={crypto.symbol}
                onClick={() => setSelectedCrypto(crypto.symbol)}
                className={`w-full p-3 rounded-lg text-left transition-colors ${
                  selectedCrypto === crypto.symbol
                    ? "bg-primary/20 border border-primary"
                    : "bg-secondary/50 hover:bg-secondary/70"
                }`}
              >
                <div className="flex justify-between items-center">
                  <div>
                    <div className="font-semibold text-foreground">{crypto.symbol}</div>
                    <div className="text-xs text-muted-foreground">{crypto.name}</div>
                  </div>
                  <div className="text-right">
                    <div className="font-semibold text-foreground">${crypto.price.toLocaleString()}</div>
                    <div
                      className={`text-xs flex items-center ${
                        crypto.changePercent >= 0 ? "text-chart-5" : "text-destructive"
                      }`}
                    >
                      {crypto.changePercent >= 0 ? (
                        <TrendingUp className="h-3 w-3 mr-1" />
                      ) : (
                        <TrendingDown className="h-3 w-3 mr-1" />
                      )}
                      {crypto.changePercent.toFixed(2)}%
                    </div>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </Card>

        {/* Chart and Trading */}
        <div className="lg:col-span-2 space-y-4">
          <RealTimeCandlestickChart symbol={selectedCrypto} interval="5m" height={350} />

          {/* Trading Panel */}
          <Card className="p-4 bg-card/80 backdrop-blur-sm">
            <h3 className="font-semibold mb-4 text-foreground">Trade {selectedCrypto}</h3>
            <div className="space-y-4">
              <div>
                <label className="text-sm text-muted-foreground mb-2 block">Trade Amount: ${tradeAmount[0]}</label>
                <Slider
                  value={tradeAmount}
                  onValueChange={setTradeAmount}
                  max={Math.min(player.portfolio * 0.5, 1000)}
                  min={10}
                  step={10}
                  className="w-full"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <Button onClick={() => handleTrade("buy")} className="bg-chart-5 hover:bg-chart-5/90 text-white">
                  <TrendingUp className="h-4 w-4 mr-2" />
                  Buy
                </Button>
                <Button onClick={() => handleTrade("sell")} variant="destructive">
                  <TrendingDown className="h-4 w-4 mr-2" />
                  Sell
                </Button>
              </div>
            </div>
          </Card>
        </div>

        {/* Right Panel */}
        <div className="space-y-4">
          {/* Nitvon Avatar */}
          <Card className="p-4 bg-card/80 backdrop-blur-sm">
            <NitvonAvatar advice={nitvonAdvice} />
          </Card>

          {/* Progression Tracker */}
          <ProgressionTracker />

          {/* News Panel */}
          <NewsPanel />
        </div>
      </div>
    </div>
  )
}
