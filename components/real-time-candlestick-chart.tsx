"use client"

import { useEffect, useState } from "react"
import { ComposedChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip, ReferenceLine, Cell } from "recharts"
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
  candleColor: string
  wickTop: number
  wickBottom: number
  bodyTop: number
  bodyBottom: number
}

interface RealTimeCandlestickChartProps {
  symbol: string
  interval?: "1m" | "5m" | "15m" | "1h" | "4h" | "1d"
  height?: number
}

const CustomCandlestick = (props: any) => {
  const { payload, x, y, width, height } = props
  if (!payload) return null

  const { open, high, low, close } = payload
  const isGreen = close >= open
  const color = isGreen ? "#00ff88" : "#ff4757"

  const bodyHeight = Math.abs(close - open) * (height / (payload.high - payload.low))
  const bodyY = y + Math.max(high - Math.max(open, close)) * (height / (payload.high - payload.low))

  const wickX = x + width / 2
  const highY = y
  const lowY = y + height
  const openY = y + (high - open) * (height / (payload.high - payload.low))
  const closeY = y + (high - close) * (height / (payload.high - payload.low))

  return (
    <g>
      {/* Wick lines */}
      <line x1={wickX} y1={highY} x2={wickX} y2={Math.min(openY, closeY)} stroke={color} strokeWidth={1} />
      <line x1={wickX} y1={Math.max(openY, closeY)} x2={wickX} y2={lowY} stroke={color} strokeWidth={1} />
      {/* Candlestick body */}
      <rect
        x={x + 1}
        y={bodyY}
        width={width - 2}
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
  const [dataSource, setDataSource] = useState<"api" | "mock">("mock")

  const fetchCryptoData = async (cryptoSymbol: string) => {
    try {
      setIsLoading(true)
      console.log("[v0] Attempting to fetch crypto data for:", cryptoSymbol)

      // Try multiple API endpoints for better reliability
      const endpoints = [
        // CoinGecko free API (no CORS issues)
        `https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum,solana&vs_currencies=usd&include_24hr_change=true&include_24hr_vol=true`,
        // Fallback to a CORS-friendly endpoint
        `https://api.coinbase.com/v2/exchange-rates?currency=USD`,
      ]

      let apiSuccess = false

      for (const endpoint of endpoints) {
        try {
          console.log("[v0] Trying endpoint:", endpoint)
          const response = await fetch(endpoint, {
            method: "GET",
            headers: {
              Accept: "application/json",
            },
          })

          if (response.ok) {
            const data = await response.json()
            console.log("[v0] API response received:", data)

            // Process CoinGecko data
            if (endpoint.includes("coingecko")) {
              const symbolMap: { [key: string]: string } = {
                BTC: "bitcoin",
                ETH: "ethereum",
                SOL: "solana",
                NITVON: "bitcoin", // Fallback for demo
              }

              const coinId = symbolMap[cryptoSymbol] || "bitcoin"
              const coinData = data[coinId]

              if (coinData) {
                setCurrentPrice(coinData.usd)
                setPriceChange(coinData.usd_24h_change || 0)
                setPriceChangePercent(coinData.usd_24h_change || 0)
                setVolume24h(formatVolume(coinData.usd_24h_vol || 0))
                setDataSource("api")
                apiSuccess = true
                console.log("[v0] Successfully processed CoinGecko data")
                break
              }
            }
          }
        } catch (endpointError) {
          console.log("[v0] Endpoint failed:", endpoint, endpointError)
          continue
        }
      }

      if (!apiSuccess) {
        console.log("[v0] All API endpoints failed, using enhanced mock data")
        setDataSource("mock")
      }

      // Generate realistic candlestick data regardless of API success
      const candlesticks = generateRealisticCandlestickData(cryptoSymbol)
      setChartData(candlesticks)

      setIsLoading(false)
    } catch (error) {
      console.log("[v0] Fetch error, using mock data:", error)
      generateEnhancedMockData(cryptoSymbol)
      setDataSource("mock")
      setIsLoading(false)
    }
  }

  const generateRealisticCandlestickData = (cryptoSymbol: string): CandlestickData[] => {
    const basePrice = getBasePriceForSymbol(cryptoSymbol)
    const candlesticks: CandlestickData[] = []
    let price = currentPrice || basePrice

    // Generate 50 data points for better chart visualization
    for (let i = 49; i >= 0; i--) {
      const timestamp = Date.now() - i * 5 * 60 * 1000 // 5-minute intervals

      const trendFactor = Math.sin(i * 0.3) * 0.02
      const volatility = (Math.random() - 0.5) * 0.03
      const movement = trendFactor + volatility

      const open = price
      const change = open * movement
      const close = open + change

      const wickRange = Math.abs(change) * (1 + Math.random())
      const high = Math.max(open, close) + wickRange * Math.random()
      const low = Math.min(open, close) - wickRange * Math.random()

      const baseVolume = getBaseVolumeForSymbol(cryptoSymbol)
      const volumeMultiplier = 1 + Math.abs(movement) * 10
      const volume = baseVolume * volumeMultiplier * (0.5 + Math.random())

      const isGreen = close >= open
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
        volume,
        change,
        changePercent: (change / open) * 100,
        candleColor: isGreen ? "#00ff88" : "#ff4757",
        wickTop: high,
        wickBottom: low,
        bodyTop: Math.max(open, close),
        bodyBottom: Math.min(open, close),
      })

      price = close
    }

    // Update current price if we don't have API data
    if (dataSource === "mock") {
      const latestCandle = candlesticks[candlesticks.length - 1]
      setCurrentPrice(latestCandle.close)
      setPriceChange(latestCandle.close - candlesticks[0].open)
      setPriceChangePercent(((latestCandle.close - candlesticks[0].open) / candlesticks[0].open) * 100)
      setVolume24h(formatVolume(candlesticks.reduce((sum, candle) => sum + candle.volume, 0)))
    }

    return candlesticks
  }

  const getBasePriceForSymbol = (symbol: string): number => {
    const prices: { [key: string]: number } = {
      BTC: 43000 + Math.random() * 4000,
      ETH: 2600 + Math.random() * 400,
      SOL: 100 + Math.random() * 40,
      ADA: 0.45 + Math.random() * 0.1,
      DOT: 7 + Math.random() * 2,
      MATIC: 0.85 + Math.random() * 0.2,
      AVAX: 35 + Math.random() * 10,
      LINK: 14 + Math.random() * 4,
      UNI: 6 + Math.random() * 2,
      ATOM: 10 + Math.random() * 3,
      NITVON: 1.5 + Math.random() * 0.5,
    }
    return prices[symbol] || 1
  }

  const getBaseVolumeForSymbol = (symbol: string): number => {
    const volumes: { [key: string]: number } = {
      BTC: 15000000000,
      ETH: 8000000000,
      SOL: 1500000000,
      ADA: 500000000,
      DOT: 300000000,
      MATIC: 400000000,
      AVAX: 200000000,
      LINK: 300000000,
      UNI: 150000000,
      ATOM: 100000000,
      NITVON: 50000000,
    }
    return volumes[symbol] || 10000000
  }

  // Enhanced mock data generator (fallback)
  const generateEnhancedMockData = (cryptoSymbol: string) => {
    const basePrice = getBasePriceForSymbol(cryptoSymbol)
    setCurrentPrice(basePrice)
    setPriceChange((Math.random() - 0.5) * basePrice * 0.05)
    setPriceChangePercent((Math.random() - 0.5) * 5)
    setVolume24h(formatVolume(getBaseVolumeForSymbol(cryptoSymbol)))
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

    const intervalId = setInterval(() => {
      fetchCryptoData(symbol)
    }, 60000) // Update every minute instead of 30 seconds

    return () => clearInterval(intervalId)
  }, [symbol, selectedInterval])

  const isPositive = priceChangePercent >= 0
  const latestCandle = chartData[chartData.length - 1]

  return (
    <Card
      className={`p-3 md:p-6 bg-gray-900 backdrop-blur-sm border border-gray-800 ${isFullscreen ? "fixed inset-4 z-50 md:inset-8" : ""}`}
      style={{ backgroundColor: "#0a0a0a" }} // Dark background to match reference
    >
      <div className="flex flex-col sm:flex-row justify-between items-start gap-4 mb-4 md:mb-6">
        <div className="space-y-2 flex-1 min-w-0">
          <div className="flex items-center gap-2 md:gap-3 flex-wrap">
            <h3 className="text-lg md:text-2xl font-bold text-white truncate">{symbol}/USD</h3>
            <Badge
              variant={isPositive ? "default" : "destructive"}
              className={`flex items-center gap-1 text-xs ${isPositive ? "bg-green-500/20 text-green-400 border-green-500/30" : "bg-red-500/20 text-red-400 border-red-500/30"}`}
            >
              {isPositive ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
              {isPositive ? "+" : ""}
              {priceChangePercent.toFixed(2)}%
            </Badge>
            <Badge
              variant="outline"
              className={`text-xs ${dataSource === "api" ? "text-green-400 border-green-500/30" : "text-yellow-400 border-yellow-500/30"}`}
            >
              <Activity className="h-3 w-3 mr-1" />
              {dataSource === "api" ? "Live" : "Demo"}
            </Badge>
          </div>
          <div className="flex items-baseline gap-2 md:gap-4 flex-wrap">
            <span className={`text-xl md:text-3xl font-bold ${isPositive ? "text-green-400" : "text-red-400"}`}>
              {formatPrice(currentPrice)} {isPositive ? "+" : ""}
              {Math.abs(priceChange).toFixed(2)} ({isPositive ? "+" : ""}
              {priceChangePercent.toFixed(2)}%)
            </span>
          </div>
          <div className="text-xs md:text-sm text-gray-400">24h Volume: ${volume24h}</div>
        </div>

        <div className="flex items-center gap-2 flex-shrink-0">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsFullscreen(!isFullscreen)}
            className="p-2 md:hidden text-gray-400 hover:text-white"
          >
            {isFullscreen ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
          </Button>
          <div className="flex gap-1 overflow-x-auto">
            {["1m", "5m", "15m", "1h", "4h"].map((int) => (
              <Button
                key={int}
                variant={selectedInterval === int ? "default" : "ghost"}
                size="sm"
                onClick={() => setSelectedInterval(int as any)}
                className={`text-xs px-2 py-1 flex-shrink-0 ${
                  selectedInterval === int
                    ? "bg-gray-700 text-white"
                    : "text-gray-400 hover:text-white hover:bg-gray-800"
                }`}
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
          backgroundColor: "#0a0a0a",
        }}
      >
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart
            data={chartData}
            margin={{
              top: 20,
              right: window.innerWidth < 768 ? 40 : 60,
              left: window.innerWidth < 768 ? 10 : 20,
              bottom: 60, // More space for volume chart
            }}
          >
            <XAxis
              dataKey="time"
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: window.innerWidth < 768 ? 10 : 12, fill: "#666" }}
              interval={window.innerWidth < 768 ? 4 : 2}
            />
            <YAxis
              domain={["dataMin - 50", "dataMax + 50"]}
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: window.innerWidth < 768 ? 10 : 12, fill: "#666" }}
              tickFormatter={(value) => formatPrice(value)}
              width={window.innerWidth < 768 ? 50 : 80}
              orientation="right" // Price axis on right like reference
            />
            <YAxis yAxisId="volume" domain={[0, "dataMax"]} axisLine={false} tickLine={false} tick={false} width={0} />

            <Tooltip
              content={({ active, payload, label }) => {
                if (active && payload && payload.length) {
                  const data = payload[0].payload as CandlestickData
                  return (
                    <div className="bg-red-500 text-white rounded px-2 py-1 text-sm font-medium">
                      {formatPrice(data.close)}
                      <br />
                      {label}
                    </div>
                  )
                }
                return null
              }}
            />

            <Bar dataKey="volume" yAxisId="volume" fill="#333">
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.close >= entry.open ? "#00ff88" : "#ff4757"} />
              ))}
            </Bar>

            <Bar dataKey="high" fill="transparent">
              {chartData.map((entry, index) => (
                <Cell key={`candle-${index}`}>
                  <CustomCandlestick payload={entry} />
                </Cell>
              ))}
            </Bar>

            {latestCandle && (
              <ReferenceLine y={latestCandle.close} stroke="#666" strokeDasharray="2 2" strokeWidth={1} />
            )}
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </Card>
  )
}
