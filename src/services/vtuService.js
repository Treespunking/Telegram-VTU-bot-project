const axios = require('axios');
const APIProvider = require('../models/APIProvider');
const Transaction = require('../models/Transaction');
const { notifyUser, notifyAdmins } = require('./notificationService');

// ✅ Get currently active VTU provider
async function getActiveProvider() {
  return await APIProvider.findOne({ active: true });
}

// ✅ Handle airtime purchase
async function sendAirtime({ bot, userId, phone, amount, network }) {
  const provider = await getActiveProvider();

  const transaction = await Transaction.create({
    userId,
    type: 'AIRTIME',
    phone,
    amount,
    network,
    provider: provider.name,
  });

  try {
    const response = await axios.post(`${provider.baseUrl}/airtime`, {
      apiKey: provider.keys.apiKey,
      phone,
      amount,
      network
    });

    transaction.status = response.data.status === 'success' ? 'SUCCESS' : 'FAILED';
    await transaction.save();

    if (transaction.status === 'SUCCESS') {
      await notifyUser(bot, userId, `✅ Airtime of ₦${amount} sent to ${phone} on ${network}.`);
    } else {
      await notifyUser(bot, userId, `❌ Failed to send airtime to ${phone}. Try again.`);
      await notifyAdmins(bot, `❌ Airtime transaction failed for user ${userId}. Status: ${response.data.status}`);
    }

    return transaction;
  } catch (err) {
    transaction.status = 'FAILED';
    await transaction.save();

    await notifyUser(bot, userId, `❌ Failed to send airtime to ${phone}. Try again.`);
    await notifyAdmins(bot, `❌ Airtime transaction error for user ${userId}. Reason: ${err.message}`);
    throw err;
  }
}

// ✅ Handle data purchase
async function sendData({ bot, userId, phone, plan, network }) {
  const provider = await getActiveProvider();

  const transaction = await Transaction.create({
    userId,
    type: 'DATA',
    phone,
    amount: plan.amount,
    network,
    provider: provider.name,
  });

  try {
    const response = await axios.post(`${provider.baseUrl}/data`, {
      apiKey: provider.keys.apiKey,
      phone,
      plan: plan.code,
      network
    });

    transaction.status = response.data.status === 'success' ? 'SUCCESS' : 'FAILED';
    await transaction.save();

    if (transaction.status === 'SUCCESS') {
      await notifyUser(bot, userId, `✅ Data plan '${plan.code}' sent to ${phone} on ${network}.`);
    } else {
      await notifyUser(bot, userId, `❌ Failed to send data to ${phone}. Try again.`);
      await notifyAdmins(bot, `❌ Data transaction failed for user ${userId}. Status: ${response.data.status}`);
    }

    return transaction;
  } catch (err) {
    transaction.status = 'FAILED';
    await transaction.save();

    await notifyUser(bot, userId, `❌ Failed to send data to ${phone}. Try again.`);
    await notifyAdmins(bot, `❌ Data transaction error for user ${userId}. Reason: ${err.message}`);
    throw err;
  }
}

// ✅ Export all functions
module.exports = {
  getActiveProvider,
  sendAirtime,
  sendData
};
