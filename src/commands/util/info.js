const Command = require('../base'), Discord = require('discord.js');
module.exports = class BotinfoCommand extends Command {
    constructor(client) {
        super(client, {
            name: "botinfo",
            group: "bot",
            memberName: "botinfo",
            aliases: [`info`, `binfo`],
            description: "Gives you the bots information",
            examples: [`${client.commandPrefix}botinfo`],
            clientPermissions: ["EMBED_LINKS", "SEND_MESSAGES"],
            throttling: Globalcooldown.default,
        })

    }
    async run(message) {
        try{
        const statuses = {
            "online": "Online", 
            "idle": "Idle",
            "dnd": "DND",
            "invisible": "Offline"
        }
        let embed = new Discord.MessageEmbed()
        .setAuthor(`Information about myself`, this.client.user.displayAvatarURL())
        .setColor(this.client.getColor(message.guild))
        .setThumbnail(this.client.user.displayAvatarURL())
        .setDescription(`
        **__User__**
        - Name: ${this.client.user.username}
        - ID: ${this.client.user.id}
        - Avatar: [Link](${this.client.user.displayAvatarURL()})
        - Created: ${require('moment')(this.client.user.createdAt).format('dddd, MMMM Do YYYY, h:mm:ssa')}

        **__Misc__**
        - Status: ${this.client.util.status[this.client.user.presence.status]} ${statuses[this.client.user.presence.status]}
        - Prefixes: \`${await this.client.getPrefix(message.guild)}\`, \`@${this.client.user.tag}\`
        - Owner${this.client.owners.length === 1 ? "" : "s"}: ${await this.client.owners.map(c => `\`${c.tag}\``).join(', ')}
        - Mutual Server${this.client.guilds.cache.filter(g => g.members.cache.get(message.author.id)).size === 1 ? "" : "s"}: ${this.client.guilds.cache.filter(g => g.members.cache.get(message.author.id)).size}
        - Shards: ${this.client.ws.shards.map(c => c).length}

        **__Links__**
        - Support: [Link](${this.client.options.invite})
        `)
        .addField(`What's ${this.client.user.username}?`, `${this.client.user.username} is a bot hosted by: \`@${this.client.owners[0].tag}\` for a select few servers since the main RoVer bot is down a lot.\n\nCan I use the bot in my server?, answer: no.. the bot is locked to only a select few servers for a reason, and I'd rather not make this bot open to the public. 🙂`);
        return message.channel.send(embed).catch(() => {})
        }catch(e){
          this.client.handleError(this.client, message, e)
        }
    }
}
