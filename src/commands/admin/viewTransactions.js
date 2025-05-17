const Transaction = require('../../models/Transaction');
const checkAdmin = require('../../utils/checkAdmin');
const { Parser } = require('json2csv');
const fs = require('fs');
const path = require('path');

module.exports = (bot) => {
  bot.command('view_transactions', async (ctx) => {
    if (!checkAdmin(ctx)) {
      return ctx.reply('❌ You do not have admin privileges.');
    }

    // Get the filter command argument (if any)
    const filter = ctx.message.text.split(' ')[1]; // /view_transactions today | week | month

    // Prepare date filter based on the selection
    let startDate;
    const today = new Date();

    switch (filter) {
      case 'today':
        startDate = new Date(today.setHours(0, 0, 0, 0)); // Start of today
        break;
      case 'week':
        startDate = new Date(today.setDate(today.getDate() - today.getDay())); // Start of the week (Sunday)
        break;
      case 'month':
        startDate = new Date(today.setDate(1)); // Start of the month
        break;
      default:
        startDate = new Date(0); // No filter, show all transactions
    }

    try {
      // Fetch transactions based on the filter
      const transactions = await Transaction.find({ createdAt: { $gte: startDate } })
        .sort({ createdAt: -1 }); // Most recent first

      if (transactions.length === 0) {
        return ctx.reply('❌ No transactions found for the specified period.');
      }

      // Format transactions
      const formattedTransactions = transactions.map(tx => ({
        ID: tx._id.toString(),
        UserID: tx.userId,
        Type: tx.type,
        Amount: `₦${Number(tx.amount).toLocaleString('en-NG', { minimumFractionDigits: 2 })}`,
        Status: tx.status,
        Date: tx.createdAt.toLocaleString('en-NG')
      }));

      const fields = ['ID', 'UserID', 'Type', 'Amount', 'Status', 'Date'];
      const opts = { fields };
      const parser = new Parser(opts);
      const csv = parser.parse(formattedTransactions);

      // Generate filename with today's date
      const dateString = `${today.getDate().toString().padStart(2, '0')}-${(today.getMonth() + 1).toString().padStart(2, '0')}-${today.getFullYear()}`;
      const fileName = `transactions_${filter || 'all'}_${dateString}.csv`;
      const filePath = path.join(__dirname, '../../temp/', fileName);

      fs.mkdirSync(path.dirname(filePath), { recursive: true });
      fs.writeFileSync(filePath, csv);

      await ctx.replyWithDocument({ source: filePath, filename: fileName });

      // Clean up temporary file
      fs.unlinkSync(filePath);

    } catch (error) {
      console.error('Error generating transaction CSV:', error);
      ctx.reply('❌ Failed to generate transactions CSV.');
    }
  });
};
