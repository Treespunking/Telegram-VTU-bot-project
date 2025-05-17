const AirtimePriceList = require('../../models/AirtimePriceList');
const checkAdmin = require('../../middleware/checkAdmin');

module.exports = (bot) => {
  bot.command('delete_airtime_price', checkAdmin, async (ctx) => {
    const parts = ctx.message.text.split(' ');
    const [_, network, amount] = parts;

    if (!network || !amount) {
      return ctx.reply('⚠️ Usage: /delete_airtime_price <network> <amount>');
    }

    const result = await AirtimePriceList.findOneAndDelete({ network, amount: Number(amount) });

    if (result) {
      ctx.reply(`✅ Deleted airtime price for ${network} ₦${amount}`);
    } else {
      ctx.reply(`❌ No airtime price found for ${network} ₦${amount}`);
    }
  });
};
