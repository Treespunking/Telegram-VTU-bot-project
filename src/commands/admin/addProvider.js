const APIProvider = require('../../models/APIProvider');
const checkAdmin = require('../../utils/checkAdmin');

module.exports = (bot) => {
  bot.command('add_provider', async (ctx) => {
    if (!checkAdmin(ctx)) {
      return ctx.reply('❌ You do not have admin privileges.');
    }

    const parts = ctx.message.text.split(' ');
    const [_, providerName, apiKey, baseUrl] = parts;

    if (!providerName || !apiKey || !baseUrl) {
      return ctx.reply('⚠️ Usage: /add_provider <provider_name> <api_key> <base_url>');
    }

    // 🔐 Create and save new provider with encrypted keys
    const newProvider = new APIProvider({
      name: providerName,
      keys: { apiKey }, // Encryption happens automatically on save
      baseUrl,
      active: false,
    });

    try {
      await newProvider.save();

      // 🔓 Retrieve and access decrypted value to confirm
      const savedProvider = await APIProvider.findOne({ name: providerName });

      // You can comment this out if you don't want to log secrets
      console.log('Decrypted API key:', savedProvider.keys.apiKey);

      ctx.reply(`✅ New provider '${providerName}' has been securely added.`);
    } catch (error) {
      console.error('Error saving provider:', error);
      ctx.reply('❌ Failed to add provider. Please check the inputs or try again.');
    }
  });
};
