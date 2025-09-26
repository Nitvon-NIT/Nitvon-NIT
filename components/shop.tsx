"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useGameState } from "@/lib/game-state"
import { ShoppingBag, Shirt, Zap, TrendingUp, ArrowLeft, Coins, Star } from "lucide-react"
import Image from "next/image"

interface ShopItem {
  id: string
  name: string
  description: string
  price: number
  category: "skins" | "tools" | "currency"
  rarity: "common" | "rare" | "epic" | "legendary"
  image?: string
  owned?: boolean
}

const shopItems: ShopItem[] = [
  {
    id: "hacker-skin",
    name: "Hacker Nitvon",
    description: "Cyberpunk-themed skin with neon green accents and digital effects",
    price: 500,
    category: "skins",
    rarity: "epic",
    image: "/images/nitvon-character.jpeg",
  },
  {
    id: "whale-skin",
    name: "Whale Nitvon",
    description: "Luxurious golden suit for the ultimate crypto whale experience",
    price: 1000,
    category: "skins",
    rarity: "legendary",
  },
  {
    id: "ai-analyzer",
    name: "AI Market Analyzer",
    description: "Advanced AI tool that provides market predictions and trading signals",
    price: 300,
    category: "tools",
    rarity: "rare",
  },
  {
    id: "insider-scanner",
    name: "Insider News Scanner",
    description: "Get exclusive market news 30 seconds before everyone else",
    price: 200,
    category: "tools",
    rarity: "rare",
  },
  {
    id: "coin-pack-small",
    name: "Small Coin Pack",
    description: "100 coins to boost your trading power",
    price: 50,
    category: "currency",
    rarity: "common",
  },
  {
    id: "coin-pack-large",
    name: "Large Coin Pack",
    description: "500 coins for serious traders",
    price: 200,
    category: "currency",
    rarity: "rare",
  },
]

export function Shop() {
  const { setScreen, player, addCoins, updatePlayer } = useGameState()
  const [activeTab, setActiveTab] = useState("skins")
  const [purchasedItems, setPurchasedItems] = useState<string[]>([])

  const getRarityColor = (rarity: ShopItem["rarity"]) => {
    switch (rarity) {
      case "legendary":
        return "bg-yellow-500 text-black"
      case "epic":
        return "bg-purple-500 text-white"
      case "rare":
        return "bg-blue-500 text-white"
      default:
        return "bg-gray-500 text-white"
    }
  }

  const getCategoryIcon = (category: ShopItem["category"]) => {
    switch (category) {
      case "skins":
        return <Shirt className="h-4 w-4" />
      case "tools":
        return <Zap className="h-4 w-4" />
      case "currency":
        return <Coins className="h-4 w-4" />
    }
  }

  const handlePurchase = (item: ShopItem) => {
    if (player.coins >= item.price && !purchasedItems.includes(item.id)) {
      updatePlayer({ coins: player.coins - item.price })
      setPurchasedItems([...purchasedItems, item.id])

      if (item.category === "currency") {
        const coinAmount = item.id === "coin-pack-small" ? 100 : 500
        addCoins(coinAmount)
      }
    }
  }

  const filteredItems = shopItems.filter((item) => item.category === activeTab)

  return (
    <div className="min-h-screen p-4">
      <div className="max-w-6xl mx-auto space-y-6">
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
              <h1 className="text-3xl font-bold text-primary neon-text">Nitvon Shop</h1>
              <p className="text-muted-foreground">Upgrade your trading experience</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <Badge variant="outline" className="border-chart-2 text-chart-2 text-lg px-4 py-2">
              <Coins className="h-4 w-4 mr-2" />
              {player.coins} Coins
            </Badge>
          </div>
        </div>

        {/* Shop Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="skins" className="flex items-center gap-2">
              <Shirt className="h-4 w-4" />
              Skins
            </TabsTrigger>
            <TabsTrigger value="tools" className="flex items-center gap-2">
              <Zap className="h-4 w-4" />
              Tools
            </TabsTrigger>
            <TabsTrigger value="currency" className="flex items-center gap-2">
              <Coins className="h-4 w-4" />
              Currency
            </TabsTrigger>
          </TabsList>

          <TabsContent value={activeTab} className="space-y-4">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredItems.map((item) => {
                const isOwned = purchasedItems.includes(item.id)
                const canAfford = player.coins >= item.price

                return (
                  <Card
                    key={item.id}
                    className="p-6 bg-card/80 backdrop-blur-sm border-border/50 hover:border-accent/50 transition-colors relative overflow-hidden"
                  >
                    {/* Background glow for rarity */}
                    <div
                      className={`absolute inset-0 opacity-5 ${
                        item.rarity === "legendary"
                          ? "bg-yellow-500"
                          : item.rarity === "epic"
                            ? "bg-purple-500"
                            : item.rarity === "rare"
                              ? "bg-blue-500"
                              : "bg-gray-500"
                      }`}
                    />

                    <div className="relative z-10 space-y-4">
                      {/* Item Image */}
                      <div className="flex justify-center">
                        {item.image ? (
                          <Image
                            src={item.image || "/placeholder.svg"}
                            alt={item.name}
                            width={80}
                            height={80}
                            className="rounded-lg glow"
                          />
                        ) : (
                          <div className="w-20 h-20 bg-accent/20 rounded-lg flex items-center justify-center">
                            {getCategoryIcon(item.category)}
                          </div>
                        )}
                      </div>

                      {/* Item Info */}
                      <div className="text-center space-y-2">
                        <div className="flex items-center justify-center gap-2">
                          <h3 className="font-semibold text-foreground">{item.name}</h3>
                          <Badge className={getRarityColor(item.rarity)} size="sm">
                            {item.rarity}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground leading-relaxed">{item.description}</p>
                      </div>

                      {/* Price and Purchase */}
                      <div className="space-y-3">
                        <div className="text-center">
                          <div className="text-2xl font-bold text-chart-2 flex items-center justify-center gap-1">
                            <Coins className="h-5 w-5" />
                            {item.price}
                          </div>
                        </div>

                        <Button
                          onClick={() => handlePurchase(item)}
                          disabled={!canAfford || isOwned}
                          className={`w-full ${
                            isOwned
                              ? "bg-chart-5 hover:bg-chart-5 text-white"
                              : canAfford
                                ? "bg-primary hover:bg-primary/90"
                                : "bg-muted text-muted-foreground"
                          }`}
                        >
                          {isOwned ? (
                            <>
                              <Star className="h-4 w-4 mr-2" />
                              Owned
                            </>
                          ) : canAfford ? (
                            <>
                              <ShoppingBag className="h-4 w-4 mr-2" />
                              Purchase
                            </>
                          ) : (
                            "Insufficient Coins"
                          )}
                        </Button>
                      </div>
                    </div>
                  </Card>
                )
              })}
            </div>
          </TabsContent>
        </Tabs>

        {/* Featured Item */}
        <Card className="p-6 bg-gradient-to-r from-primary/10 via-accent/10 to-primary/10 border-primary/50">
          <div className="text-center space-y-4">
            <Badge className="bg-yellow-500 text-black">Featured</Badge>
            <h3 className="text-xl font-bold text-foreground">Weekly Special</h3>
            <p className="text-muted-foreground">
              Get 20% off all premium skins this week! Limited time offer for legendary traders.
            </p>
            <Button variant="outline" className="border-primary text-primary hover:bg-primary/10 bg-transparent">
              <TrendingUp className="h-4 w-4 mr-2" />
              View Deals
            </Button>
          </div>
        </Card>
      </div>
    </div>
  )
}
