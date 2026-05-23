import React, { useEffect, useState } from 'react';

interface DashboardData {
  agentStatus: string;
  integrations: {
    google: boolean;
    telegram: boolean;
    whatsapp: boolean;
  };
}

export const DashboardStats: React.FC = () => {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const API_URL = import.meta.env.PUBLIC_API_URL || 'http://localhost:3001';
        
        const [agentRes, integrationRes] = await Promise.all([
          fetch(`${API_URL}/api/agent/status`).catch(() => ({ json: () => ({ status: "disconnected" }) })),
          fetch(`${API_URL}/api/integrations/status`).catch(() => ({ json: () => ({ google: false, telegram: false, whatsapp: false }) }))
        ]);

        const agentData = await (agentRes as any).json();
        const integrationData = await (integrationRes as any).json();

        setData({
          agentStatus: agentData.status || 'offline',
          integrations: {
            google: integrationData.google || false,
            telegram: integrationData.telegram || false,
            whatsapp: integrationData.whatsapp || false,
          }
        });
      } catch (error) {
        console.error("Failed to fetch dashboard stats", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
    // Setup simple polling every 5 seconds for real-time feel
    const interval = setInterval(fetchStats, 5000);
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 w-full">
        {[1, 2, 3].map((i) => (
          <div key={i} className="animate-pulse bg-slate-800/50 backdrop-blur-md rounded-2xl p-6 border border-slate-700/50 h-32"></div>
        ))}
      </div>
    );
  }

  const activeIntegrationsCount = Object.values(data?.integrations || {}).filter(Boolean).length;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12 w-full">
      {/* Agent Status Card */}
      <div className="group relative overflow-hidden bg-slate-800/40 hover:bg-slate-800/60 transition-all duration-300 backdrop-blur-xl rounded-3xl p-6 border border-slate-700/50 hover:border-blue-500/30 shadow-xl hover:shadow-blue-500/10">
        <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
          <svg className="w-16 h-16 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
        </div>
        <h3 className="text-slate-400 font-medium tracking-wide text-sm uppercase">Agent Status</h3>
        <div className="mt-4 flex items-center gap-3">
          <span className="relative flex h-4 w-4">
            <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${data?.agentStatus === 'idle' ? 'bg-green-400' : 'bg-yellow-400'}`}></span>
            <span className={`relative inline-flex rounded-full h-4 w-4 ${data?.agentStatus === 'idle' ? 'bg-green-500' : 'bg-yellow-500'}`}></span>
          </span>
          <p className="text-3xl font-extrabold text-white capitalize tracking-tight">{data?.agentStatus}</p>
        </div>
      </div>

      {/* Integrations Card */}
      <div className="group relative overflow-hidden bg-slate-800/40 hover:bg-slate-800/60 transition-all duration-300 backdrop-blur-xl rounded-3xl p-6 border border-slate-700/50 hover:border-emerald-500/30 shadow-xl hover:shadow-emerald-500/10">
        <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
          <svg className="w-16 h-16 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
          </svg>
        </div>
        <h3 className="text-slate-400 font-medium tracking-wide text-sm uppercase">Active Integrations</h3>
        <div className="mt-4 flex flex-col gap-1">
          <p className="text-3xl font-extrabold text-white tracking-tight">
            {activeIntegrationsCount} <span className="text-lg text-slate-500 font-medium">/ 3</span>
          </p>
          <div className="flex gap-2 mt-2">
            <div className={`w-2 h-2 rounded-full ${data?.integrations.google ? 'bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)]' : 'bg-slate-600'}`} title="Google"></div>
            <div className={`w-2 h-2 rounded-full ${data?.integrations.telegram ? 'bg-blue-400 shadow-[0_0_8px_rgba(96,165,250,0.8)]' : 'bg-slate-600'}`} title="Telegram"></div>
            <div className={`w-2 h-2 rounded-full ${data?.integrations.whatsapp ? 'bg-green-400 shadow-[0_0_8px_rgba(74,222,128,0.8)]' : 'bg-slate-600'}`} title="WhatsApp"></div>
          </div>
        </div>
      </div>

      {/* Total Tokens Card (Static for now, but UI ready) */}
      <div className="group relative overflow-hidden bg-gradient-to-br from-indigo-900/40 to-purple-900/40 hover:from-indigo-900/60 hover:to-purple-900/60 transition-all duration-300 backdrop-blur-xl rounded-3xl p-6 border border-indigo-500/20 hover:border-purple-500/40 shadow-xl hover:shadow-purple-500/10">
        <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
          <svg className="w-16 h-16 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
          </svg>
        </div>
        <h3 className="text-indigo-200 font-medium tracking-wide text-sm uppercase">Tokens Used</h3>
        <div className="mt-4">
          <p className="text-3xl font-extrabold text-white tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-indigo-200 to-purple-200">
            0 <span className="text-lg text-indigo-300/50 font-medium text-transparent">tokens</span>
          </p>
        </div>
      </div>
    </div>
  );
};
