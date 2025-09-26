"use client"

import Image from "next/image"

interface NitvonAvatarProps {
  advice: string
}

export function NitvonAvatar({ advice }: NitvonAvatarProps) {
  return (
    <div className="space-y-3">
      <div className="flex items-center gap-3">
        <div className="relative">
          <Image src="/images/nitvon-logo.png" alt="Nitvon" width={48} height={48} className="rounded-full glow" />
          <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-chart-5 rounded-full pulse-glow" />
        </div>
        <div>
          <h4 className="font-semibold text-foreground">Nitvon</h4>
          <p className="text-xs text-muted-foreground">Your Trading Guide</p>
        </div>
      </div>

      <div className="bg-secondary/50 p-3 rounded-lg border-l-4 border-accent">
        <p className="text-sm text-foreground leading-relaxed">"{advice}"</p>
      </div>
    </div>
  )
}
