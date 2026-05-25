const { Client, GatewayIntentBits } = require('discord.js');
const fs = require('fs');
const { BOT_TOKEN } = require('./config.js');

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent
  ]
});

// Load event handlers
const eventFiles = fs.readdirSync('./events').filter(file => file.endsWith('.js'));
for (const file of eventFiles) {
  const event = require(`./events/${file}`);
  if (event.once) {
    client.once(event.name, (...args) => event.execute(...args, client));
  } else {
    client.on(event.name, (...args) => event.execute(...args, client));
  }
}

// Login to Discord
client.login(BOT_TOKEN)
  .then(() => {
    console.log('✅ Bot connected successfully');
  })
  .catch(error => {
    console.error('❌ Failed to login:', error);
  });

module.exports = client;