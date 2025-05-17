const DataPriceList = require('../../models/DataPriceList');
const checkAdmin = require('../../utils/checkAdmin');

module.exports = (bot) => {
  bot.command('create_data_price', async (ctx) => {
    if (!checkAdmin(ctx)) {
      return ctx.reply('❌ You do not have admin privileges.');
    }

    const parts = ctx.message.text.split(' ');
    const [_, network, plan, price] = parts;

    if (!network || !plan || !price) {
      return ctx.reply('⚠️ Usage: /create_data_price <network> <plan> <price>');
    }

    let dataPrice = await DataPriceList.findOne({ network, plan });
    if (dataPrice) {
      dataPrice.price = price;
    } else {
      dataPrice = new DataPriceList({ network, plan, price });
    }

    await dataPrice.save();
    ctx.reply(`✅ Data price for ${network} ${plan} updated to ₦${price}`);
  });
};
