const User = require('../models/User');
const Wallet = require('../models/Wallet');

module.exports = (bot) => {
  bot.command('delete', async (ctx) => {
    const userId = ctx.from.id;

    try {
      // Check if the user exists in the database
      const user = await User.findOne({ userId });

      if (!user) {
        return ctx.reply('❌ You are not registered yet.');
      }

      // Delete the user and their wallet from the database
      await User.deleteOne({ userId });
      await Wallet.deleteOne({ userId });

      // Notify the user that their account has been deleted
      ctx.reply('🔴 Your account has been deleted. You can now restart registration by typing /start.');
    } catch (error) {
      console.error('Error deleting user:', error);
      ctx.reply('❌ An error occurred while deleting your account. Please try again.');
    }
  });
};
