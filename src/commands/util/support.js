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
        try{
        message.channel.send({embed: {
            author: {
                name: this.client.user.tag,
                value: this.client.user.displayAvatarURL()
            },
            color: this.client.getColor(message.guild),
            title: `My support server`,
            description: this.client.options.invite ? this.client.options.invite : "No invite added :("
        }}).catch(() => {});
        }catch(e){
          this.client.handleError(this.client, message, e)
        }
    }
}
