const AirtimePrice = require('../models/AirtimePriceList');

module.exports = (bot) => {
  bot.command('view_airtime_prices', async (ctx) => {
    const prices = await AirtimePrice.find();
    if (prices.length === 0) return ctx.reply("No prices found.");

    const message = prices.map(p => `📱 ${p.network}: ₦${p.price} for ₦${p.amount}`).join('\n');
    ctx.reply(message);
  });
};
