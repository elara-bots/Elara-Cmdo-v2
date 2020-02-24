const Command = require('../base');
const Discord = require('discord.js');
const moment = require('moment');
require("moment-duration-format");
module.exports = class PingCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'ping',
            group: 'bot',
            memberName: 'ping',
            description: 'Shows the ping for the bot',
            examples: ['ping'],
            aliases: ["pong", "pung", `uptime`],
            guildOnly: false,
	    clientPermissions: ["EMBED_LINKS", "SEND_MESSAGES"],
            throttling: Globalcooldown.default,
        });
    }

    async run(msg) {
        try{
	let message = await msg.channel.send({embed: {color: this.client.util.colors.default, description: `${this.client.getEmoji("eload")} Loading..`, timestamp: new Date()}})
   	message.edit({
	   embed: {
		color: this.client.getColor(msg.guild),
		title: `${this.client.getEmoji("robot")} Status ${this.client.getEmoji("robot")}`,
		footer: {
		   text: msg.author.tag, icon_url: msg.author.displayAvatarURL()
		},
		author: {name: this.client.user.tag, icon_url: this.client.user.displayAvatarURL()},
		fields: [
			{name: `Message Latency`, value: `${message.createdTimestamp - msg.createdTimestamp}ms`, inline: true},
			{name: `API Latency`, value: `${Math.round(this.client.ws.ping)}ms`, inline: true},
			{name: `Uptime`, value: `${moment.duration(this.client.uptime).format(" D [Days], H [Hours], m [Minutes], s [Seconds]")}`, inline: true}
		]
		
	   }
	});
        }catch(e){
 		 this.client.handleError(this.client, msg, e)
        }
    }
};
