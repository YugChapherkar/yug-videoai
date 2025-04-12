import React from "react";
import { motion } from "framer-motion";
import { Button } from "../ui/button";
import { ArrowRight, Play } from "lucide-react";

interface HeroSectionProps {
  title?: string;
  subtitle?: string;
  ctaText?: string;
  watchDemoText?: string;
}

const HeroSection = ({
  title = "Resize and Optimize Your Videos for Every Platform in One Click",
  subtitle = "Our AI-powered tool automatically adjusts your videos for YouTube, Instagram, TikTok, and more - saving you hours of manual editing work.",
  ctaText = "Start Now",
  watchDemoText = "Watch Demo",
}: HeroSectionProps) => {
  return (
    <section className="w-full bg-gradient-to-br from-slate-900 to-slate-800 text-white py-20 md:py-32 px-4 md:px-8 lg:px-16 min-h-[700px] flex items-center">
      <div className="container mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        {/* Left Column - Text Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="flex flex-col space-y-6"
        >
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
            {title}
          </h1>
          <p className="text-lg md:text-xl text-slate-300 max-w-xl">
            {subtitle}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 pt-4">
            <Button
              size="lg"
              className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-8"
              asChild
            >
              <a href="/dashboard">
                {ctaText} <ArrowRight className="ml-2 h-5 w-5" />
              </a>
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="border-white text-white hover:bg-white/10"
            >
              <Play className="mr-2 h-5 w-5" /> {watchDemoText}
            </Button>
          </div>
          <div className="pt-6">
            <p className="text-sm text-slate-400">
              Trusted by content creators worldwide
            </p>
            <div className="flex flex-wrap gap-8 mt-4 opacity-70">
              {/* Placeholder logos - replace with actual brand logos */}
              <div className="h-8 w-24 bg-white/20 rounded"></div>
              <div className="h-8 w-24 bg-white/20 rounded"></div>
              <div className="h-8 w-24 bg-white/20 rounded"></div>
              <div className="h-8 w-24 bg-white/20 rounded"></div>
            </div>
          </div>
        </motion.div>

        {/* Right Column - Video/Image Demo */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="relative rounded-xl overflow-hidden shadow-2xl border border-slate-700"
        >
          <div className="aspect-video bg-slate-800 relative">
            {/* Video placeholder with play button overlay */}
            <img
              src="https://images.unsplash.com/photo-1626379953822-baec19c3accd?w=1200&q=80"
              alt="Video editing demonstration"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
              <div className="rounded-full bg-blue-600 p-4 cursor-pointer hover:bg-blue-700 transition-colors">
                <Play className="h-8 w-8" />
              </div>
            </div>

            {/* Platform indicators */}
            <div className="absolute bottom-4 left-4 right-4 flex justify-between">
              <div className="flex space-x-2">
                <div className="bg-red-500 text-white text-xs px-2 py-1 rounded">
                  YouTube
                </div>
                <div className="bg-purple-500 text-white text-xs px-2 py-1 rounded">
                  Instagram
                </div>
                <div className="bg-black text-white text-xs px-2 py-1 rounded">
                  TikTok
                </div>
              </div>
              <div className="bg-blue-600 text-white text-xs px-2 py-1 rounded">
                AI-Powered
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;
