"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { FileText, Plus, Sparkles, X } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"

export default function Dashboard() {
  const [files, setFiles] = useState(["file1.txt", "file2.txt", "file3.txt"])
  const [newFileName, setNewFileName] = useState("")
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [activeFile, setActiveFile] = useState<string | null>(null)
  const router = useRouter()
  const containerRef = useRef<HTMLDivElement>(null)

  const handleFileClick = (filename: string) => {
    setActiveFile(filename)
    setTimeout(() => {
      router.push(`/draw/${filename}`)
    }, 500)
  }

  const handleNewFile = () => {
    if (newFileName.trim()) {
      setFiles([...files, newFileName])
      setNewFileName("")
      setIsDialogOpen(false)
    }
  }

  const handleDeleteFile = (e: React.MouseEvent, filename: string) => {
    e.stopPropagation()
    setFiles(files.filter((file) => file !== filename))
  }

  // Create floating particles effect
  useEffect(() => {
    if (!containerRef.current) return

    const container = containerRef.current
    const particleCount = 30

    // Remove any existing particles
    const existingParticles = container.querySelectorAll(".particle")
    existingParticles.forEach((particle) => particle.remove())

    for (let i = 0; i < particleCount; i++) {
      const particle = document.createElement("div")
      particle.classList.add("particle")

      // Random size between 4px and 12px
      const size = Math.random() * 8 + 4
      particle.style.width = `${size}px`
      particle.style.height = `${size}px`

      // Random position
      particle.style.left = `${Math.random() * 100}%`
      particle.style.top = `${Math.random() * 100}%`

      // Random opacity
      particle.style.opacity = `${Math.random() * 0.5 + 0.1}`

      // Random animation duration
      const duration = Math.random() * 20 + 10
      particle.style.animation = `float ${duration}s linear infinite`

      // Random delay
      particle.style.animationDelay = `${Math.random() * 10}s`

      container.appendChild(particle)
    }

    return () => {
      const particles = container.querySelectorAll(".particle")
      particles.forEach((particle) => particle.remove())
    }
  }, [])

  return (
    <div
      ref={containerRef}
      className="min-h-screen overflow-hidden relative bg-gradient-to-br from-purple-900 via-indigo-800 to-violet-900 p-6 flex flex-col items-center"
    >
      {/* Decorative elements */}
      <div className="absolute inset-0 bg-[url('/placeholder.svg?height=500&width=500')] bg-repeat opacity-5"></div>
      <div className="absolute top-0 left-0 w-full h-64 bg-gradient-to-b from-fuchsia-600/20 to-transparent"></div>
      <div className="absolute bottom-0 right-0 w-full h-64 bg-gradient-to-t from-indigo-600/20 to-transparent"></div>

      {/* Glowing orb */}
      <div className="absolute top-1/4 left-1/4 w-64 h-64 rounded-full bg-purple-500/20 blur-3xl"></div>
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full bg-indigo-500/20 blur-3xl"></div>

      {/* Header */}
      <motion.div
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="relative z-10 mb-12 mt-8"
      >
        <h1 className="text-5xl font-bold text-white text-center">
          <span className="inline-block">
            <Sparkles className="inline-block mr-3 text-purple-300" />
          </span>
          Creative Space
        </h1>
        <p className="text-purple-200 mt-4 text-center max-w-md mx-auto">
          Select a file to start your creative journey or create a new masterpiece
        </p>
      </motion.div>

      {/* Files grid */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="w-full max-w-4xl relative z-10"
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {files.map((file, index) => (
            <motion.div
              key={file}
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              whileHover={{
                scale: 1.05,
                boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.2), 0 10px 10px -5px rgba(0, 0, 0, 0.1)",
              }}
              className={`relative ${activeFile === file ? "scale-95 opacity-50" : ""}`}
            >
              <Card
                onClick={() => handleFileClick(file)}
                className="cursor-pointer h-48 bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-sm border-white/20 overflow-hidden group"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-purple-500/20 via-transparent to-blue-500/20 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <div className="p-6 flex flex-col h-full justify-between relative z-10">
                  <div className="flex justify-between items-start">
                    <FileText className="h-10 w-10 text-purple-300" />
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 rounded-full opacity-0 group-hover:opacity-100 transition-opacity text-white hover:text-white hover:bg-red-500/20"
                      onClick={(e) => handleDeleteFile(e, file)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                  <div>
                    <h3 className="text-xl font-medium text-white mt-4 truncate">{file}</h3>
                    <p className="text-purple-200/70 text-sm mt-1">Click to open and edit</p>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}

          {/* Create new file card */}
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.3, delay: files.length * 0.1 }}
            whileHover={{
              scale: 1.05,
              boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.2), 0 10px 10px -5px rgba(0, 0, 0, 0.1)",
            }}
          >
            <Card
              onClick={() => setIsDialogOpen(true)}
              className="cursor-pointer h-48 bg-gradient-to-br from-white/5 to-white/0 backdrop-blur-sm border-white/10 border-dashed flex items-center justify-center group"
            >
              <div className="text-center p-6">
                <div className="mx-auto rounded-full bg-purple-500/10 w-16 h-16 flex items-center justify-center mb-4 group-hover:bg-purple-500/20 transition-colors">
                  <Plus className="h-8 w-8 text-purple-300" />
                </div>
                <h3 className="text-lg font-medium text-white">Create New File</h3>
              </div>
            </Card>
          </motion.div>
        </div>
      </motion.div>

      {/* New file dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="bg-gradient-to-br from-purple-900/90 to-indigo-900/90 backdrop-blur-lg border-white/20 text-white">
          <DialogHeader>
            <DialogTitle>Create New File</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <Input
              value={newFileName}
              onChange={(e) => setNewFileName(e.target.value)}
              placeholder="Enter file name"
              className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
              onKeyDown={(e) => e.key === "Enter" && handleNewFile()}
              autoFocus
            />
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsDialogOpen(false)}
              className="border-white/20 text-white hover:bg-white/10"
            >
              Cancel
            </Button>
            <Button onClick={handleNewFile} className="bg-purple-600 hover:bg-purple-700">
              Create
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* CSS for floating particles */}
      <style jsx global>{`
        .particle {
          position: absolute;
          background-color: rgba(255, 255, 255, 0.5);
          border-radius: 50%;
          pointer-events: none;
        }
        
        @keyframes float {
          0% {
            transform: translateY(0) translateX(0) rotate(0deg);
          }
          33% {
            transform: translateY(-100px) translateX(50px) rotate(120deg);
          }
          66% {
            transform: translateY(-50px) translateX(-50px) rotate(240deg);
          }
          100% {
            transform: translateY(0) translateX(0) rotate(360deg);
          }
        }
      `}</style>
    </div>
  )
}

