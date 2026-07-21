// Mock notification service for Email, SMS, and WhatsApp

export const sendMail = async (to: string, subject: string, html: string) => {
  console.log(`\n============== MOCK EMAIL SENT ==============`);
  console.log(`To:      ${to}`);
  console.log(`Subject: ${subject}`);
  console.log(`Body Snippet: ${html.replace(/<[^>]*>/g, ' ').substring(0, 150)}...`);
  console.log(`=============================================\n`);
  return true;
};

export const sendSMS = async (phone: string, text: string) => {
  console.log(`\n[MOCK SMS SENT] To: ${phone} | Message: ${text}`);
  return true;
};

export const sendWhatsApp = async (phone: string, text: string) => {
  console.log(`\n[MOCK WHATSAPP SENT] To: ${phone} | Message: ${text}`);
  return true;
};
