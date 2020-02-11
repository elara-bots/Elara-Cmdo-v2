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
            throttling: {
                usages: Globalcooldown.usage,
                duration: Globalcooldown.duration
            },
        })
    }
    async run(message) {
        let embed = new Discord.MessageEmbed()
            .setAuthor(`Elara Support`, "https://cdn.discordapp.com/icons/499409162661396481/28c6fa39e722e2c0aea60f15ca105c1d.png?size=2048")
            .setColor(message.guild ? message.guild.color : this.client.util.colors.default)
            .setDescription(this.client.options.invite)
        message.say(embed)
    }
}
