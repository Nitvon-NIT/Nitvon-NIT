"use client"

import type { ReactNode } from "react"

interface GameLayoutProps {
  children: ReactNode
  className?: string
}

export function GameLayout({ children, className = "" }: GameLayoutProps) {
  return (
    <div className={`min-h-screen bg-background text-foreground ${className}`}>
      <div className="relative overflow-hidden">
        {/* Animated background elements */}
        <div className="absolute inset-0 cyber-grid opacity-20" />
        <div className="absolute top-0 left-0 w-full h-full">
          <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-accent rounded-full pulse-glow" />
          <div
            className="absolute top-3/4 right-1/4 w-1 h-1 bg-primary rounded-full pulse-glow"
            style={{ animationDelay: "1s" }}
          />
          <div
            className="absolute top-1/2 left-3/4 w-1.5 h-1.5 bg-chart-2 rounded-full pulse-glow"
            style={{ animationDelay: "2s" }}
          />
        </div>

        {/* Main content */}
        <div className="relative z-10">{children}</div>
      </div>
    </div>
  )
}
