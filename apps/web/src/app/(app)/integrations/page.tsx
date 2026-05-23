import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Integrations - BOBA AGENT",
  description: "Connect your services",
};

const integrationsList = [
  {
    name: 'Google Workspace',
    description: 'Connect Drive, Docs, Sheets, Gmail, and Calendar.',
    icon: '🔗',
    gradient: 'from-blue-500/10 to-blue-600/5',
    border: 'hover:border-blue-500/30',
    buttonColor: 'from-blue-600 to-blue-500',
    connected: false,
  },
  {
    name: 'Telegram',
    description: 'Connect your Telegram bot or user account.',
    icon: '✈️',
    gradient: 'from-sky-500/10 to-sky-600/5',
    border: 'hover:border-sky-500/30',
    buttonColor: 'from-sky-600 to-sky-500',
    connected: false,
  },
  {
    name: 'WhatsApp',
    description: 'Scan QR code to connect WhatsApp.',
    icon: '💬',
    gradient: 'from-green-500/10 to-green-600/5',
    border: 'hover:border-green-500/30',
    buttonColor: 'from-green-600 to-green-500',
    connected: false,
  },
];

export default function IntegrationsPage() {
  return (
    <div className="p-8 lg:p-10 animate-fade-in">
      <header className="mb-10">
        <h1 className="text-4xl font-extrabold tracking-tight mb-2">Integrations</h1>
        <p className="text-slate-400">Connect your services to unlock the full power of BOBA AGENT.</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {integrationsList.map((item, i) => (
          <div key={i} className={`glass-card bg-gradient-to-br ${item.gradient} p-8 transition-all duration-300 hover:scale-[1.02] ${item.border}`}>
            <div className="text-4xl mb-4">{item.icon}</div>
            <h2 className="text-xl font-bold text-white mb-2">{item.name}</h2>
            <p className="text-slate-400 text-sm mb-6 leading-relaxed">{item.description}</p>
            <button className={`w-full py-3 rounded-xl bg-gradient-to-r ${item.buttonColor} font-semibold text-sm transition-all hover:scale-[1.02] shadow-lg`}>
              {item.connected ? 'Connected ✓' : `Connect ${item.name.split(' ')[0]}`}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
