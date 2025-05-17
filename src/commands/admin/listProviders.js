const APIProvider = require('../../models/APIProvider');
const checkAdmin = require('../../utils/checkAdmin');

module.exports = (bot) => {
  bot.command('list_providers', async (ctx) => {
    if (!checkAdmin(ctx)) {
      return ctx.reply('❌ You do not have admin privileges.');
    }

    const providers = await APIProvider.find();
    if (providers.length === 0) {
      return ctx.reply('❌ No providers found.');
    }

    const providerList = providers.map((provider) => `${provider.name} (Active: ${provider.active})`).join('\n');
    ctx.reply(`Here are the available providers:\n\n${providerList}`);
  });
};
