const Command = require('../base'), Discord = require('discord.js');
module.exports = class NCommand extends Command {
    constructor(client) {
        super(client, {
            name: "invite",
            memberName: "invite",
            aliases: ["botinvite", `inv`, `bot`],
            examples: [`${client.commandPrefix}invite`],
            description: "Gives you a invite for the bot.",
            clientPermissions: ["EMBED_LINKS", "SEND_MESSAGES"],
            throttling: Globalcooldown.default,
            group: "bot",
            args: [
                {
                    key: "user",
                    prompt: "What bot?",
                    type: "user",
                    default: msg => msg.client.user
                }
            ]
        })
    }
    async run(message, {user}) {
        try{
        if(!user.bot) return this.client.error(message, `${this.client.getEmoji("nemoji")} You provided a user account... NOT a bot!`)
        let links = [
            `[All Permissions](https://discordapp.com/oauth2/authorize?client_id=${this.client.user.id}&permissions=2137517567&scope=bot)`,
            `[Administrator Permissions](https://discordapp.com/api/oauth2/authorize?client_id=${this.client.user.id}&permissions=8&scope=bot)`,
            `[Moderator Permissions](https://discordapp.com/api/oauth2/authorize?client_id=${this.client.user.id}&permissions=1543892167&scope=bot)`,
            `[Normal Permissions](https://discordapp.com/api/oauth2/authorize?client_id=${this.client.user.id}&permissions=67488833&scope=bot)`,
            `[No Permissions](https://discordapp.com/oauth2/authorize?client_id=${this.client.user.id}&permissions=0&scope=bot)`
        ]
        return message.channel.send({embed: {
            color: this.client.getColor(message.guild),
            author: {
                name: `Bot Invites`,
                icon_url: user.displayAvatarURL()
            },
            description: links.join("\n"),
            fields: user.id === this.client.user.id ? [{name: `Support`, value: this.client.options.invite}] : []
        }})
        }catch(e){
           this.client.handleError(this.client, message, e)
        }
    }
}
