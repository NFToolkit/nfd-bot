import "dotenv/config";

import express from "express";
import {
  InteractionType,
  verifyKeyMiddleware,
  InteractionResponseType,
} from "discord-interactions";

import { setupServerCommands } from "./register-commands";

const {
  PORT,
  DISCORD_BOT_CLIENT_ID,
  DISCORD_VERIFY_CHANNEL_ID,
  DISCORD_BOT_CLIENT_PUBLIC_KEY,
} = process.env;

const permissionBits = "2416004160"; // manage roles, read messages/view channels, send messages, embed links, read message history, add reactions, use slash commands

// scopes are joined with url encoded space (%20)
const scopes = ["bot", "applications.commands"];

const serverInvite = `https://discord.com/api/oauth2/authorize?client_id=${DISCORD_BOT_CLIENT_ID}&permissions=${permissionBits}&scope=${scopes.join(
  "%20",
)}`;

const api = express();

api.use(verifyKeyMiddleware(DISCORD_BOT_CLIENT_PUBLIC_KEY));

api.post("/interactions", (req, res) => {
  const { body: message } = req;
  console.log("interaction", { message });

  if (message.type !== InteractionType.APPLICATION_COMMAND) return null;
  const {
    data,
    channel_id,
    member: { user },
  } = message;

  if (channel_id !== DISCORD_VERIFY_CHANNEL_ID) {
    console.log("not in verify channel");

    return res.json({
      type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
      data: {
        flags: 64, // 1 << 6, "ephemeral", https://discord.com/developers/docs/resources/channel#message-object-message-flags
        content: `this command can only be used in <#${DISCORD_VERIFY_CHANNEL_ID}>`,
      },
    });
  }

  const commandName = data.name;
  const subcommandName = data.options[0].name;

  // FUTURE
  // switch over subcommandName and handle the start and verify commands
  // switch(subcommandName) {
  //   case "start": {
  //     // do start things and respond
  //   }
  //   case "verify": {
  //     // do verify things and respond
  //   }
  // }

  const content = [
    `command: /${commandName} ${subcommandName}`,
    `discord ID (snowflake): ${user.id}`,
    `username: ${user.username}`,
    `discriminator: ${user.discriminator}`,
  ];

  return res.json({
    type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
    data: {
      flags: 64,
      content: content.join("\n"),
    },
  });
});

setupServerCommands().then(() =>
  api.listen(PORT, () => {
    console.log(`listening on ${PORT}`);
    console.log("invite to server:", serverInvite);
  }),
);
