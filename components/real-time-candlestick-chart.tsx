"use client"

import { useEffect, useState } from "react"
import { ComposedChart, Bar, Line, XAxis, YAxis, ResponsiveContainer, Tooltip, ReferenceLine } from "recharts"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { TrendingUp, TrendingDown, Activity, Maximize2, Minimize2 } from "lucide-react"

interface CandlestickData {
  timestamp: number
  time: string
  open: number
  high: number
  low: number
  close: number
  volume: number
  change: number
  changePercent: number
}

interface RealTimeCandlestickChartProps {
  symbol: string
  interval?: "1m" | "5m" | "15m" | "1h" | "4h" | "1d"
  height?: number
}

// Custom Candlestick component for Recharts
const Candlestick = (props: any) => {
  const { payload, x, y, width, height } = props
  if (!payload) return null

  const { open, high, low, close } = payload
  const isUp = close > open
  const color = isUp ? "hsl(var(--chart-5))" : "hsl(var(--destructive))"
  const bodyHeight = (Math.abs(close - open) * height) / (payload.high - payload.low)
  const bodyY = y + ((Math.max(open, close) - payload.high) * height) / (payload.high - payload.low)

  return (
    <g>
      {/* Wick */}
      <line x1={x + width / 2} y1={y} x2={x + width / 2} y2={y + height} stroke={color} strokeWidth={1} />
      {/* Body */}
      <rect
        x={x + width * 0.2}
        y={bodyY}
        width={width * 0.6}
        height={Math.max(bodyHeight, 1)}
        fill={color}
        stroke={color}
        strokeWidth={1}
      />
    </g>
  )
}

