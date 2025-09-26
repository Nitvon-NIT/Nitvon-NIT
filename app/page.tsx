"use client"

import { useGameState } from "@/lib/game-state"
import { GameLayout } from "@/components/game-layout"
import { MainMenu } from "@/components/main-menu"
import { CharacterIntro } from "@/components/character-intro"
import { TradingDashboard } from "@/components/trading-dashboard"
import { MarketEvent } from "@/components/market-event"
import { ScamDetectorGame } from "@/components/scam-detector-game"
import { LevelUpModal } from "@/components/level-up-modal"
import { Leaderboard } from "@/components/leaderboard"
import { Shop } from "@/components/shop"

export default function HomePage() {
  const { currentScreen, showLevelUpModal, setShowLevelUpModal, player } = useGameState()

  const renderScreen = () => {
    switch (currentScreen) {
      case "menu":
        return <MainMenu />
      case "intro":
        return <CharacterIntro />
      case "dashboard":
        return <TradingDashboard />
      case "event":
        return <MarketEvent />
      case "minigame":
        return <ScamDetectorGame />
      case "leaderboard":
        return <Leaderboard />
      case "shop":
        return <Shop />
      default:
        return <MainMenu />
    }
  }

  return (
    <GameLayout>
      {renderScreen()}
      <LevelUpModal
        isOpen={showLevelUpModal}
        onClose={() => setShowLevelUpModal(false)}
        newLevel={player.level}
        newRank={player.rank}
      />
    </GameLayout>
  )
}
