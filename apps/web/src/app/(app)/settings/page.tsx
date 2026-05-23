import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Settings - BOBA AGENT",
  description: "Configure your AI agent",
};

export default function SettingsPage() {
  return (
    <div className="p-8 lg:p-10 max-w-3xl animate-fade-in">
      <header className="mb-10">
        <h1 className="text-4xl font-extrabold tracking-tight mb-2">Settings</h1>
        <p className="text-slate-400">Configure your AI agent and connected services.</p>
      </header>

      {/* AI Configuration */}
      <div className="glass-card p-8 mb-6">
        <h2 className="text-xl font-bold mb-6">AI Configuration</h2>
        <div className="flex flex-col gap-5">
          <div>
            <label className="block text-sm text-slate-400 mb-2 font-medium">Model</label>
            <select className="w-full p-3 bg-slate-800/50 border border-slate-700/50 rounded-xl text-slate-200 focus:outline-none focus:border-blue-500/50 transition-colors">
              <option>nvidia/meta/llama-3.3-70b-instruct</option>
              <option>gemini-2.5-flash</option>
              <option>gpt-4o</option>
              <option>gpt-4o-mini</option>
            </select>
          </div>
          <div>
            <label className="block text-sm text-slate-400 mb-2 font-medium">API Base URL</label>
            <input
              type="text"
              defaultValue="http://localhost:20128/v1"
              className="w-full p-3 bg-slate-800/50 border border-slate-700/50 rounded-xl text-slate-200 focus:outline-none focus:border-blue-500/50 transition-colors font-mono text-sm"
            />
          </div>
          <div>
            <label className="block text-sm text-slate-400 mb-2 font-medium">System Prompt</label>
            <textarea
              className="w-full p-3 bg-slate-800/50 border border-slate-700/50 rounded-xl text-slate-200 focus:outline-none focus:border-blue-500/50 transition-colors h-32 resize-none"
              placeholder="Custom instructions for the agent..."
              defaultValue="You are BOBA AGENT, a helpful AI assistant that can control Google Workspace, Telegram, WhatsApp, and more."
            />
          </div>
          <button className="self-start px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 rounded-xl font-semibold text-sm transition-all shadow-lg shadow-blue-500/20 hover:shadow-blue-500/30">
            Save Changes
          </button>
        </div>
      </div>

      {/* 9Router Config */}
      <div className="glass-card p-8">
        <h2 className="text-xl font-bold mb-6">9Router Connection</h2>
        <div className="flex flex-col gap-5">
          <div className="flex items-center gap-3">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-yellow-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-3 w-3 bg-yellow-500" />
            </span>
            <span className="text-sm text-slate-300">9Router status: <span className="text-yellow-400 font-medium">Not Connected</span></span>
          </div>
          <div>
            <label className="block text-sm text-slate-400 mb-2 font-medium">9Router URL</label>
            <input
              type="text"
              defaultValue="http://localhost:20128"
              className="w-full p-3 bg-slate-800/50 border border-slate-700/50 rounded-xl text-slate-200 focus:outline-none focus:border-blue-500/50 transition-colors font-mono text-sm"
            />
          </div>
          <div>
            <label className="block text-sm text-slate-400 mb-2 font-medium">API Key</label>
            <input
              type="password"
              placeholder="sk-xxxxxxxx"
              className="w-full p-3 bg-slate-800/50 border border-slate-700/50 rounded-xl text-slate-200 focus:outline-none focus:border-blue-500/50 transition-colors font-mono text-sm"
            />
          </div>
          <button className="self-start px-6 py-3 bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 rounded-xl font-semibold text-sm transition-all shadow-lg shadow-emerald-500/20 hover:shadow-emerald-500/30">
            Test Connection
          </button>
        </div>
      </div>
    </div>
  );
}
