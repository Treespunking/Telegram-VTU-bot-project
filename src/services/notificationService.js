const ADMIN_IDS = ['123456789']; // Replace with actual Telegram admin user IDs

// Notify a user via direct message
async function notifyUser(bot, userId, message) {
  try {
    await bot.telegram.sendMessage(userId, message);
  } catch (err) {
    console.error(`❌ Failed to send DM to user ${userId}:`, err.message);
  }
}

// Notify all admins of a system-level issue
async function notifyAdmins(bot, message) {
  for (const adminId of ADMIN_IDS) {
    try {
      await bot.telegram.sendMessage(adminId, `⚠️ Admin Alert: ${message}`);
    } catch (err) {
      console.error(`❌ Failed to notify admin ${adminId}:`, err.message);
    }
  }
}

module.exports = { notifyUser, notifyAdmins };
