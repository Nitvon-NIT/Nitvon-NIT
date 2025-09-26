"use client"

import { create } from "zustand"
import { persist } from "zustand/middleware"

export interface Player {
  name: string
  level: number
  xp: number
  rank: string
  portfolio: number
  coins: number
  totalTrades: number
  successfulTrades: number
  achievements: string[]
}

export interface Trade {
  id: string
  symbol: string
  type: "buy" | "sell"
  amount: number
  price: number
  timestamp: Date
  profit?: number
}

export interface Achievement {
  id: string
  name: string
  description: string
  icon: string
  unlocked: boolean
  unlockedAt?: Date
}

export interface GameSettings {
  soundEnabled: boolean
  musicEnabled: boolean
  notifications: boolean
  difficulty: "easy" | "medium" | "hard"
  theme: "dark" | "light" | "auto"
}

export interface GameState {
  currentScreen:
    | "menu"
    | "intro"
    | "dashboard"
    | "event"
    | "minigame"
    | "leaderboard"
    | "shop"
    | "settings"
    | "achievements"
  player: Player
  isGameStarted: boolean
  showLevelUpModal: boolean
  previousLevel: number
  tradingHistory: Trade[]
  achievements: Achievement[]
  settings: GameSettings
  gameStats: {
    totalPlayTime: number
    gamesPlayed: number
    highestPortfolio: number
    bestTradingStreak: number
    currentStreak: number
  }

  // Actions
  setScreen: (screen: GameState["currentScreen"]) => void
  startGame: () => void
  updatePlayer: (updates: Partial<Player>) => void
  addXP: (amount: number) => void
  addCoins: (amount: number) => void
  setShowLevelUpModal: (show: boolean) => void
  addTrade: (trade: Omit<Trade, "id" | "timestamp">) => void
  unlockAchievement: (achievementId: string) => void
  updateSettings: (settings: Partial<GameSettings>) => void
  resetGame: () => void
  updateGameStats: (stats: Partial<GameState["gameStats"]>) => void
}

const initialPlayer: Player = {
  name: "Rookie Trader",
  level: 1,
  xp: 0,
  rank: "Rookie Trader",
  portfolio: 1000,
  coins: 100,
  totalTrades: 0,
  successfulTrades: 0,
  achievements: [],
}

const initialAchievements: Achievement[] = [
  {
    id: "first-trade",
    name: "First Trade",
    description: "Complete your first trade",
    icon: "🎯",
    unlocked: false,
  },
  {
    id: "level-5",
    name: "Rising Star",
    description: "Reach level 5",
    icon: "⭐",
    unlocked: false,
  },
  {
    id: "whale-status",
    name: "Whale Status",
    description: "Accumulate 1,000,000 in portfolio value",
    icon: "🐋",
    unlocked: false,
  },
  {
    id: "trading-streak",
    name: "Hot Streak",
    description: "Make 10 successful trades in a row",
    icon: "🔥",
    unlocked: false,
  },
  {
    id: "coin-collector",
    name: "Coin Collector",
    description: "Collect 1000 coins",
    icon: "💰",
    unlocked: false,
  },
]

const initialSettings: GameSettings = {
  soundEnabled: true,
  musicEnabled: true,
  notifications: true,
  difficulty: "medium",
  theme: "dark",
}

const initialGameStats = {
  totalPlayTime: 0,
  gamesPlayed: 0,
  highestPortfolio: 1000,
  bestTradingStreak: 0,
  currentStreak: 0,
}

