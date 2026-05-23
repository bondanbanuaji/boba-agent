import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Logs - BOBA AGENT",
  description: "View action logs",
};

const sampleLogs = [
  { time: '10 mins ago', service: 'Gmail', serviceBg: 'bg-blue-900/50 text-blue-300', action: 'send_email', status: 'Success', statusColor: 'text-green-400' },
  { time: '1 hour ago', service: 'Drive', serviceBg: 'bg-yellow-900/50 text-yellow-300', action: 'search_files', status: 'Success', statusColor: 'text-green-400' },
  { time: '3 hours ago', service: 'Telegram', serviceBg: 'bg-sky-900/50 text-sky-300', action: 'send_message', status: 'Success', statusColor: 'text-green-400' },
];

export default function LogsPage() {
  return (
    <div className="p-8 lg:p-10 animate-fade-in">
      <header className="mb-10">
        <h1 className="text-4xl font-extrabold tracking-tight mb-2">Action Logs</h1>
        <p className="text-slate-400">Track every action performed by your AI agent.</p>
      </header>

      <div className="glass-card overflow-hidden">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-slate-700/50">
              <th className="p-5 text-sm font-semibold text-slate-400 uppercase tracking-wide">Time</th>
              <th className="p-5 text-sm font-semibold text-slate-400 uppercase tracking-wide">Service</th>
              <th className="p-5 text-sm font-semibold text-slate-400 uppercase tracking-wide">Action</th>
              <th className="p-5 text-sm font-semibold text-slate-400 uppercase tracking-wide">Status</th>
            </tr>
          </thead>
          <tbody>
            {sampleLogs.map((log, i) => (
              <tr key={i} className="border-t border-slate-800/50 hover:bg-slate-800/20 transition-colors">
                <td className="p-5 text-slate-400 text-sm">{log.time}</td>
                <td className="p-5"><span className={`${log.serviceBg} px-3 py-1 rounded-lg text-xs font-medium`}>{log.service}</span></td>
                <td className="p-5 text-sm font-mono text-slate-300">{log.action}</td>
                <td className="p-5"><span className={`${log.statusColor} text-sm font-medium`}>{log.status}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
