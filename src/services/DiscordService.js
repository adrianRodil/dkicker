const {
  Client,
  GatewayIntentBits,
  REST,
  Routes,
  SlashCommandBuilder,
  SlashCommandUserOption,
} = require("discord.js");
const TOKEN = process.env.appToken;
const CLIENT_ID = process.env.appId;

const usersToKickIds = [];

const client = new Client({
  intents: [GatewayIntentBits.GuildVoiceStates],
});

client.on("ready", () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

client.on("voiceStateUpdate", (_, newState) => {
  if (!newState.channelId) {
    console.log("User is not in a channel. Skipping action");
    return;
  }
  newState.member.voice.disconnect();
});

client.on("interactionCreate", async (interaction) => {
  if (!interaction.isChatInputCommand()) return;

  if (interaction.commandName === "dkick") {
    const data = interaction.options.data;
    console.log("DKICK TRRIGGERED");
    console.log(data);
    const userId = data[0].user.id;
    usersToKickIds.push(userId);
    interaction.reply({
      content: "Kick registered for user with id " + userId,
      ephemeral: true,
    });
  }
});

// register slash commands

const commands = [
  new SlashCommandBuilder()
    .setName("dkick")
    .setDescription("Kick a user after they join")
    .addUserOption(() =>
      new SlashCommandUserOption()
        .setName("dkick")
        .setDescription("User to kick")
        .setRequired(true)
    ),
];

const rest = new REST({ version: "10" }).setToken(TOKEN);

console.log("Started refreshing application (/) commands.");
rest
  .put(Routes.applicationCommands(CLIENT_ID), { body: commands })
  .catch(console.error)
  .then(() => console.log("Successfully reloaded application (/) commands."));

client.login(TOKEN);
