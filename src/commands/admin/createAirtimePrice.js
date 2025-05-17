const AirtimePriceList = require('../../models/AirtimePriceList');
const checkAdmin = require('../../utils/checkAdmin');

module.exports = (bot) => {
  bot.command('create_airtime_price', async (ctx) => {
    if (!checkAdmin(ctx)) {
      return ctx.reply('❌ You do not have admin privileges.');
    }

    const parts = ctx.message.text.split(' ');
    const [_, network, amount, price] = parts;

    if (!network || !amount || !price) {
      return ctx.reply('⚠️ Usage: /create_airtime_price <network> <amount> <price>');
    }

    let airtimePrice = await AirtimePriceList.findOne({ network, amount });
    if (airtimePrice) {
      airtimePrice.price = price;
    } else {
      airtimePrice = new AirtimePriceList({ network, amount, price });
    }

    await airtimePrice.save();
    ctx.reply(`✅ Airtime price for ${network} ₦${amount} updated to ₦${price}`);
  });
};