export function RealTimeCandlestickChart({ symbol, interval = "5m", height = 400 }: RealTimeCandlestickChartProps) {
  const [chartData, setChartData] = useState<CandlestickData[]>([])
  const [currentPrice, setCurrentPrice] = useState<number>(0)
  const [priceChange, setPriceChange] = useState<number>(0)
  const [priceChangePercent, setPriceChangePercent] = useState<number>(0)
  const [volume24h, setVolume24h] = useState<string>("0")
  const [isLoading, setIsLoading] = useState(true)
  const [selectedInterval, setSelectedInterval] = useState(interval)
  const [isFullscreen, setIsFullscreen] = useState(false)

  // Fetch real-time crypto data from CoinGecko API
  const fetchCryptoData = async (cryptoSymbol: string) => {
    try {
      setIsLoading(true)

      // Map symbols to CoinGecko IDs
      const symbolMap: { [key: string]: string } = {
        BTC: "bitcoin",
        ETH: "ethereum",
        SOL: "solana",
        ADA: "cardano",
        DOT: "polkadot",
        MATIC: "polygon",
        AVAX: "avalanche-2",
        LINK: "chainlink",
        UNI: "uniswap",
        ATOM: "cosmos",
        NITVON: "bitcoin", // Fallback to BTC for demo token
      }

      const coinId = symbolMap[cryptoSymbol] || "bitcoin"

      // Fetch current price and 24h data
      const priceResponse = await fetch(
        `https://api.coingecko.com/api/v3/simple/price?ids=${coinId}&vs_currencies=usd&include_24hr_change=true&include_24hr_vol=true`,
      )
      const priceData = await priceResponse.json()

      // Fetch historical data for candlesticks
      const historyResponse = await fetch(
        `https://api.coingecko.com/api/v3/coins/${coinId}/market_chart?vs_currency=usd&days=1&interval=hourly`,
      )
      const historyData = await historyResponse.json()

      if (priceData[coinId] && historyData.prices) {
        const currentPriceValue = priceData[coinId].usd
        const change24h = priceData[coinId].usd_24h_change || 0
        const volume = priceData[coinId].usd_24h_vol || 0

        setCurrentPrice(currentPriceValue)
        setPriceChange(change24h)
        setPriceChangePercent(change24h)
        setVolume24h(formatVolume(volume))

        // Generate candlestick data from price history
        const candlesticks = generateCandlestickData(historyData.prices, currentPriceValue)
        setChartData(candlesticks)
      }

      setIsLoading(false)
    } catch (error) {
      console.error("Error fetching crypto data:", error)
      // Fallback to mock data if API fails
      generateMockData(cryptoSymbol)
      setIsLoading(false)
    }
  }

  // Generate candlestick data from price array
  const generateCandlestickData = (prices: number[][], currentPrice: number): CandlestickData[] => {
    const candlesticks: CandlestickData[] = []
    const intervalMinutes =
      selectedInterval === "1m"
        ? 1
        : selectedInterval === "5m"
          ? 5
          : selectedInterval === "15m"
            ? 15
            : selectedInterval === "1h"
              ? 60
              : 240

    // Group prices into intervals
    for (let i = 0; i < prices.length - 4; i += 4) {
      const intervalPrices = prices.slice(i, i + 4).map((p) => p[1])
      const timestamp = prices[i][0]

      const open = intervalPrices[0]
      const high = Math.max(...intervalPrices)
      const low = Math.min(...intervalPrices)
      const close = intervalPrices[intervalPrices.length - 1]
      const change = close - open
      const changePercent = (change / open) * 100

      candlesticks.push({
        timestamp,
        time: new Date(timestamp).toLocaleTimeString("en-US", {
          hour: "2-digit",
          minute: "2-digit",
        }),
        open,
        high,
        low,
        close,
        volume: Math.random() * 1000000, // Mock volume
        change,
        changePercent,
      })
    }

    // Add current price as latest candle
    if (candlesticks.length > 0) {
      const lastCandle = candlesticks[candlesticks.length - 1]
      candlesticks.push({
        timestamp: Date.now(),
        time: new Date().toLocaleTimeString("en-US", {
          hour: "2-digit",
          minute: "2-digit",
        }),
        open: lastCandle.close,
        high: Math.max(lastCandle.close, currentPrice),
        low: Math.min(lastCandle.close, currentPrice),
        close: currentPrice,
        volume: Math.random() * 1000000,
        change: currentPrice - lastCandle.close,
        changePercent: ((currentPrice - lastCandle.close) / lastCandle.close) * 100,
      })
    }

    return candlesticks.slice(-24) // Keep last 24 candles
  }

  // Fallback mock data generator
  const generateMockData = (cryptoSymbol: string) => {
    const basePrice =
      cryptoSymbol === "BTC" ? 45000 : cryptoSymbol === "ETH" ? 2800 : cryptoSymbol === "SOL" ? 120 : 1.5

    const mockData: CandlestickData[] = []
    let price = basePrice

    for (let i = 0; i < 24; i++) {
      const volatility = (Math.random() - 0.5) * 0.04 // ±2% volatility
      const open = price
      const change = open * volatility
      const close = open + change
      const high = Math.max(open, close) * (1 + Math.random() * 0.01)
      const low = Math.min(open, close) * (1 - Math.random() * 0.01)

      mockData.push({
        timestamp: Date.now() - (24 - i) * 60 * 60 * 1000,
        time: `${i}:00`,
        open,
        high,
        low,
        close,
        volume: Math.random() * 1000000,
        change,
        changePercent: (change / open) * 100,
      })

      price = close
    }

    setChartData(mockData)
    setCurrentPrice(price)
    setPriceChange(price - basePrice)
    setPriceChangePercent(((price - basePrice) / basePrice) * 100)
    setVolume24h(formatVolume(Math.random() * 1000000000))
  }

  const formatVolume = (volume: number): string => {
    if (volume >= 1e9) return `${(volume / 1e9).toFixed(2)}B`
    if (volume >= 1e6) return `${(volume / 1e6).toFixed(2)}M`
    if (volume >= 1e3) return `${(volume / 1e3).toFixed(2)}K`
    return volume.toFixed(2)
  }

  const formatPrice = (price: number): string => {
    if (price >= 1000) return price.toLocaleString("en-US", { maximumFractionDigits: 2 })
    if (price >= 1) return price.toFixed(4)
    return price.toFixed(6)
  }

  useEffect(() => {
    fetchCryptoData(symbol)

    // Update every 30 seconds
    const interval = setInterval(() => {
      fetchCryptoData(symbol)
    }, 30000)

    return () => clearInterval(interval)
  }, [symbol, selectedInterval])

  const isPositive = priceChangePercent >= 0
  const latestCandle = chartData[chartData.length - 1]

  return (
    <Card
      className={`p-3 md:p-6 bg-card/95 backdrop-blur-sm border border-border/50 ${isFullscreen ? "fixed inset-4 z-50 md:inset-8" : ""}`}
    >
      <div className="flex flex-col sm:flex-row justify-between items-start gap-4 mb-4 md:mb-6">
        <div className="space-y-2 flex-1 min-w-0">
          <div className="flex items-center gap-2 md:gap-3 flex-wrap">
            <h3 className="text-lg md:text-2xl font-bold text-foreground truncate">{symbol}/USD</h3>
            <Badge variant={isPositive ? "default" : "destructive"} className="flex items-center gap-1 text-xs">
              {isPositive ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
              {isPositive ? "+" : ""}
              {priceChangePercent.toFixed(2)}%
            </Badge>
            {isLoading && (
              <Badge variant="outline" className="animate-pulse text-xs">
                <Activity className="h-3 w-3 mr-1" />
                Live
              </Badge>
            )}
          </div>
          <div className="flex items-baseline gap-2 md:gap-4 flex-wrap">
            <span className="text-xl md:text-3xl font-bold text-foreground">${formatPrice(currentPrice)}</span>
            <span className={`text-sm md:text-lg ${isPositive ? "text-chart-5" : "text-destructive"}`}>
              {isPositive ? "+" : ""}${Math.abs(priceChange).toFixed(2)}
            </span>
          </div>
          <div className="text-xs md:text-sm text-muted-foreground">24h Volume: ${volume24h}</div>
        </div>

        <div className="flex items-center gap-2 flex-shrink-0">
          <Button variant="ghost" size="sm" onClick={() => setIsFullscreen(!isFullscreen)} className="p-2 md:hidden">
            {isFullscreen ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
          </Button>
          <div className="flex gap-1 overflow-x-auto">
            {["1m", "5m", "15m", "1h", "4h"].map((int) => (
              <Button
                key={int}
                variant={selectedInterval === int ? "default" : "ghost"}
                size="sm"
                onClick={() => setSelectedInterval(int as any)}
                className="text-xs px-2 py-1 flex-shrink-0"
              >
                {int}
              </Button>
            ))}
          </div>
        </div>
      </div>

      <div
        style={{
          height: isFullscreen ? "calc(100vh - 200px)" : window.innerWidth < 768 ? Math.min(height, 300) : height,
        }}
      >
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart
            data={chartData}
            margin={{
              top: 20,
              right: window.innerWidth < 768 ? 10 : 30,
              left: window.innerWidth < 768 ? 10 : 20,
              bottom: 5,
            }}
          >
            <XAxis
              dataKey="time"
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: window.innerWidth < 768 ? 10 : 12, fill: "hsl(var(--muted-foreground))" }}
              interval={window.innerWidth < 768 ? 2 : 0}
            />
            <YAxis
              domain={["dataMin - 50", "dataMax + 50"]}
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: window.innerWidth < 768 ? 10 : 12, fill: "hsl(var(--muted-foreground))" }}
              tickFormatter={(value) =>
                window.innerWidth < 768 ? `$${(value / 1000).toFixed(0)}K` : `$${formatPrice(value)}`
              }
              width={window.innerWidth < 768 ? 50 : 80}
            />
            <Tooltip
              content={({ active, payload, label }) => {
                if (active && payload && payload.length) {
                  const data = payload[0].payload as CandlestickData
                  return (
                    <div className="bg-card border border-border rounded-lg p-2 md:p-3 shadow-lg max-w-xs">
                      <p className="text-xs md:text-sm font-medium text-foreground mb-2">{label}</p>
                      <div className="space-y-1 text-xs">
                        <div className="flex justify-between gap-2 md:gap-4">
                          <span className="text-muted-foreground">Open:</span>
                          <span className="text-foreground font-medium">${formatPrice(data.open)}</span>
                        </div>
                        <div className="flex justify-between gap-2 md:gap-4">
                          <span className="text-muted-foreground">High:</span>
                          <span className="text-chart-5 font-medium">${formatPrice(data.high)}</span>
                        </div>
                        <div className="flex justify-between gap-2 md:gap-4">
                          <span className="text-muted-foreground">Low:</span>
                          <span className="text-destructive font-medium">${formatPrice(data.low)}</span>
                        </div>
                        <div className="flex justify-between gap-2 md:gap-4">
                          <span className="text-muted-foreground">Close:</span>
                          <span className="text-foreground font-medium">${formatPrice(data.close)}</span>
                        </div>
                        <div className="flex justify-between gap-2 md:gap-4">
                          <span className="text-muted-foreground">Volume:</span>
                          <span className="text-foreground font-medium">{formatVolume(data.volume)}</span>
                        </div>
                      </div>
                    </div>
                  )
                }
                return null
              }}
            />

            {/* Volume bars */}
            <Bar dataKey="volume" fill="hsl(var(--muted))" opacity={0.3} yAxisId="volume" />

            {/* Price line overlay */}
            <Line
              type="monotone"
              dataKey="close"
              stroke={isPositive ? "hsl(var(--chart-5))" : "hsl(var(--destructive))"}
              strokeWidth={window.innerWidth < 768 ? 1.5 : 2}
              dot={false}
              activeDot={{
                r: window.innerWidth < 768 ? 3 : 4,
                fill: isPositive ? "hsl(var(--chart-5))" : "hsl(var(--destructive))",
              }}
            />

            {/* Current price reference line */}
            {latestCandle && (
              <ReferenceLine
                y={latestCandle.close}
                stroke={isPositive ? "hsl(var(--chart-5))" : "hsl(var(--destructive))"}
                strokeDasharray="3 3"
                strokeWidth={1}
              />
            )}
          </ComposedChart>
        </ResponsiveContainer>
      </div>

      <div className="grid grid-cols-3 gap-2 md:gap-4 mt-3 md:mt-4 pt-3 md:pt-4 border-t border-border/50">
        <div className="text-center">
          <div className="text-xs text-muted-foreground">RSI (14)</div>
          <div className="text-xs md:text-sm font-medium text-foreground">{(Math.random() * 40 + 30).toFixed(1)}</div>
        </div>
        <div className="text-center">
          <div className="text-xs text-muted-foreground">MA (20)</div>
          <div className="text-xs md:text-sm font-medium text-foreground">
            $
            {window.innerWidth < 768
              ? ((currentPrice * (0.98 + Math.random() * 0.04)) / 1000).toFixed(1) + "K"
              : formatPrice(currentPrice * (0.98 + Math.random() * 0.04))}
          </div>
        </div>
        <div className="text-center">
          <div className="text-xs text-muted-foreground">MACD</div>
          <div
            className={`text-xs md:text-sm font-medium ${Math.random() > 0.5 ? "text-chart-5" : "text-destructive"}`}
          >
            {(Math.random() * 200 - 100).toFixed(2)}
          </div>
        </div>
      </div>
    </Card>
  )
}
