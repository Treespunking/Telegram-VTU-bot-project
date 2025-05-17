const User = require('../models/User');

module.exports = async function checkAdmin(ctx, next) {
  const user = await User.findOne({ userId: ctx.from.id });
  if (user?.isAdmin) {
    return next();
  } else {
    return ctx.reply("⛔ You are not authorized to use this command.");
  }
};
