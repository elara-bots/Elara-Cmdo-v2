const Command = require('../base');
const Discord = require('discord.js');
module.exports = class SCommand extends Command {
    constructor(client) {
        super(client, {
            name: "support",
            memberName: "support",
            aliases: [`botsupport`],
            examples: [`${client.commandPrefix}support`],
            description: "Gives you the invite to the support server",
            group: "bot",
            clientPermissions: ["EMBED_LINKS", "SEND_MESSAGES"],
            throttling: Globalcooldown.default,
        })
    }
    async run(message) {
        message.channel.send({embed: {
            author: {
                name: this.client.user.tag,
                icon_url: this.client.user.displayAvatarURL()        
            },
            color: this.client.getColor(message.guild),
            description: this.client.options.invite || "There isn't an invite set, contact the bot developer(s)"
        }}).catch(() => {});
    }
}
