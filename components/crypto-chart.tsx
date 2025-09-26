"use client"

import { useEffect, useState } from "react"
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, Tooltip } from "recharts"

interface ChartData {
  time: string
  price: number
}

interface CryptoChartProps {
  symbol: string
}

export function CryptoChart({ symbol }: CryptoChartProps) {
  const [chartData, setChartData] = useState<ChartData[]>([])

  useEffect(() => {
    // Generate mock chart data
    const generateChartData = () => {
      const data: ChartData[] = []
      let basePrice = symbol === "BTC" ? 45000 : symbol === "ETH" ? 2800 : symbol === "SOL" ? 120 : 1.5

      for (let i = 0; i < 24; i++) {
        const volatility = Math.random() * 0.1 - 0.05 // ±5% volatility
        basePrice = basePrice * (1 + volatility)
        data.push({
          time: `${i}:00`,
          price: basePrice,
        })
      }
      return data
    }

    setChartData(generateChartData())

    const interval = setInterval(() => {
      setChartData((prev) => {
        const newData = [...prev]
        const lastPrice = newData[newData.length - 1].price
        const volatility = Math.random() * 0.02 - 0.01 // ±1% volatility
        newData.shift()
        newData.push({
          time: new Date().toLocaleTimeString(),
          price: lastPrice * (1 + volatility),
        })
        return newData
      })
    }, 2000)

    return () => clearInterval(interval)
  }, [symbol])

  const currentPrice = chartData[chartData.length - 1]?.price || 0
  const previousPrice = chartData[chartData.length - 2]?.price || 0
  const isUp = currentPrice > previousPrice

  return (
    <div className="h-64 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={chartData}>
          <XAxis
            dataKey="time"
            axisLine={false}
            tickLine={false}
            tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }}
          />
          <YAxis
            axisLine={false}
            tickLine={false}
            tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }}
            domain={["dataMin - 100", "dataMax + 100"]}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: "hsl(var(--card))",
              border: "1px solid hsl(var(--border))",
              borderRadius: "8px",
              color: "hsl(var(--foreground))",
            }}
          />
          <Line
            type="monotone"
            dataKey="price"
            stroke={isUp ? "hsl(var(--chart-5))" : "hsl(var(--destructive))"}
            strokeWidth={2}
            dot={false}
            activeDot={{ r: 4, fill: isUp ? "hsl(var(--chart-5))" : "hsl(var(--destructive))" }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}
