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
            clientPermissions: ["EMBED_LINKS", "SEND_MESSAGES"]
        })
    }
    async run(message) {
        try {
            let embed = new Discord.MessageEmbed()
                .setAuthor(`Elara Services`, "https://cdn.elara.workers.dev/d/icons/Elara.png")
                .setColor(0xFF000)
                .setDescription(this.client.options.invite)
            message.say(embed).catch(() => { });
        } catch (e) {
            this.client.handleError(this.client, message, e)
        }
    }
}
