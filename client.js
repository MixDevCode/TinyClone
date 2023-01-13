const Discord = require('discord.js-light');

const bot = new Discord.Client({
  makeCache: Discord.Options.cacheWithLimits({
    ApplicationCommandManager: Infinity, // guild.commands
    BaseGuildEmojiManager: Infinity, // guild.emojis
    ChannelManager: Infinity, // client.channels
    GuildChannelManager: Infinity, // guild.channels
    GuildBanManager: Infinity, // guild.bans
    GuildManager: Infinity, // client.guilds
    GuildMemberManager: Infinity, // guild.members
    MessageManager: Infinity, // channel.messages
    PermissionOverwriteManager: Infinity, // channel.permissionOverwrites
    RoleManager: Infinity, // guild.roles
    UserManager: Infinity, // client.users
  }),
  intents: [
    Discord.Intents.FLAGS.GUILDS,
    "GUILD_MESSAGES",
    "GUILDS",
    "GUILD_EMOJIS_AND_STICKERS",
    "GUILD_INVITES",
    "DIRECT_MESSAGES",
    "GUILD_MESSAGE_REACTIONS"
  ],
  ws: {
    intents: [
      Discord.Intents.FLAGS.GUILDS,
      "GUILD_MESSAGES",
      "GUILDS",
      "GUILD_EMOJIS_AND_STICKERS",
      "GUILD_INVITES",
      "DIRECT_MESSAGES",
      "GUILD_MESSAGE_REACTIONS"
    ]
  },
  shards: Number(process.env.PROCESS_ID) || "auto",
  shardCount: Number(process.env.PROCESS_COUNT),
  messageCacheLifetime: 120,
  messageCacheMaxSize: 50,
});

bot.login(process.env.BOT_TOKEN)

module.exports = {
  DiscordCL: bot
}