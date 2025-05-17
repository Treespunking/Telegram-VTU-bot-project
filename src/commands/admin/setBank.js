const checkAdmin = require('../../utils/checkAdmin');
const User = require('../../models/User');

module.exports = (bot) => {
  bot.command('set_bank', async (ctx) => {
    try {
      const isAdmin = checkAdmin(ctx);  // ✅ Fixed here

      if (!isAdmin) {
        return ctx.reply('❌ You are not authorized to use this command.');
      }

      const args = ctx.message.text.split(' ').slice(1);
      if (args.length < 3) {
        return ctx.reply('❌ Usage:\n/set_bank <Bank Name> <Account Number> <Account Name>');
      }

      const [bankName, accountNumber, ...accountNameParts] = args;
      const accountName = accountNameParts.join(' ');

      await User.findOneAndUpdate(
        { userId: ctx.from.id },
        {
          $set: {
            bankDetails: {
              bankName,
              accountNumber,
              accountName,
            },
          },
        },
        { new: true }
      );

      ctx.reply(`✅ Bank details updated successfully:\nBank: ${bankName}\nAccount Number: ${accountNumber}\nAccount Name: ${accountName}`);
    } catch (error) {
      console.error('Error in /set_bank:', error);
      ctx.reply('❌ An error occurred while setting bank details.');
    }
  });
};
