export const sendSMS = async ({
  to,
  message,
}: {
  to: string;
  message: string;
}): Promise<void> => {
  if (process.env.TWILIO_ACCOUNT_SID && process.env.TWILIO_AUTH_TOKEN) {
    try {
      const twilio = await import('twilio');
      const client = twilio.default(
        process.env.TWILIO_ACCOUNT_SID,
        process.env.TWILIO_AUTH_TOKEN
      );
      await client.messages.create({
        body: message,
        from: process.env.TWILIO_PHONE_NUMBER,
        to,
      });
      console.log(`📱 SMS sent to ${to}`);
    } catch (error) {
      console.error('Failed to send SMS via Twilio:', error);
    }
  } else {
    console.log(`📱 [DEV SMS] To: ${to} — Message: ${message}`);
  }
};
