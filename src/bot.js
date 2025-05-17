require('dotenv').config(); // Load env variables
const { Telegraf } = require('telegraf');
const connectDB = require('./database');
const registerUser = require('./services/registration');
const User = require('./models/User');
const checkAdmin = require('./utils/checkAdmin');

const bot = new Telegraf(process.env.BOT_TOKEN);

// ✅ Connect to MongoDB and auto-assign admin from .env
connectDB().then(setAdminFromEnv);

// ✅ Automatically assign admin from .env
async function setAdminFromEnv() {
  const adminId = parseInt(process.env.ADMIN_USER_ID);
  if (!adminId) return;

  const user = await User.findOne({ userId: adminId });

  if (user && !user.isAdmin) {
    user.isAdmin = true;
    await user.save();
    console.log(`✅ Made user ${adminId} an admin.`);
  } else if (!user) {
    await User.create({ userId: adminId, name: 'Admin', isAdmin: true });
    console.log(`✅ Created and assigned admin to userId ${adminId}.`);
  } else {
    console.log(`✅ Admin already set for userId ${adminId}.`);
  }
}

// ✅ Middleware: Log every incoming message
bot.use(async (ctx, next) => {
  console.log(`Message from ${ctx.from.username || ctx.from.first_name}: ${ctx.message?.text}`);
  await next();
});

// ✅ Error handling middleware
bot.catch((err, ctx) => {
  console.error('Bot error:', err);
  ctx.reply('Oops! Something went wrong. Please try again later.');
});

// ✅ Handle /start and registration
bot.start(async (ctx) => {
  const userId = ctx.from.id;
  const existingUser = await User.findOne({ userId });

  if (existingUser) {
    return ctx.reply(`👋 Welcome back, ${existingUser.name}! Type /menu to see what you can do.`);
  }

  ctx.reply(`👋 Hello! Welcome to the VTU bot.\nLet’s get you registered.\nPlease send your full name.`);

  const onText = async (ctx2) => {
    if (ctx2.from.id !== userId) return;

    try {
      const name = ctx2.message.text.trim();
      const result = await registerUser(ctx2, name);

      if (result.success) {
        ctx2.reply(`🎉 Thanks for registering, ${name}!\n💰 Your wallet balance is ₦${result.wallet.balance.toFixed(2)}\n\nType /menu to see what you can do.`);
      } else {
        ctx2.reply(`❌ Something went wrong with your registration. Please try again.`);
      }
    } catch (error) {
      console.error('Registration error:', error);
      ctx2.reply('❌ An error occurred during registration.');
    }
  };

  // Temporarily listen for the next text message from this user
  bot.on('text', onText);

  // Stop listening after 60 seconds to avoid memory leak
  setTimeout(() => {
    bot.telegram.removeListener('text', onText);
  }, 60000);
});

// ✅ Register User Commands
require('./commands/menu')(bot);
require('./commands/balance')(bot);
require('./commands/buyAirtime')(bot);
require('./commands/buyData')(bot);
require('./commands/fundWallet')(bot);
require('./commands/support')(bot);
require('./commands/viewAirtimePrices')(bot);
require('./commands/viewDataPrices')(bot);
require('./commands/delete')(bot);

// ✅ Register Admin Commands
require('./commands/admin/setProvider')(bot);
require('./commands/admin/addProvider')(bot);
require('./commands/admin/listProviders')(bot);
require('./commands/admin/deleteProvider')(bot);
require('./commands/admin/creditUser')(bot);
require('./commands/admin/deductUser')(bot);
require('./commands/admin/createAirtimePrice')(bot);
require('./commands/admin/createDataPrice')(bot);
require('./commands/admin/viewTransactions')(bot);
require('./commands/admin/deleteAirtimePrice')(bot);
require('./commands/admin/deleteDataPrice')(bot);
require('./commands/admin/listUsersCSV')(bot);
require('./commands/admin/setSupport')(bot);
require('./commands/admin/setBank')(bot);

// ✅ Enhanced /menu to show user commands
bot.command('menu', async (ctx) => {
  const user = await User.findOne({ userId: ctx.from.id });

  if (!user) {
    return ctx.reply('Please register first using /start');
  }

  let message = `📋 Available Commands:\n/menu\n/balance\n/buy_airtime\n/buy_data\n/fund_wallet\n/support\n/view_airtime_prices\n/view_data_prices\n/delete`;
  ctx.reply(message);
});

// ✅ Start bot and listen to commands
bot.launch()
  .then(() => console.log('✅ Bot started successfully!'))
  .catch((err) => console.error('❌ Error starting bot:', err));

// ✅ Graceful shutdown
process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));
