const checkAdmin = require('../../utils/checkAdmin'); // Import checkAdmin
const User = require('../../models/User');

// Default support contact details
let supportPhoneNumber = "09012345678"; // Default phone number
let supportEmail = "support@vtubot.ng"; // Default email

module.exports = (bot) => {
  // User support command to show the current support details
  bot.command('support', (ctx) => {
    ctx.reply(`Need help? Reach out to us:\n📞 ${supportPhoneNumber}\n📧 ${supportEmail}`);
  });

  // Admin command to update the support details
  bot.command('set_support', async (ctx) => {
    // Check if user is admin
    if (!checkAdmin(ctx)) {
      return ctx.reply('❌ You do not have admin privileges.');
    }

    const messageParts = ctx.message.text.split(' ');
    if (messageParts.length < 3) {
      return ctx.reply('❌ Invalid format. Please use /set_support <phone_number> <email>');
    }

    const newPhoneNumber = messageParts[1];
    const newEmail = messageParts[2];

    // Validate phone number (11 digits) and email (basic validation)
    const phoneRegex = /^[0-9]{11}$/; // Updated to 11 digits
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // Simple email validation

    if (!phoneRegex.test(newPhoneNumber)) {
      return ctx.reply('❌ Invalid phone number format. Please enter a valid 11-digit number.');
    }

    if (!emailRegex.test(newEmail)) {
      return ctx.reply('❌ Invalid email format. Please enter a valid email address.');
    }

    // Update the support details
    supportPhoneNumber = newPhoneNumber;
    supportEmail = newEmail;

    // Optionally, you can update the details in the database if needed:
    // await User.findOneAndUpdate(
    //   { userId: ctx.from.id },
    //   { $set: { supportDetails: { phone: supportPhoneNumber, email: supportEmail } } },
    //   { new: true }
    // );

    ctx.reply(`✅ Support contact information updated successfully!\n📞 ${supportPhoneNumber}\n📧 ${supportEmail}`);
  });
};
