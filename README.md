# notes

- [webhook libs for interactions](https://discord.com/developers/docs/topics/community-resources#interactions)
- [receiving/responding to interactions](https://discord.com/developers/docs/interactions/receiving-and-responding#receiving-an-interaction)

## setup

1. [create app](https://discord.com/developers/applications)
2. general info -> copy `application ID` (`client ID`) and `public key`
3. set webhook (inbound) url `<base url>/interactions`
4. bot -> enable bot -> copy token

## run

1. create `.env` file in project root
2. `npm install`
3. `npm start`

> .env

```sh
PORT=8008
# enable developer settings on discord and right click to get IDs

# right click server name (top left)
DISCORD_GUILD_ID=''
# right click channel name
DISCORD_VERIFY_CHANNEL_ID=''

# from discord dev app pages

# general info
DISCORD_BOT_CLIENT_ID=''
DISCORD_BOT_CLIENT_PUBLIC_KEY=''
# bot
DISCORD_BOT_TOKEN=''
```

## other

`register-commands.ts` can be run separately (only needs to be run once unless the command defs change). it can be done without libs if you want to put the request body together manually