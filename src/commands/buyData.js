const { sendData } = require('../services/vtuService');
const withRetry = require('../utils/retry');

module.exports = (bot) => {
  bot.command('buy_data', async (ctx) => {
    const parts = ctx.message.text.split(' ');
    const [_, network, phone, planCode, amount] = parts;

    if (!network || !phone || !planCode || !amount) {
      return ctx.reply("⚠️ Usage: /buy_data <network> <phone> <plan_code> <amount>");
    }

    try {
      const tx = await withRetry(() =>
        sendData({
          bot,
          userId: ctx.from.id,
          phone,
          network,
          plan: {
            code: planCode,
            amount: Number(amount)
          }
        })
      );

      if (tx.status === 'SUCCESS') {
        ctx.reply(`✅ Data sent to ${phone} on ${network} (plan: ${planCode}).`);
      } else {
        ctx.reply(`❌ Failed to send data. Try again.`);
      }
    } catch (error) {
      console.error('Data Error:', error.message);
      ctx.reply(`❌ Data purchase failed due to an error.`);
    }
  });
};