export const useGameState = create<GameState>()(
  persist(
    (set, get) => ({
      currentScreen: "menu",
      player: initialPlayer,
      isGameStarted: false,
      showLevelUpModal: false,
      previousLevel: 1,
      tradingHistory: [],
      achievements: initialAchievements,
      settings: initialSettings,
      gameStats: initialGameStats,

      setScreen: (screen) => set({ currentScreen: screen }),

      startGame: () =>
        set((state) => ({
          isGameStarted: true,
          currentScreen: "intro",
          gameStats: {
            ...state.gameStats,
            gamesPlayed: state.gameStats.gamesPlayed + 1,
          },
        })),

      updatePlayer: (updates) =>
        set((state) => {
          const updatedPlayer = { ...state.player, ...updates }
          const newStats = { ...state.gameStats }

          // Update highest portfolio if needed
          if (updatedPlayer.portfolio > state.gameStats.highestPortfolio) {
            newStats.highestPortfolio = updatedPlayer.portfolio
          }

          return {
            player: updatedPlayer,
            gameStats: newStats,
          }
        }),

      addXP: (amount) =>
        set((state) => {
          const newXP = state.player.xp + amount
          const newLevel = Math.floor(newXP / 100) + 1
          let newRank = state.player.rank

          // Update rank based on level
          if (newLevel >= 10) newRank = "Legendary Trader"
          else if (newLevel >= 8) newRank = "Whale"
          else if (newLevel >= 6) newRank = "Pro Trader"
          else if (newLevel >= 4) newRank = "Market Analyst"
          else if (newLevel >= 2) newRank = "Street Trader"

          const leveledUp = newLevel > state.player.level

          // Check for level-based achievements
          if (newLevel >= 5 && !state.achievements.find((a) => a.id === "level-5")?.unlocked) {
            get().unlockAchievement("level-5")
          }

          return {
            player: {
              ...state.player,
              xp: newXP,
              level: newLevel,
              rank: newRank,
            },
            showLevelUpModal: leveledUp,
            previousLevel: state.player.level,
          }
        }),

      addCoins: (amount) =>
        set((state) => {
          const newCoins = state.player.coins + amount

          // Check coin achievement
          if (newCoins >= 1000 && !state.achievements.find((a) => a.id === "coin-collector")?.unlocked) {
            get().unlockAchievement("coin-collector")
          }

          return {
            player: {
              ...state.player,
              coins: newCoins,
            },
          }
        }),

      setShowLevelUpModal: (show) => set({ showLevelUpModal: show }),

      addTrade: (trade) =>
        set((state) => {
          const newTrade: Trade = {
            ...trade,
            id: Date.now().toString(),
            timestamp: new Date(),
          }

          const isSuccessful = (trade.profit ?? 0) > 0
          const newTotalTrades = state.player.totalTrades + 1
          const newSuccessfulTrades = state.player.successfulTrades + (isSuccessful ? 1 : 0)

          // Update streak
          const newStreak = isSuccessful ? state.gameStats.currentStreak + 1 : 0
          const newBestStreak = Math.max(state.gameStats.bestTradingStreak, newStreak)

          // Check achievements
          if (newTotalTrades === 1) {
            get().unlockAchievement("first-trade")
          }
          if (newStreak >= 10 && !state.achievements.find((a) => a.id === "trading-streak")?.unlocked) {
            get().unlockAchievement("trading-streak")
          }

          return {
            tradingHistory: [newTrade, ...state.tradingHistory].slice(0, 100), // Keep last 100 trades
            player: {
              ...state.player,
              totalTrades: newTotalTrades,
              successfulTrades: newSuccessfulTrades,
            },
            gameStats: {
              ...state.gameStats,
              currentStreak: newStreak,
              bestTradingStreak: newBestStreak,
            },
          }
        }),

      unlockAchievement: (achievementId) =>
        set((state) => ({
          achievements: state.achievements.map((achievement) =>
            achievement.id === achievementId ? { ...achievement, unlocked: true, unlockedAt: new Date() } : achievement,
          ),
          player: {
            ...state.player,
            achievements: [...state.player.achievements, achievementId],
          },
        })),

      updateSettings: (newSettings) =>
        set((state) => ({
          settings: { ...state.settings, ...newSettings },
        })),

      updateGameStats: (stats) =>
        set((state) => ({
          gameStats: { ...state.gameStats, ...stats },
        })),

      resetGame: () =>
        set({
          player: initialPlayer,
          isGameStarted: false,
          currentScreen: "menu",
          showLevelUpModal: false,
          previousLevel: 1,
          tradingHistory: [],
          achievements: initialAchievements,
          gameStats: initialGameStats,
        }),
    }),
    {
      name: "nitvon-game-state",
    },
  ),
)

export const getPlayerSuccessRate = (player: Player): number => {
  if (player.totalTrades === 0) return 0
  return Math.round((player.successfulTrades / player.totalTrades) * 100)
}

export const getNextLevelXP = (currentLevel: number): number => {
  return currentLevel * 100
}

export const getXPProgress = (currentXP: number, currentLevel: number): number => {
  const currentLevelXP = (currentLevel - 1) * 100
  const nextLevelXP = currentLevel * 100
  return ((currentXP - currentLevelXP) / (nextLevelXP - currentLevelXP)) * 100
}
