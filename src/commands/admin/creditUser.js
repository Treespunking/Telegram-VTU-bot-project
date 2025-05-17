const User = require('../../models/User');
const Wallet = require('../../models/Wallet');
const Transaction = require('../../models/Transaction'); // Optional, for logging
const checkAdmin = require('../../utils/checkAdmin');

module.exports = (bot) => {
  bot.command('credit', async (ctx) => {
    if (!checkAdmin(ctx)) {
      return ctx.reply('❌ You do not have admin privileges.');
    }

    const parts = ctx.message.text.split(' ');
    const [_, userId, amountStr] = parts;

    const amount = Number(amountStr);
    if (!userId || isNaN(amount) || amount <= 0) {
      return ctx.reply('⚠️ Usage: /credit <user_id> <amount>');
    }

    const user = await User.findOne({ userId });
    if (!user) {
      return ctx.reply('❌ User not found.');
    }

    const wallet = await Wallet.findOne({ userId });
    if (!wallet) {
      return ctx.reply('❌ User does not have a wallet.');
    }

    await Wallet.updateOne(
      { userId },
      { $inc: { balance: amount } }
    );

    // Optional: log the credit as a transaction
    await Transaction.create({
      userId,
      type: 'FUNDING',
      amount,
      status: 'success'
    });

    ctx.reply(`✅ Successfully credited ₦${amount} to ${user.name}'s wallet.`);
  });
};
