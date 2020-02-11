const Command = require('../base'), Discord = require('discord.js');
module.exports = class NCommand extends Command {
    constructor(client) {
        super(client, {
            name: "invite",
            memberName: "invite",
            aliases: ["botinvite", `inv`],
            examples: [`${client.commandPrefix}invite`],
            description: "Gives you a invite for the bot.",
            clientPermissions: ["EMBED_LINKS", "SEND_MESSAGES"],
            throttling: {
                usages: Globalcooldown.usage,
                duration: Globalcooldown.duration
            },
            group: "bot"
        })
    }
    async run(message) {
        try{
        let links = [
            `[All Permissions](https://discordapp.com/oauth2/authorize?client_id=${this.client.user.id}&permissions=2137517567&scope=bot)`,
            `[Administrator Permissions](https://discordapp.com/api/oauth2/authorize?client_id=${this.client.user.id}&permissions=8&scope=bot)`,
            `[Moderator Permissions](https://discordapp.com/api/oauth2/authorize?client_id=${this.client.user.id}&permissions=1543892167&scope=bot)`,
            `[Normal Permissions](https://discordapp.com/api/oauth2/authorize?client_id=${this.client.user.id}&permissions=67488833&scope=bot)`,
            `[No Permissions](https://discordapp.com/oauth2/authorize?client_id=${this.client.user.id}&permissions=0&scope=bot)`
        ]
        let e = new Discord.MessageEmbed()
        .setColor(message.guild ? message.guild.color : this.client.util.colors.default)
        .setAuthor(`Bot Invites`, this.client.user.displayAvatarURL())
        .setDescription(links.join('\n') + `\n[Support Server](${this.client.options.invite})`)
        return message.channel.send(e)
        }catch(e){
            this.client.error(this.client, message, e);
            this.client.logger(this.client, message, e.stack)
        }
    }
}
