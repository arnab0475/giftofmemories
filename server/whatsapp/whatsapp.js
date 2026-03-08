import pkg from "whatsapp-web.js";
const { Client, LocalAuth, MessageMedia } = pkg;
import qrcode from "qrcode-terminal";
import fs from "fs";

let currentQr = null;
let currentStatus = 'disconnected';

const client = new Client({
  authStrategy: new LocalAuth(),
  puppeteer: { headless: true }
});

client.on("qr", (qr) => {
  currentQr = qr;
  currentStatus = 'qr_needed';
  console.log("WhatsApp QR code generated, scan with your phone:");
  qrcode.generate(qr, { small: true });
});

client.on("ready", () => {
  currentQr = null;
  currentStatus = 'connected';
  console.log("✓ WhatsApp client ready");
});

client.on("authenticated", () => {
  currentQr = null;
  currentStatus = 'authenticated';
  console.log("✓ WhatsApp authenticated");
});

client.on("auth_failure", msg => {
  currentStatus = 'disconnected';
  console.error("✗ WhatsApp authentication failure:", msg);
});

client.on("disconnected", () => {
  currentStatus = 'disconnected';
  console.warn("⚠ WhatsApp disconnected, attempting reconnect...");
  startClient();
});

export function startClient() {
  return client.initialize().catch(err => {
    const msg = err && err.message ? err.message : String(err);
    if (msg.includes("already running")) {
      console.warn("⚠ WhatsApp browser already running, initialization skipped.");
      return;
    }
    console.error("✗ WhatsApp client initialization error:", msg);
  });
}

export async function sendWhatsAppMessage(phone, message, imagePath = null) {
  try {
    const formattedPhone = phone.includes('@c.us') ? phone : `${phone}@c.us`;
    
    if (!client.info) {
      console.error(`✗ WhatsApp client not ready yet for ${formattedPhone}`);
      return false;
    }

    if (imagePath && fs.existsSync(imagePath)) {
      const media = MessageMedia.fromFilePath(imagePath);
      await client.sendMessage(formattedPhone, media, { caption: message });
      console.log(`✓ Message with image sent to ${formattedPhone}`);
    } else {
      await client.sendMessage(formattedPhone, message);
      console.log(`✓ Message sent to ${formattedPhone}`);
    }
    return true;
  } catch (err) {
    console.error(`✗ Error sending WhatsApp message to ${phone}:`, err.message);
    return false;
  }
}

export const getQr = () => currentQr;
export const getStatus = () => currentStatus;
export { client };