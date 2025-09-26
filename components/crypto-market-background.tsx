"use client"

import { useState, useEffect } from "react"
import { TrendingUp, TrendingDown } from "lucide-react"

interface CryptoTicker {
  symbol: string
  name: string
  price: number
  change: number
  changePercent: number
  volume: string
  marketCap: string
}

export function CryptoMarketBackground() {
  const [cryptoData, setCryptoData] = useState<CryptoTicker[]>([])

  useEffect(() => {
    const generateCryptoData = (): CryptoTicker[] => [
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
        symbol: "LINK",
        name: "Chainlink",
        price: 14.5 + Math.random() * 5,
        change: (Math.random() - 0.5) * 2,
        changePercent: (Math.random() - 0.5) * 12,
        volume: "450M",
        marketCap: "8.2B",
      },
      {
        symbol: "UNI",
        name: "Uniswap",
        price: 8.2 + Math.random() * 3,
        change: (Math.random() - 0.5) * 1.5,
        changePercent: (Math.random() - 0.5) * 18,
        volume: "280M",
        marketCap: "4.9B",
      },
      {
        symbol: "AVAX",
        name: "Avalanche",
        price: 35 + Math.random() * 15,
        change: (Math.random() - 0.5) * 8,
        changePercent: (Math.random() - 0.5) * 20,
        volume: "380M",
        marketCap: "13B",
      },
      {
        symbol: "ATOM",
        name: "Cosmos",
        price: 12 + Math.random() * 5,
        change: (Math.random() - 0.5) * 2,
        changePercent: (Math.random() - 0.5) * 15,
        volume: "150M",
        marketCap: "3.5B",
      },
      {
        symbol: "ALGO",
        name: "Algorand",
        price: 0.25 + Math.random() * 0.15,
        change: (Math.random() - 0.5) * 0.05,
        changePercent: (Math.random() - 0.5) * 22,
        volume: "95M",
        marketCap: "1.8B",
      },
      {
        symbol: "XRP",
        name: "Ripple",
        price: 0.55 + Math.random() * 0.2,
        change: (Math.random() - 0.5) * 0.08,
        changePercent: (Math.random() - 0.5) * 14,
        volume: "1.2B",
        marketCap: "28B",
      },
      {
        symbol: "LTC",
        name: "Litecoin",
        price: 85 + Math.random() * 25,
        change: (Math.random() - 0.5) * 12,
        changePercent: (Math.random() - 0.5) * 16,
        volume: "420M",
        marketCap: "8.1B",
      },
      {
        symbol: "DOGE",
        name: "Dogecoin",
        price: 0.08 + Math.random() * 0.04,
        change: (Math.random() - 0.5) * 0.02,
        changePercent: (Math.random() - 0.5) * 25,
        volume: "680M",
        marketCap: "11B",
      },
      {
        symbol: "SHIB",
        name: "Shiba Inu",
        price: 0.000012 + Math.random() * 0.000008,
        change: (Math.random() - 0.5) * 0.000004,
        changePercent: (Math.random() - 0.5) * 30,
        volume: "320M",
        marketCap: "7.2B",
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
    }, 3000)

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Floating crypto tickers */}
      <div className="absolute inset-0 flex flex-col justify-between py-4">
        {/* Top row - moving right */}
        <div className="flex animate-scroll-right space-x-8 whitespace-nowrap">
          {cryptoData.slice(0, 8).map((crypto, index) => (
            <div
              key={`top-${crypto.symbol}-${index}`}
              className="flex items-center space-x-2 bg-black/20 backdrop-blur-sm rounded-lg px-3 py-2 border border-white/10"
            >
              <span className="font-bold text-white/80 text-sm">{crypto.symbol}</span>
              <span className="text-white/60 text-xs">
                ${crypto.price > 1 ? crypto.price.toFixed(2) : crypto.price.toFixed(6)}
              </span>
              <div
                className={`flex items-center text-xs ${crypto.changePercent >= 0 ? "text-green-400" : "text-red-400"}`}
              >
                {crypto.changePercent >= 0 ? (
                  <TrendingUp className="h-3 w-3 mr-1" />
                ) : (
                  <TrendingDown className="h-3 w-3 mr-1" />
                )}
                {crypto.changePercent.toFixed(2)}%
              </div>
            </div>
          ))}
        </div>

        {/* Middle row - moving left */}
        <div className="flex animate-scroll-left space-x-8 whitespace-nowrap">
          {cryptoData.slice(8, 16).map((crypto, index) => (
            <div
              key={`middle-${crypto.symbol}-${index}`}
              className="flex items-center space-x-2 bg-black/20 backdrop-blur-sm rounded-lg px-3 py-2 border border-white/10"
            >
              <span className="font-bold text-white/80 text-sm">{crypto.symbol}</span>
              <span className="text-white/60 text-xs">
                ${crypto.price > 1 ? crypto.price.toFixed(2) : crypto.price.toFixed(6)}
              </span>
              <div
                className={`flex items-center text-xs ${crypto.changePercent >= 0 ? "text-green-400" : "text-red-400"}`}
              >
                {crypto.changePercent >= 0 ? (
                  <TrendingUp className="h-3 w-3 mr-1" />
                ) : (
                  <TrendingDown className="h-3 w-3 mr-1" />
                )}
                {crypto.changePercent.toFixed(2)}%
              </div>
            </div>
          ))}
        </div>

        {/* Bottom row - moving right */}
        <div className="flex animate-scroll-right-slow space-x-8 whitespace-nowrap">
          {cryptoData.slice(0, 8).map((crypto, index) => (
            <div
              key={`bottom-${crypto.symbol}-${index}`}
              className="flex items-center space-x-2 bg-black/20 backdrop-blur-sm rounded-lg px-3 py-2 border border-white/10"
            >
              <span className="font-bold text-white/80 text-sm">{crypto.symbol}</span>
              <span className="text-white/60 text-xs">Vol: {crypto.volume}</span>
              <span className="text-white/50 text-xs">MC: {crypto.marketCap}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Vertical tickers on sides */}
      <div className="absolute left-4 top-0 bottom-0 flex flex-col justify-center space-y-4">
        <div className="animate-scroll-up space-y-4">
          {cryptoData.slice(0, 6).map((crypto, index) => (
            <div
              key={`left-${crypto.symbol}-${index}`}
              className="bg-black/20 backdrop-blur-sm rounded-lg p-2 border border-white/10 text-center"
            >
              <div className="font-bold text-white/80 text-xs">{crypto.symbol}</div>
              <div className="text-white/60 text-xs">
                ${crypto.price > 1 ? crypto.price.toFixed(2) : crypto.price.toFixed(6)}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="absolute right-4 top-0 bottom-0 flex flex-col justify-center space-y-4">
        <div className="animate-scroll-down space-y-4">
          {cryptoData.slice(6, 12).map((crypto, index) => (
            <div
              key={`right-${crypto.symbol}-${index}`}
              className="bg-black/20 backdrop-blur-sm rounded-lg p-2 border border-white/10 text-center"
            >
              <div className="font-bold text-white/80 text-xs">{crypto.symbol}</div>
              <div className="text-white/60 text-xs">
                ${crypto.price > 1 ? crypto.price.toFixed(2) : crypto.price.toFixed(6)}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
