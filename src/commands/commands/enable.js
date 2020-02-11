const { oneLine } = require('common-tags');
const Command = require('../base');

module.exports = class EnableCommandCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'enable',
			aliases: ['enable-command', 'cmd-on', 'command-on'],
			group: 'commands',
			memberName: 'enable',
			description: 'Enables a command or command group.',
			details: oneLine`
				The argument must be the name/ID (partial or whole) of a command or command group.
				Only administrators may use this command.
			`,
			examples: ['enable util', 'enable Utility', 'enable prefix'],
			clientPermissions: ["EMBED_LINKS", "SEND_MESSAGES"],
			guarded: true,
			throttling: {
                usages: 2,
            	duration: 20
            },
			args: [
				{
					key: 'cmdOrGrp',
					label: 'command/group',
					prompt: 'Which command or group would you like to enable?',
					type: 'group|command'
				}
			]
		});
	}

	hasPermission(msg) {
		if(!msg.guild) return this.client.isOwner(msg.author);
		return msg.member.hasPermission('ADMINISTRATOR') || this.client.isOwner(msg.author);
	}

	run(msg, args) {
		function thismsg(message, type){return {title: `${type}`, color: 0x36393E, author: {name: message.guild.name, icon_url: message.guild.iconURL()}}}
		if(args.cmdOrGrp.isEnabledIn(msg.guild, true)) return msg.channel.send({embed: thismsg(msg, `${args.cmdOrGrp.group ? "Command" : "Group"} (${args.cmdOrGrp.name}) is already enabled!`)})
		args.cmdOrGrp.setEnabledIn(msg.guild, true);
		this.client.dbs.settings.findOne({guildID: msg.guild.id}, async (err, db) => {
			if(db){
				if(db.misc.commands.includes(args.cmdOrGrp.name)){
				db.misc.commands = db.misc.commands.filter(c => c !== args.cmdOrGrp.name);
				db.save().catch(() => {})
				}
			}
		})
		return msg.channel.send({embed: thismsg(msg, `${args.cmdOrGrp.group ? "Command" : "Group"} (${args.cmdOrGrp.name}) has been enabled!`)})
	}
};
