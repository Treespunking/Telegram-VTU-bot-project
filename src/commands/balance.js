const Wallet = require('../models/Wallet');

module.exports = (bot) => {
  bot.command('balance', async (ctx) => {
    const userId = ctx.from.id;
    const wallet = await Wallet.findOne({ userId });

    if (!wallet) {
      return ctx.reply("Wallet not found. Please register first.");
    }

    ctx.reply(`Your wallet balance is ₦${wallet.balance.toFixed(2)}`);
  });
};

