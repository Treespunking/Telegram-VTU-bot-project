require('dotenv').config();

console.log("Loaded secret:", process.env.ENCRYPTION_SECRET);
console.log("Length:", Buffer.from(process.env.ENCRYPTION_SECRET, 'base64').length);
