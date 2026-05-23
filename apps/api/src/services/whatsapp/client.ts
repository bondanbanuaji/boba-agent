import { makeWASocket, useMultiFileAuthState, DisconnectReason, fetchLatestBaileysVersion, Browsers } from "@whiskeysockets/baileys";
import { Boom } from "@hapi/boom";

// Store QR code globally so the API route can serve it
export let currentQR: string | null = null;
export let isConnected = false;
export let waSocket: ReturnType<typeof makeWASocket> | null = null;

export const startWhatsAppClient = async () => {
  const { state, saveCreds } = await useMultiFileAuthState("wa_auth_info");
  const { version, isLatest } = await fetchLatestBaileysVersion();
  
  console.log(`[WhatsApp] using WA v${version.join('.')}, isLatest: ${isLatest}`);

  const sock = makeWASocket({
    version,
    auth: state,
    printQRInTerminal: false, 
    browser: Browsers.ubuntu("Desktop"),
    syncFullHistory: false,
    generateHighQualityLinkPreview: true,
  });

  waSocket = sock;

  sock.ev.on("creds.update", saveCreds);

  sock.ev.on("connection.update", async (update) => {
    const { connection, lastDisconnect, qr } = update;
    
    if (qr) {
      console.log("[WhatsApp] QR Code received");
      currentQR = qr; // Save to serve via API
    }

    if (connection === "close") {
      isConnected = false;
      const shouldReconnect = (lastDisconnect?.error as Boom)?.output?.statusCode !== DisconnectReason.loggedOut;
      console.log("[WhatsApp] Connection closed due to", lastDisconnect?.error, ", reconnecting:", shouldReconnect);
      
      // Reconnect if not logged out
      if (shouldReconnect) {
        setTimeout(startWhatsAppClient, 5000);
      } else {
        console.log("[WhatsApp] Logged out. Restart to get new QR.");
        currentQR = null;
      }
    } else if (connection === "open") {
      console.log("[WhatsApp] Connection opened successfully");
      isConnected = true;
      currentQR = null; // Clear QR as we are connected
    }
  });

  sock.ev.on("messages.upsert", async ({ messages, type }) => {
    if (type !== "notify") return;
    
    for (const msg of messages) {
      if (!msg.message || msg.key.fromMe) continue;

      const remoteJid = msg.key.remoteJid;
      const textMessage = msg.message.conversation || msg.message.extendedTextMessage?.text || "";
      
      if (!textMessage) continue;

      console.log(`[WhatsApp] Received message from ${remoteJid}: ${textMessage}`);
      
      try {
        // In full implementation: orchestrator.handleMessage(...)
        // For now, simulate typing and echo response
        await sock.sendPresenceUpdate("composing", remoteJid!);
        await new Promise(resolve => setTimeout(resolve, 1000));
        await sock.sendMessage(remoteJid!, { text: `Agent processed: "${textMessage}"` });
      } catch (err) {
        console.error("[WhatsApp] Error processing message:", err);
      }
    }
  });

  return sock;
};

// Tool Methods for Agent
export const sendWhatsAppMessage = async (jid: string, text: string) => {
  if (!waSocket || !isConnected) throw new Error("WhatsApp client is not connected");
  
  // Basic validation for JID
  const targetJid = jid.includes("@s.whatsapp.net") || jid.includes("@g.us") 
    ? jid 
    : `${jid}@s.whatsapp.net`;
    
  return await waSocket.sendMessage(targetJid, { text });
};

export const sendWhatsAppMedia = async (jid: string, mediaUrl: string, caption?: string) => {
  if (!waSocket || !isConnected) throw new Error("WhatsApp client is not connected");
  
  const targetJid = jid.includes("@s.whatsapp.net") || jid.includes("@g.us") 
    ? jid 
    : `${jid}@s.whatsapp.net`;
    
  return await waSocket.sendMessage(targetJid, { 
    image: { url: mediaUrl },
    caption 
  });
};
