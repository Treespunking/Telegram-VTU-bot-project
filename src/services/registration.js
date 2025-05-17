const User = require('../models/User');
const Wallet = require('../models/Wallet');

async function registerUser(ctx, name) {
  const userId = ctx.from.id;

  try {
    // Optional: check if user already exists
    const existingUser = await User.findOne({ userId });
    if (existingUser) {
      return { success: false };
    }

    // Create user
    const newUser = new User({
      userId,
      name,
      isAdmin: false,
    });
    await newUser.save();

    // Create wallet
    const newWallet = new Wallet({
      userId,
      balance: 0,
    });
    await newWallet.save();

    return { success: true, wallet: newWallet };
  } catch (error) {
    console.error('Registration error:', error);
    return { success: false };
  }
}

module.exports = registerUser;
