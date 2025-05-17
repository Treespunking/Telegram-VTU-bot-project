const { sendAirtime } = require('../services/vtuService');
const withRetry = require('../utils/retry');

module.exports = (bot) => {
  bot.command('buy_airtime', async (ctx) => {
    const parts = ctx.message.text.split(' ');
    const [_, network, phone, amount] = parts;

    if (!network || !phone || !amount) {
      return ctx.reply("⚠️ Usage: /buy_airtime <network> <phone> <amount>");
    }

    try {
      const tx = await withRetry(() =>
        sendAirtime({
          bot,
          userId: ctx.from.id,
          phone,
          amount: Number(amount),
          network
        })
      );

      if (tx.status === 'SUCCESS') {
        ctx.reply(`✅ Airtime of ₦${amount} sent to ${phone} on ${network}.`);
      } else {
        ctx.reply(`❌ Airtime purchase failed. Please try again.`);
      }
    } catch (error) {
      console.error('Airtime Error:', error.message);
      ctx.reply(`❌ An error occurred while processing your airtime.`);
    }
  });
};
