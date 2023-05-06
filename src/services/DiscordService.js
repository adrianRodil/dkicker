const {
  Client,
  GatewayIntentBits,
  REST,
  Routes,
  SlashCommandBuilder,
  SlashCommandUserOption,
  SlashCommandIntegerOption,
} = require("discord.js");
const TOKEN = process.env.appToken;
const CLIENT_ID = process.env.appId;

const usersToKick = [];

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
  const user = newState.member;
  const kickUserConfig = usersToKick.find(
    (userConfig) => userConfig.id === user.user.id
  );
  if (!kickUserConfig) {
    console.log("user not in kick list skipping");
    return;
  }

  const kickInSeconds =
    Math.floor(Math.random() * kickUserConfig.range) + kickUserConfig.delay;
  console.log(`Kicking user in ${kickInSeconds} seconds`);
  setTimeout(() => {
    console.log("Kicking user");
    newState.member.voice.disconnect(), kickInSeconds * 1000;
  });
});

client.on("interactionCreate", async (interaction) => {
  if (!interaction.isChatInputCommand()) return;

  if (interaction.commandName === "dkick") {
    const data = interaction.options.data;
    console.log("DKICK TRRIGGERED");
    const userId = data[0].user.id;
    const delay = data[1].value;
    const range = data[2].value;
    usersToKick.push({ userId, delay, range });
    console.log(usersToKick);
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
    .addUserOption((option) =>
      option.setName("user").setDescription("User to kick").setRequired(true)
    )
    .addIntegerOption((option) =>
      option
        .setName("delay")
        .setMinValue(0)
        .setDescription("Delay start")
        .setRequired(true)
    )
    .addIntegerOption((option) =>
      option
        .setName("range")
        .setMinValue(0)
        .setDescription("Random interval")
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
