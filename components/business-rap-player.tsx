"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Slider } from "@/components/ui/slider"
import { Play, Pause, Volume2, VolumeX, Music, SkipForward, SkipBack } from "lucide-react"

interface BusinessRapPlayerProps {
  className?: string
}

export function BusinessRapPlayer({ className }: BusinessRapPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false)
  const [volume, setVolume] = useState([70])
  const [isMuted, setIsMuted] = useState(false)
  const [currentTrack, setCurrentTrack] = useState(0)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const audioRef = useRef<HTMLAudioElement>(null)

  // Business rap lyrics and tracks
  const tracks = [
    {
      title: "Crypto Hustle",
      artist: "Nitvon AI",
      lyrics: `
🎵 Started from the bottom now we trading crypto
Bitcoin to the moon, that's the way we go
Portfolio growing, making that dough
Smart contracts flowing, watch the money grow

Ethereum rising, Solana's on fire
Blockchain technology, taking us higher
HODL through the dips, diamond hands required
Financial freedom, that's what we desire

Trading all day, charts on my screen
Green candles rising, living the dream
Market cap climbing, part of the team
Crypto revolution, nothing's what it seems 🎵
      `,
    },
    {
      title: "Business Mindset",
      artist: "Nitvon AI",
      lyrics: `
🎵 Wake up every morning with a business plan
Opportunities knocking, gotta take a stand
Investment strategies, money in my hand
Building up an empire across the land

Risk and reward, that's the game we play
Diversify the portfolio every single day
Bull market, bear market, we find a way
Success is the target, no time to delay

Networking connections, making the deals
Profit margins rising, that's how it feels
Innovation driving, spinning the wheels
Business acumen, sealing the deals 🎵
      `,
    },
    {
      title: "Digital Gold",
      artist: "Nitvon AI",
      lyrics: `
🎵 Digital gold in my digital wallet
Blockchain secured, can't nobody halt it
Decentralized future, that's what we call it
Financial revolution, time to install it

Mining the blocks, securing the chain
Proof of work, proof of stake, breaking the chain
Traditional banking feeling the strain
Crypto adoption, sunshine through rain

Smart money moving, DeFi is the way
Yield farming profits every single day
NFTs and tokens, here to stay
Web3 future, leading the way 🎵
      `,
    },
  ]

  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return

    const updateTime = () => setCurrentTime(audio.currentTime)
    const updateDuration = () => setDuration(audio.duration)

    audio.addEventListener("timeupdate", updateTime)
    audio.addEventListener("loadedmetadata", updateDuration)
    audio.addEventListener("ended", () => {
      setIsPlaying(false)
      nextTrack()
    })

    return () => {
      audio.removeEventListener("timeupdate", updateTime)
      audio.removeEventListener("loadedmetadata", updateDuration)
    }
  }, [currentTrack])

  const togglePlay = () => {
    const audio = audioRef.current
    if (!audio) return

    if (isPlaying) {
      audio.pause()
    } else {
      audio.play()
    }
    setIsPlaying(!isPlaying)
  }

  const nextTrack = () => {
    setCurrentTrack((prev) => (prev + 1) % tracks.length)
    setIsPlaying(false)
  }

  const prevTrack = () => {
    setCurrentTrack((prev) => (prev - 1 + tracks.length) % tracks.length)
    setIsPlaying(false)
  }

  const handleVolumeChange = (value: number[]) => {
    setVolume(value)
    if (audioRef.current) {
      audioRef.current.volume = value[0] / 100
    }
  }

  const toggleMute = () => {
    setIsMuted(!isMuted)
    if (audioRef.current) {
      audioRef.current.muted = !isMuted
    }
  }

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60)
    const seconds = Math.floor(time % 60)
    return `${minutes}:${seconds.toString().padStart(2, "0")}`
  }

  const currentTrackData = tracks[currentTrack]

  return (
    <Card
      className={`p-4 bg-gradient-to-br from-purple-900/20 to-blue-900/20 backdrop-blur-sm border border-purple-500/30 ${className}`}
    >
      {/* Hidden audio element - using a sample beat URL */}
      <audio ref={audioRef} src="/placeholder-beat.mp3" preload="metadata" />

      {/* Header */}
      <div className="flex items-center gap-3 mb-4">
        <div className="p-2 bg-gradient-to-r from-purple-500 to-blue-500 rounded-lg">
          <Music className="h-5 w-5 text-white" />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-bold text-foreground truncate">{currentTrackData.title}</h3>
          <p className="text-sm text-muted-foreground truncate">{currentTrackData.artist}</p>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mb-4">
        <div className="flex justify-between text-xs text-muted-foreground mb-1">
          <span>{formatTime(currentTime)}</span>
          <span>{formatTime(duration || 180)}</span>
        </div>
        <div className="w-full bg-secondary rounded-full h-2">
          <div
            className="bg-gradient-to-r from-purple-500 to-blue-500 h-2 rounded-full transition-all duration-300"
            style={{ width: `${duration ? (currentTime / duration) * 100 : 0}%` }}
          />
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center justify-center gap-4 mb-4">
        <Button variant="ghost" size="sm" onClick={prevTrack} className="p-2">
          <SkipBack className="h-4 w-4" />
        </Button>
        <Button
          onClick={togglePlay}
          className="bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white p-3 rounded-full"
        >
          {isPlaying ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5 ml-0.5" />}
        </Button>
        <Button variant="ghost" size="sm" onClick={nextTrack} className="p-2">
          <SkipForward className="h-4 w-4" />
        </Button>
      </div>

      {/* Volume Control */}
      <div className="flex items-center gap-3 mb-4">
        <Button variant="ghost" size="sm" onClick={toggleMute} className="p-2">
          {isMuted || volume[0] === 0 ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
        </Button>
        <Slider value={volume} onValueChange={handleVolumeChange} max={100} min={0} step={1} className="flex-1" />
        <span className="text-xs text-muted-foreground w-8">{volume[0]}%</span>
      </div>

      {/* Lyrics Display */}
      <div className="bg-black/20 rounded-lg p-3 max-h-32 overflow-y-auto">
        <div className="text-xs text-muted-foreground whitespace-pre-line leading-relaxed">
          {currentTrackData.lyrics}
        </div>
      </div>

      {/* Track List */}
      <div className="mt-4 space-y-1">
        <h4 className="text-sm font-semibold text-foreground mb-2">Playlist</h4>
        {tracks.map((track, index) => (
          <button
            key={index}
            onClick={() => setCurrentTrack(index)}
            className={`w-full text-left p-2 rounded text-xs transition-colors ${
              currentTrack === index
                ? "bg-purple-500/20 text-purple-300"
                : "hover:bg-secondary/50 text-muted-foreground"
            }`}
          >
            <div className="font-medium">{track.title}</div>
            <div className="text-xs opacity-70">{track.artist}</div>
          </button>
        ))}
      </div>
    </Card>
  )
}
