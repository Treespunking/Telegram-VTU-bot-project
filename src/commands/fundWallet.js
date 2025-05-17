const User = require('../models/User');

module.exports = (bot) => {
  bot.command('fund_wallet', async (ctx) => {
    try {
      const admin = await User.findOne({ isAdmin: true });

      if (!admin || !admin.bankDetails) {
        return ctx.reply('⚠️ Admin bank details are not yet set. Please contact support.');
      }

      const { bankName, accountNumber, accountName } = admin.bankDetails;

      const message = `
🏦 *Fund Your Wallet*

Please transfer to the account below. Your wallet will be credited automatically once payment is confirmed.

*Bank Name:* ${bankName}
*Account Number:* \`${accountNumber}\`
*Account Name:* ${accountName}

📝 Use your Telegram ID as the payment reference: \`${ctx.from.id}\`

⚠️ Send proof to /support if not credited within 10 minutes.
      `;

      await ctx.replyWithMarkdown(message);
    } catch (error) {
      console.error('Error in /fund_wallet:', error);
      ctx.reply('❌ An error occurred. Please try again later or contact support.');
    }
  });
};
