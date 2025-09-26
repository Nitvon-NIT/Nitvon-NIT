"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { AlertTriangle, TrendingUp, Zap, Shield } from "lucide-react"

interface NewsItem {
  id: string
  headline: string
  type: "positive" | "negative" | "neutral" | "warning"
  impact: "high" | "medium" | "low"
  timestamp: string
}

export function NewsPanel() {
  const [news, setNews] = useState<NewsItem[]>([])

  useEffect(() => {
    const newsTemplates = [
      { headline: "Major exchange lists new altcoin!", type: "positive" as const, impact: "high" as const },
      { headline: "Regulatory clarity boosts market confidence", type: "positive" as const, impact: "medium" as const },
      { headline: "Whale moves 10,000 BTC to unknown wallet", type: "neutral" as const, impact: "medium" as const },
      { headline: "DeFi protocol suffers $50M exploit", type: "negative" as const, impact: "high" as const },
      { headline: "Celebrity endorses new meme coin", type: "warning" as const, impact: "low" as const },
      { headline: "Institutional adoption reaches new high", type: "positive" as const, impact: "high" as const },
      { headline: "Network congestion causes high fees", type: "negative" as const, impact: "medium" as const },
      { headline: "New staking rewards program launched", type: "positive" as const, impact: "low" as const },
    ]

    const generateNews = () => {
      const shuffled = [...newsTemplates].sort(() => Math.random() - 0.5)
      return shuffled.slice(0, 5).map((template, index) => ({
        id: `news-${Date.now()}-${index}`,
        ...template,
        timestamp: new Date(Date.now() - Math.random() * 3600000).toLocaleTimeString(),
      }))
    }

    setNews(generateNews())

    const interval = setInterval(() => {
      setNews((prev) => {
        const newItem = newsTemplates[Math.floor(Math.random() * newsTemplates.length)]
        const newsItem = {
          id: `news-${Date.now()}`,
          ...newItem,
          timestamp: new Date().toLocaleTimeString(),
        }
        return [newsItem, ...prev.slice(0, 4)]
      })
    }, 10000)

    return () => clearInterval(interval)
  }, [])

  const getIcon = (type: NewsItem["type"]) => {
    switch (type) {
      case "positive":
        return <TrendingUp className="h-4 w-4 text-chart-5" />
      case "negative":
        return <AlertTriangle className="h-4 w-4 text-destructive" />
      case "warning":
        return <Shield className="h-4 w-4 text-yellow-500" />
      default:
        return <Zap className="h-4 w-4 text-accent" />
    }
  }

  const getBadgeVariant = (impact: NewsItem["impact"]) => {
    switch (impact) {
      case "high":
        return "destructive"
      case "medium":
        return "secondary"
      default:
        return "outline"
    }
  }

  return (
    <Card className="p-4 bg-card/80 backdrop-blur-sm">
      <h3 className="font-semibold mb-4 text-foreground">Market News</h3>
      <div className="space-y-3 max-h-80 overflow-y-auto">
        {news.map((item) => (
          <div
            key={item.id}
            className="p-3 rounded-lg bg-secondary/30 border border-border/50 hover:bg-secondary/50 transition-colors"
          >
            <div className="flex items-start gap-2 mb-2">
              {getIcon(item.type)}
              <div className="flex-1">
                <p className="text-sm text-foreground leading-relaxed">{item.headline}</p>
              </div>
            </div>
            <div className="flex justify-between items-center">
              <Badge variant={getBadgeVariant(item.impact)} className="text-xs">
                {item.impact} impact
              </Badge>
              <span className="text-xs text-muted-foreground">{item.timestamp}</span>
            </div>
          </div>
        ))}
      </div>
    </Card>
  )
}
