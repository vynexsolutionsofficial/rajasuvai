import pkg from 'whatsapp-web.js';
const { Client, LocalAuth } = pkg;
import qrcode from 'qrcode-terminal';

const client = new Client({
  authStrategy: new LocalAuth(),
  webVersionCache: {
    type: 'remote',
    remotePath: 'https://raw.githubusercontent.com/wppconnect-team/wa-version/main/html/2.2412.54.html',
  },
  puppeteer: {
    headless: true,
    // executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe', // Often causes crashes if path is invalid
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  }
});

let isReady = false;

client.on('qr', (qr) => {
  console.log('=======================================');
  console.log('SCAN THIS QR CODE WITH YOUR WHATSAPP:');
  console.log(' (Settings > Linked Devices > Link a Device)');
  console.log('=======================================');
  qrcode.generate(qr, { small: true });
});

client.on('ready', () => {
  console.log('=======================================');
  console.log('✅ WHATSAPP BOT IS READY!');
  console.log('=======================================');
  isReady = true;
});

client.on('authenticated', () => {
  console.log('AUTHENTICATED WITH WHATSAPP');
});

client.on('auth_failure', (msg) => {
  console.error('WHATSAPP AUTH FAILURE:', msg);
});

// client.initialize().catch(err => {
//   console.error('[WA-BOT] Failed to initialize WhatsApp client. The server will continue without WhatsApp support.');
//   console.error('[WA-BOT] Error details:', err.message);
// });

/**
 * Send OTP via WhatsApp
 */
export const sendWhatsAppOTP = async (phone, otp) => {
  if (!isReady) {
    console.warn('[WA-BOT] Bot not ready. OTP not sent via WhatsApp.');
    return { success: false, error: 'WhatsApp bot not initialized' };
  }

  try {
    // 1. Remove all non-digit characters
    let cleanPhone = phone.replace(/\D/g, '');

    // 2. Automatically add India country code (91) if it's a 10-digit number
    if (cleanPhone.length === 10) {
      cleanPhone = `91${cleanPhone}`;
    }

    // 3. Format to WhatsApp ID
    const chatId = `${cleanPhone}@c.us`;
    
    const message = `*Rajasuvai Spices*\n\nYour 6-digit verification code is: *${otp}*\n\nDo not share this code with anyone.`;
    
    // Add a tiny delay to ensure socket stability
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const msg = await client.sendMessage(chatId, message);
    console.log(`[WA-BOT] ✅ Message accepted by network. ID: ${msg.id.id}`);
    return { success: true };
  } catch (error) {
    console.error('[WA-BOT] Error sending message:', error.message);
    return { success: false, error: error.message };
  }
};

export default client;
