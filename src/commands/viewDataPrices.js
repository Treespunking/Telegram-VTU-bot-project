const DataPrice = require('../models/DataPriceList');

module.exports = (bot) => {
  bot.command('view_data_prices', async (ctx) => {
    const plans = await DataPrice.find();
    if (plans.length === 0) return ctx.reply("No data prices available.");

    const msg = plans.map(p => `🌐 ${p.network} - ${p.plan}: ₦${p.price}`).join('\n');
    ctx.reply(msg);
  });
};
