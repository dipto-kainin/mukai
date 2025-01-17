import React from 'react'
import { Button } from "@/components/ui/button"
import { Users2, Radio, Headphones } from 'lucide-react'
import { Redirect } from './components/Redirect'
import { Navbar } from './components/Appbar'

const LandingPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1a1b26] via-[#4a1d96] to-[#581c87] p-6">
      <Navbar />
      <Redirect />
      {/* Hero Section */}
      <section className="container mx-auto px-4 text-center pt-32 pb-24">
        <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
          Let Your Fans Choose the Beat
        </h1>
        <p className="text-lg md:text-xl text-gray-300 max-w-2xl mx-auto mb-10">
          Empower your audience to curate your music stream. Connect with fans like never before.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button className="bg-[#9333ea] hover:bg-[#7e22ce] text-white text-lg px-8 py-6">
            Get Started
          </Button>
          <Button variant="outline" className="border-white text-[#7e22ce] hover:text-white hover:bg-white/10 text-lg px-8 py-6">
            Learn More
          </Button>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-24">
        <h2 className="text-3xl md:text-4xl font-bold text-white text-center mb-16">
          Key Features
        </h2>
        <div className="grid md:grid-cols-3 gap-12 max-w-5xl mx-auto">
          <div className="text-center">
            <div className="w-16 h-16 mx-auto mb-6 flex items-center justify-center rounded-full bg-yellow-500/10">
              <Users2 className="w-8 h-8 text-yellow-500" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-3">
              Fan Interaction
            </h3>
            <p className="text-gray-300">
              Let fans choose the music.
            </p>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 mx-auto mb-6 flex items-center justify-center rounded-full bg-green-500/10">
              <Radio className="w-8 h-8 text-green-500" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-3">
              Live Streaming
            </h3>
            <p className="text-gray-300">
              Stream with real-time input.
            </p>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 mx-auto mb-6 flex items-center justify-center rounded-full bg-blue-500/10">
              <Headphones className="w-8 h-8 text-blue-500" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-3">
              High-Quality Audio
            </h3>
            <p className="text-gray-300">
              Crystal clear sound quality.
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="container mx-auto px-4 py-8 text-center text-gray-400">
        <p>© 2024 Muzer. All rights reserved.</p>
      </footer>
    </div>
  )
}

export default LandingPage