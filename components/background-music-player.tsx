"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Volume2, VolumeX, Music } from "lucide-react"
import { useGameState } from "@/lib/game-state"

export function BackgroundMusicPlayer() {
  const [isPlaying, setIsPlaying] = useState(false)
  const [isMuted, setIsMuted] = useState(false)
  const [hasUserInteracted, setHasUserInteracted] = useState(false)
  const audioRef = useRef<HTMLAudioElement>(null)
  const { settings } = useGameState()

  // Auto-play music when user first interacts with the page
  useEffect(() => {
    const handleFirstInteraction = () => {
      if (!hasUserInteracted && settings.musicEnabled) {
        setHasUserInteracted(true)
        // Small delay to ensure audio context is ready
        setTimeout(() => {
          playMusic()
        }, 100)
      }
    }

    // Listen for any user interaction
    const events = ["click", "touchstart", "keydown", "scroll"]
    events.forEach((event) => {
      document.addEventListener(event, handleFirstInteraction, { once: true })
    })

    return () => {
      events.forEach((event) => {
        document.removeEventListener(event, handleFirstInteraction)
      })
    }
  }, [hasUserInteracted, settings.musicEnabled])

  // Handle audio events
  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return

    const handleEnded = () => {
      // Loop the music
      audio.currentTime = 0
      if (isPlaying && settings.musicEnabled) {
        audio.play().catch(console.error)
      }
    }

    const handleCanPlay = () => {
      if (hasUserInteracted && isPlaying && settings.musicEnabled) {
        audio.play().catch(console.error)
      }
    }

    audio.addEventListener("ended", handleEnded)
    audio.addEventListener("canplay", handleCanPlay)

    return () => {
      audio.removeEventListener("ended", handleEnded)
      audio.removeEventListener("canplay", handleCanPlay)
    }
  }, [isPlaying, hasUserInteracted, settings.musicEnabled])

  // Stop music if disabled in settings
  useEffect(() => {
    if (!settings.musicEnabled && isPlaying) {
      pauseMusic()
    }
  }, [settings.musicEnabled])

  const playMusic = async () => {
    const audio = audioRef.current
    if (!audio || !settings.musicEnabled) return

    try {
      audio.volume = 0.3 // Set to 30% volume for background music
      await audio.play()
      setIsPlaying(true)
      console.log("[v0] Background music started playing")
    } catch (error) {
      console.log("[v0] Auto-play blocked by browser:", error)
      // Auto-play was blocked, user will need to manually start
    }
  }

  const pauseMusic = () => {
    const audio = audioRef.current
    if (!audio) return

    audio.pause()
    setIsPlaying(false)
    console.log("[v0] Background music paused")
  }

  const togglePlay = () => {
    if (isPlaying) {
      pauseMusic()
    } else {
      setHasUserInteracted(true)
      playMusic()
    }
  }

  const toggleMute = () => {
    const audio = audioRef.current
    if (!audio) return

    const newMutedState = !isMuted
    audio.muted = newMutedState
    setIsMuted(newMutedState)
  }

  // Don't render if music is disabled
  if (!settings.musicEnabled) return null

  return (
    <div className="fixed bottom-4 left-4 z-50">
      {/* Hidden audio element */}
      <audio ref={audioRef} src="/crypto-beats-background.mp3" preload="auto" loop />

      {/* Floating music controls */}
      <div className="flex items-center gap-2 bg-black/80 backdrop-blur-sm rounded-full p-2 border border-purple-500/30">
        <Button
          variant="ghost"
          size="sm"
          onClick={togglePlay}
          className="p-2 text-purple-400 hover:text-purple-300 hover:bg-purple-500/20 rounded-full"
          title={isPlaying ? "Pause background music" : "Play background music"}
        >
          <Music className={`h-4 w-4 ${isPlaying ? "animate-pulse" : ""}`} />
        </Button>

        <Button
          variant="ghost"
          size="sm"
          onClick={toggleMute}
          className="p-2 text-purple-400 hover:text-purple-300 hover:bg-purple-500/20 rounded-full"
          title={isMuted ? "Unmute" : "Mute"}
        >
          {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
        </Button>

        {/* Visual indicator */}
        <div className={`w-2 h-2 rounded-full ${isPlaying ? "bg-green-400 animate-pulse" : "bg-gray-500"}`} />
      </div>

      {/* Welcome message for first-time users */}
      {!hasUserInteracted && (
        <div className="absolute bottom-16 left-0 bg-black/90 text-white text-xs p-2 rounded-lg border border-purple-500/30 whitespace-nowrap animate-bounce">
          🎵 Click anywhere to start the beats!
        </div>
      )}
    </div>
  )
}
