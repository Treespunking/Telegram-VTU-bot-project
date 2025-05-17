const User = require('../models/User');

module.exports = (bot) => {
  bot.command('menu', async (ctx) => {
    const user = await User.findOne({ userId: ctx.from.id });
    if (!user) {
      console.log("User not found in DB.");
      return ctx.reply('Please register first using /start');
    }

    const userId = ctx.from.id;
    const isAdmin = userId === Number(process.env.ADMIN_USER_ID);

    let response = `
📋 Here are your available commands:

  /balance - 💰 Check your wallet balance

  /buy_airtime <network> <phone> <amount> - 📱 Buy airtime

  /buy_data <network> <phone> <plan_code> <amount> - 🌐 Buy data

  /fund_wallet - 💵 Get Admin's account details

  /support - 🆘 Get support

  /view_airtime_prices - 💳 Airtime price list

  /view_data_prices - 📶 Data plan prices


  
  /delete - 🗑️ Delete your account
`;

    if (isAdmin) {
      response += `
👑 Admin Commands:


  /credit <user_id> <amount> - Add funds to a user

  /deduct <user_id> <amount> - Remove funds from a user

  /set_provider <name>

  /add_provider <name> <api_key> <base_url>

  /list_providers

  /delete_provider <name>

  /create_airtime_price <network> <amount> <price>

  /create_data_price <network> <plan> <price>

  /delete_airtime_price <network> <amount>

  /delete_data_price <network> <plan>

  /list_users_csv

  /set_support <phone> <email>

  /set_bank <Bank> <Account Number> <Account Name>
  
  /view_transactions`;
    }

    ctx.reply(response);
  });
};
