import { REST } from "@discordjs/rest";
import { Routes } from "discord-api-types/v9";
import { SlashCommandBuilder } from "@discordjs/builders";

const {
  DISCORD_GUILD_ID,
  DISCORD_BOT_TOKEN,
  DISCORD_BOT_CLIENT_ID
} = process.env;

const discordRestApi = new REST({ version: "9" }).setToken(DISCORD_BOT_TOKEN);

const slashNFD = new SlashCommandBuilder()
  .setName("nfd")
  .setDescription("NFD bot commands")
  .addSubcommand((subcommand) =>
    subcommand
      .setName("start")
      .setDescription("start the verification process"),
  )
  .addSubcommand((subcommand) =>
    subcommand
      .setName("verify")
      .setDescription("verify your NFD Discord connection"),
  );

export const setupServerCommands = async () => {
  await discordRestApi.put(
    Routes.applicationGuildCommands(DISCORD_BOT_CLIENT_ID, DISCORD_GUILD_ID),
    {
      body: [slashNFD.toJSON()],
    },
  );
  console.log("set up slash commands on", DISCORD_GUILD_ID);
};
