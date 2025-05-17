const User = require('../../models/User');
const Wallet = require('../../models/Wallet');
const checkAdmin = require('../../utils/checkAdmin');

module.exports = (bot) => {
  bot.command('deduct', async (ctx) => {
    if (!checkAdmin(ctx)) {
      return ctx.reply('❌ You do not have admin privileges.');
    }

    const parts = ctx.message.text.split(' ');
    const [_, userId, amount] = parts;

    if (!userId || !amount) {
      return ctx.reply('⚠️ Usage: /deduct <user_id> <amount>');
    }

    const user = await User.findOne({ userId });
    if (!user) {
      return ctx.reply('❌ User not found.');
    }

    const wallet = await Wallet.findOne({ userId });
    if (!wallet) {
      return ctx.reply('❌ User does not have a wallet.');
    }

    if (wallet.balance < amount) {
      return ctx.reply('❌ Insufficient balance to deduct.');
    }

    wallet.balance -= Number(amount);
    await wallet.save();

    ctx.reply(`✅ Successfully deducted ₦${amount} from ${user.name}'s wallet.`);
  });
};
