import pkg from "whatsapp-web.js";
const { Client, LocalAuth, MessageMedia } = pkg;
import { broadcastStatus } from "./statusBroadcaster.js";

let currentQr = null;
let currentStatus = 'disconnected';

export const client = new Client({
  authStrategy: new LocalAuth(),
  qrMaxRetries: 5, // Prevents excessive QR generation which can trigger a "Try again later"
  puppeteer: { 
    headless: true,
    args: [
      '--no-sandbox', 
      '--disable-setuid-sandbox', 
      '--disable-dev-shm-usage',
      '--disable-accelerated-2d-canvas', 
      '--no-first-run', 
      '--no-zygote', 
      '--disable-gpu',
      '--unhandled-rejections=strict'
    ]
  },
  // THE FIX: Forcing a stable, up-to-date web version to avoid "Couldn't link device"
  webVersionCache: {
    type: 'remote',
    remotePath: 'https://raw.githubusercontent.com/wppconnect-team/wa-version/main/html/2.3000.1018512411-alpha.html'
  }
});

// --- EVENT LISTENERS ---

client.on("qr", (qr) => {
  currentQr = qr;
  currentStatus = 'qr_needed';
  broadcastStatus(currentStatus, { qr });
  console.log("⚠ WhatsApp QR Code generated. Please scan immediately.");
});

client.on("ready", () => {
  currentQr = null;
  currentStatus = 'connected';
  broadcastStatus(currentStatus);
  console.log("✓ WhatsApp client ready & connected.");
});

client.on("authenticated", () => {
  currentQr = null;
  currentStatus = 'authenticated';
  broadcastStatus(currentStatus);
  console.log("✓ WhatsApp Authenticated.");
});

client.on("auth_failure", msg => {
  currentStatus = 'disconnected';
  broadcastStatus(currentStatus, { error: "Authentication Failure" });
  console.error("✗ WhatsApp authentication failure:", msg);
});

client.on("disconnected", (reason) => {
  currentStatus = 'disconnected';
  broadcastStatus(currentStatus);
  console.warn(`⚠ WhatsApp disconnected (Reason: ${reason}). Re-initializing...`);
  // Delay re-initialization to avoid spamming the server
  setTimeout(() => startClient(), 5000);
});

export function startClient() {
  console.log("🔄 Initializing WhatsApp client engine...");
  return client.initialize().catch(err => {
    if (err.message?.includes("already running")) return;
    console.error("✗ WhatsApp client initialization error:", err);
  });
}

export async function sendWhatsAppMessage(phone, message, imageUrl = null) {
  try {
    if (!phone || !message) return { success: false, error: "Phone and message are required" };
    
    let cleanPhone = phone.replaceAll(/\D/g, ''); 
    const formattedPhone = cleanPhone.includes('@c.us') ? cleanPhone : `${cleanPhone}@c.us`;
    
    if (currentStatus !== 'connected') {
      console.error(`❌ Cannot send message. WhatsApp is ${currentStatus}`);
      return { success: false, error: "Client not connected" };
    }

    if (imageUrl) {
      try {
        const media = await MessageMedia.fromUrl(imageUrl);
        await client.sendMessage(formattedPhone, media, { caption: message });
        console.log(`✅ Media message sent successfully to ${formattedPhone}`);
        return { success: true };
      } catch (imageError) {
        console.error(`❌ Failed to send image: ${imageError.message}`);
        // Fallback to sending just text if image fails
      }
    }

    await client.sendMessage(formattedPhone, message);
    console.log(`✅ Text message sent successfully to ${formattedPhone}`);
    return { success: true };
  } catch (err) {
    console.error(`✗ Error sending message to ${phone}:`, err.message);
    return { success: false, error: err.message };
  }
}

export const getQr = () => currentQr;
export const getStatus = () => currentStatus;