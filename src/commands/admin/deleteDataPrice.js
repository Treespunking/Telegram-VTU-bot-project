const DataPriceList = require('../../models/DataPriceList');
const checkAdmin = require('../../middleware/checkAdmin');

module.exports = (bot) => {
  bot.command('delete_data_price', checkAdmin, async (ctx) => {
    const parts = ctx.message.text.split(' ');
    const [_, network, plan] = parts;

    if (!network || !plan) {
      return ctx.reply('⚠️ Usage: /delete_data_price <network> <plan>');
    }

    const result = await DataPriceList.findOneAndDelete({ network, plan });

    if (result) {
      ctx.reply(`✅ Deleted data price for ${network} plan '${plan}'`);
    } else {
      ctx.reply(`❌ No data plan found for ${network} '${plan}'`);
    }
  });
};
