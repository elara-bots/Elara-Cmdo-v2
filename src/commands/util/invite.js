const { Command } = require('elaracmdo'),
    Discord = require('discord.js');
module.exports = class NCommand extends Command {
    constructor(client) {
        super(client, {
            name: "invite",
            memberName: "invite",
            aliases: ["botinvite", `inv`, `bot`],
            examples: [`${client.commandPrefix}invite <bot id here>`],
            description: "Gives you a invite for the bot id you provide.",
            group: "info",
            clientPermissions: ["EMBED_LINKS", "SEND_MESSAGES"],
            throttling: Globalcooldown.default,
            args: [
                {
                    key: 'user',
                    prompt: 'Please provide the bot id.',
                    type: 'user',
                    default: msg => msg.client.user
                }
            ]
        })
    }
    async run(message, { user, }) {
 
        
        try{
        if(user.bot === false) return this.client.error(message, `${this.client.util.emojis.nemoji} That is a user account, not a bot..`);
        let links = [
          `[All Permissions](https://discordapp.com/oauth2/authorize?client_id=${user.id}&permissions=2137517567&scope=bot)`,
          `[Administrator Permissions](https://discordapp.com/api/oauth2/authorize?client_id=${user.id}&permissions=8&scope=bot)`,
          `[Moderator Permissions](https://discordapp.com/api/oauth2/authorize?client_id=${user.id}&permissions=1543892167&scope=bot)`,
          `[Normal Permissions](https://discordapp.com/api/oauth2/authorize?client_id=${user.id}&permissions=67488833&scope=bot)`,
          `[No Permissions](https://discordapp.com/oauth2/authorize?client_id=${user.id}&permissions=0&scope=bot)`
      ]
      let e = new Discord.MessageEmbed()
      .setColor(await this.client.getColor(message.guild))
      .setAuthor(user.tag, user.displayAvatarURL())
      .setTitle("Invite Links")
      .setDescription(links.join('\n'))
      if(user === this.client.user.id){
        e.addField(`Support`, this.client.options.invite);
      };
      return message.channel.send(e).catch(() => {});
    }catch(e){this.client.handleError(this.client, message, e)}
    }
}
