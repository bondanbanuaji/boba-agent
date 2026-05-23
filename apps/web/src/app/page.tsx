"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

export default function LandingPage() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  return (
    <div className="min-h-screen bg-slate-950 relative overflow-hidden">
      {/* Ambient Background Orbs */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-40 -right-40 w-[600px] h-[600px] bg-blue-600/8 rounded-full blur-[120px] animate-float" />
        <div className="absolute top-1/2 -left-40 w-[500px] h-[500px] bg-emerald-600/8 rounded-full blur-[120px] animate-float" style={{ animationDelay: '2s' }} />
        <div className="absolute bottom-0 right-1/3 w-[400px] h-[400px] bg-purple-600/6 rounded-full blur-[120px] animate-float" style={{ animationDelay: '4s' }} />
      </div>

      {/* Grid pattern overlay */}
      <div className="fixed inset-0 pointer-events-none opacity-[0.02]" style={{
        backgroundImage: 'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)',
        backgroundSize: '60px 60px'
      }} />

      {/* Navigation */}
      <nav className="relative z-10 flex items-center justify-between px-8 py-6 max-w-7xl mx-auto">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 shadow-lg shadow-blue-500/25 flex items-center justify-center">
            <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <span className="text-xl font-extrabold tracking-tight gradient-text">BOBA AGENT</span>
        </div>
        <div className="flex items-center gap-4">
          <Link href="/dashboard" className="text-slate-400 hover:text-white transition-colors text-sm font-medium">Dashboard</Link>
          <Link href="/chat" className="px-5 py-2.5 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 rounded-full text-sm font-semibold transition-all shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 hover:scale-105">
            Launch App
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="relative z-10 flex flex-col items-center justify-center text-center px-4 pt-20 pb-32 max-w-5xl mx-auto">
        <div className={`transition-all duration-1000 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-800/60 backdrop-blur border border-slate-700/50 text-sm text-slate-300 mb-8">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>Powered by AI &middot; Built for Productivity</span>
          </div>

          {/* Main Heading */}
          <h1 className="text-6xl md:text-7xl lg:text-8xl font-extrabold tracking-tight mb-6 leading-[0.95]">
            <span className="block text-white">Your Personal</span>
            <span className="block gradient-text">AI Command Center</span>
          </h1>

          {/* Subtitle */}
          <p className="text-lg md:text-xl text-slate-400 max-w-2xl mx-auto mb-12 leading-relaxed">
            Control your entire digital ecosystem — Google Workspace, Telegram, WhatsApp, and more — through natural language chat.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/chat" className="group px-8 py-4 bg-gradient-to-r from-blue-600 to-emerald-500 hover:from-blue-500 hover:to-emerald-400 rounded-2xl font-bold text-lg transition-all shadow-2xl shadow-blue-500/20 hover:shadow-blue-500/30 hover:scale-105">
              Start Chatting
              <span className="inline-block ml-2 transition-transform group-hover:translate-x-1">&rarr;</span>
            </Link>
            <Link href="/dashboard" className="px-8 py-4 bg-slate-800/60 hover:bg-slate-800 backdrop-blur border border-slate-700/50 hover:border-slate-600 rounded-2xl font-bold text-lg transition-all hover:scale-105">
              View Dashboard
            </Link>
          </div>
        </div>

        {/* Feature Cards */}
        <div className={`grid grid-cols-1 md:grid-cols-3 gap-6 mt-24 w-full transition-all duration-1000 delay-300 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'}`}>
          {[
            {
              icon: '💬',
              title: 'Natural Language Chat',
              desc: 'Talk to your agent like a human. Execute complex tasks with simple commands.',
              gradient: 'from-blue-500/10 to-blue-600/5',
              border: 'hover:border-blue-500/30',
            },
            {
              icon: '🔗',
              title: 'Multi-Platform Integration',
              desc: 'Connect Gmail, Drive, Telegram, WhatsApp, and more in one unified interface.',
              gradient: 'from-emerald-500/10 to-emerald-600/5',
              border: 'hover:border-emerald-500/30',
            },
            {
              icon: '⚡',
              title: 'AI-Powered Actions',
              desc: 'Let AI handle emails, file search, messaging, and scheduling automatically.',
              gradient: 'from-purple-500/10 to-purple-600/5',
              border: 'hover:border-purple-500/30',
            },
          ].map((feature, i) => (
            <div key={i} className={`glass-card bg-gradient-to-br ${feature.gradient} p-8 text-left transition-all duration-300 hover:scale-[1.02] ${feature.border}`}>
              <div className="text-3xl mb-4">{feature.icon}</div>
              <h3 className="text-lg font-bold text-white mb-2">{feature.title}</h3>
              <p className="text-slate-400 text-sm leading-relaxed">{feature.desc}</p>
            </div>
          ))}
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 text-center py-8 text-slate-500 text-sm">
        Built with ❤️ by BOBA AGENT Team
      </footer>
    </div>
  );
}
