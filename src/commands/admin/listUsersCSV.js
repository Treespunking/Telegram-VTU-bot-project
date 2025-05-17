const User = require('../../models/User');
const checkAdmin = require('../../utils/checkAdmin');
const fs = require('fs');
const path = require('path');

module.exports = (bot) => {
  bot.command('list_users_csv', async (ctx) => {
    const userId = ctx.from.id;

    // Check if user is admin
    const isAdmin = await checkAdmin(ctx);
    if (!isAdmin) {
      return ctx.reply('❌ You are not authorized to use this command.');
    }

    // Fetch all users
    const users = await User.find();

    if (users.length === 0) {
      return ctx.reply('No registered users found.');
    }

    // Prepare CSV content
    let csvContent = 'S/N,Name,User ID\n'; // CSV Header
    users.forEach((user, index) => {
      csvContent += `${index + 1},"${user.name}",${user.userId}\n`;
    });

    // Save content into a temporary CSV file
    const filePath = path.join(__dirname, '../../temp_users_list.csv');
    fs.writeFileSync(filePath, csvContent);

    // Send the CSV file
    await ctx.replyWithDocument({ source: filePath, filename: 'registered_users.csv' });

    // Clean up: delete the file after sending
    fs.unlinkSync(filePath);
  });
};
