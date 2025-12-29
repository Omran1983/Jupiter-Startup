import TelegramBot from 'node-telegram-bot-api';

// This will be set by the User later
// const token = process.env.TELEGRAM_BOT_TOKEN;

export class TelegramService {
    private bot: TelegramBot | null = null;

    constructor() {
        const token = process.env.TELEGRAM_BOT_TOKEN;
        if (token) {
            this.bot = new TelegramBot(token, { polling: false }); // We only send, don't poll in this serverless context usually
        }
    }

    async sendAlert(chatId: string, message: string) {
        if (!this.bot) {
            console.log("[Telegram] Mock Send: Token not configured.", message);
            return;
        }
        try {
            await this.bot.sendMessage(chatId, message);
        } catch (e) {
            console.error("[Telegram] Failed to send message", e);
        }
    }

    // Generate a deep link for the user to start the bot
    // format: https://t.me/YourBotName?start=trackingID
    getBotLink(trackingNumber: string): string {
        const botName = process.env.NEXT_PUBLIC_TELEGRAM_BOT_NAME || "CustomsTrackerBot";
        return `https://t.me/${botName}?start=${trackingNumber}`;
    }
}
