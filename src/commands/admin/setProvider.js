const APIProvider = require('../../models/APIProvider');
const checkAdmin = require('../../middleware/checkAdmin');

module.exports = (bot) => {
  bot.command('set_provider', checkAdmin, async (ctx) => {
    const parts = ctx.message.text.split(' ');
    const [_, providerName] = parts;

    if (!providerName) {
      return ctx.reply('⚠️ Usage: /set_provider <provider_name>');
    }

    const provider = await APIProvider.findOne({ name: providerName });
    if (!provider) {
      return ctx.reply('❌ Provider not found.');
    }

    // Deactivate all others
    await APIProvider.updateMany({}, { active: false });

    // Activate selected
    provider.active = true;
    await provider.save();

    ctx.reply(`✅ ${providerName} has been set as the active VTU provider.`);
  });
};
