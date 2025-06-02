# Telegram VTU Bot for Nigerian Telecom Services

This is a **Telegram-based VTU (Virtual Top-Up) bot system** designed for the Nigerian market. It enables users to register, purchase airtime and data, manage wallets, and receive customer support , all through a Telegram interface. Admins can manage providers, pricing, and users directly via Telegram commands.

---

## Features

### For Users

- Register via Telegram
- Check wallet balance
- Fund wallet via manual crediting
- Buy Airtime & Data (MTN, Glo, Airtel, 9mobile)
- View airtime/data prices
- Contact support

### 🛠 For Admins

- Add, list, and remove VTU providers
- Set and delete airtime/data prices
- Credit and deduct from user wallets
- Export users list (CSV)
- View transactions
- Update support and bank details

### 🔧 System Features

- Modular service-based structure
- MongoDB data persistence (via Mongoose models)
- Environment-based configuration
- Retry logic for API resiliency
- Middleware for admin access control

---

## Project Structure

```
├── .env                        # Environment variables
├── bot.js                      # Entry point for the Telegram bot
├── commands/                  # Telegram bot commands
│   ├── admin/                 # Admin-only commands
│   └── ...                    # User commands
├── middleware/                # Access control (e.g., admin check)
├── models/                    # Mongoose models (User, Transaction, etc.)
├── services/                  # Business logic (VTU, notifications, registration)
├── utils/                     # Helpers (retry logic, DB connection)
├── routes/                    # Webhooks or external API routes (optional)
├── package.json               # Node.js metadata and dependencies
```

---

## Installation

```bash
git clone https://github.com/your-username/telegram-vtu-bot.git
cd telegram-vtu-bot
npm install
cp .env.example .env  # Add your config values
node bot.js
```

---

## Configuration

Create a `.env` file in the root directory with values like:

```
BOT_TOKEN=your_telegram_bot_token
MONGO_URI=your_mongodb_connection_string
...
```

---

## Testing

```bash
node testSecret.js     # Example utility to verify secrets
```

---

## Contributing

Pull requests are welcome! Please open an issue first to discuss what you would like to change or add.

---

## License

[MIT](LICENSE)

---

## Support

Use the `/support` command in the Telegram bot or contact the admin via the configured support line.
