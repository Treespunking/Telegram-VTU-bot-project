const APIProvider = require('../../models/APIProvider');
const checkAdmin = require('../../utils/checkAdmin');

module.exports = (bot) => {
  bot.command('delete_provider', async (ctx) => {
    if (!checkAdmin(ctx)) {
      return ctx.reply('❌ You do not have admin privileges.');
    }

    const parts = ctx.message.text.split(' ');
    const [_, providerName] = parts;

    if (!providerName) {
      return ctx.reply('⚠️ Usage: /delete_provider <provider_name>');
    }

    const provider = await APIProvider.findOne({ name: providerName });
    if (!provider) {
      return ctx.reply('❌ Provider not found.');
    }

    await provider.remove();
    ctx.reply(`✅ Provider '${providerName}' has been deleted.`);
  });
};
