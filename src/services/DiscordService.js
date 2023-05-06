const { Client, GatewayIntentBits } = require("discord.js");
const TOKEN = process.env.appToken;

const client = new Client({
  intents: [GatewayIntentBits.GuildVoiceStates],
});

client.on("ready", () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

client.on("voiceStateUpdate", (_, newState) => {
  console.log(newState);
});
console.log("patata");
client.login(TOKEN);
