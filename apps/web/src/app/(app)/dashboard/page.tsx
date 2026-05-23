"use client";

import { useEffect, useState } from "react";
import { fetchAgentStatus, fetchIntegrationStatus } from "@/lib/api";

export default function DashboardPage() {
  const [agentStatus, setAgentStatus] = useState('loading');
  const [integrations, setIntegrations] = useState({ google: false, telegram: false, whatsapp: false });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const [agent, ints] = await Promise.all([
        fetchAgentStatus(),
        fetchIntegrationStatus(),
      ]);
      setAgentStatus(agent.status || 'offline');
      setIntegrations(ints);
      setLoading(false);
    };
    fetchData();
    const interval = setInterval(fetchData, 5000);
    return () => clearInterval(interval);
  }, []);

  const activeIntegrations = Object.values(integrations).filter(Boolean).length;

  return (
    <div className="p-8 lg:p-10 animate-fade-in">
      <header className="mb-10">
        <h1 className="text-4xl font-extrabold tracking-tight mb-2">Welcome Back</h1>
        <p className="text-slate-400">Here's the current status of your AI Agent ecosystem.</p>
      </header>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        {loading ? (
          [1,2,3].map(i => (
            <div key={i} className="animate-pulse glass-card p-6 h-32" />
          ))
        ) : (
          <>
            {/* Agent Status */}
            <div className="group glass-card p-6 hover:border-blue-500/30 transition-all duration-300 shadow-xl hover:shadow-blue-500/5">
              <div className="flex items-center justify-between">
                <h3 className="text-slate-400 font-medium text-sm uppercase tracking-wide">Agent Status</h3>
                <svg className="w-5 h-5 text-blue-400 opacity-30 group-hover:opacity-60 transition-opacity" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <div className="mt-4 flex items-center gap-3">
                <span className="relative flex h-3 w-3">
                  <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${agentStatus === 'idle' ? 'bg-green-400' : 'bg-yellow-400'}`} />
                  <span className={`relative inline-flex rounded-full h-3 w-3 ${agentStatus === 'idle' ? 'bg-green-500' : 'bg-yellow-500'}`} />
                </span>
                <p className="text-2xl font-extrabold text-white capitalize">{agentStatus}</p>
              </div>
            </div>

            {/* Integrations */}
            <div className="group glass-card p-6 hover:border-emerald-500/30 transition-all duration-300 shadow-xl hover:shadow-emerald-500/5">
              <div className="flex items-center justify-between">
                <h3 className="text-slate-400 font-medium text-sm uppercase tracking-wide">Active Integrations</h3>
                <svg className="w-5 h-5 text-emerald-400 opacity-30 group-hover:opacity-60 transition-opacity" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101" />
                </svg>
              </div>
              <div className="mt-4">
                <p className="text-2xl font-extrabold text-white">{activeIntegrations} <span className="text-lg text-slate-500 font-medium">/ 3</span></p>
                <div className="flex gap-2 mt-3">
                  <div className={`w-2 h-2 rounded-full ${integrations.google ? 'bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)]' : 'bg-slate-600'}`} title="Google" />
                  <div className={`w-2 h-2 rounded-full ${integrations.telegram ? 'bg-blue-400 shadow-[0_0_8px_rgba(96,165,250,0.8)]' : 'bg-slate-600'}`} title="Telegram" />
                  <div className={`w-2 h-2 rounded-full ${integrations.whatsapp ? 'bg-green-400 shadow-[0_0_8px_rgba(74,222,128,0.8)]' : 'bg-slate-600'}`} title="WhatsApp" />
                </div>
              </div>
            </div>

            {/* Tokens */}
            <div className="group glass-card bg-gradient-to-br from-indigo-900/20 to-purple-900/20 p-6 hover:border-purple-500/30 transition-all duration-300 shadow-xl hover:shadow-purple-500/5">
              <div className="flex items-center justify-between">
                <h3 className="text-indigo-200/60 font-medium text-sm uppercase tracking-wide">Tokens Used</h3>
                <svg className="w-5 h-5 text-purple-400 opacity-30 group-hover:opacity-60 transition-opacity" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                </svg>
              </div>
              <div className="mt-4">
                <p className="text-2xl font-extrabold gradient-text">0 <span className="text-lg font-medium">tokens</span></p>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Activity & Health */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="glass-card p-8">
          <h3 className="text-xl font-bold mb-6">Recent Activity</h3>
          <div className="flex items-center justify-center h-40 text-slate-500 text-sm">
            No recent activity
          </div>
        </div>
        <div className="glass-card p-8">
          <h3 className="text-xl font-bold mb-6">Integration Health</h3>
          <div className="flex items-center justify-center h-40 text-slate-500 text-sm">
            Awaiting connections
          </div>
        </div>
      </div>
    </div>
  );
}
