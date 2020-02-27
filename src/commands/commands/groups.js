const { stripIndents } = require('common-tags');
const Command = require('../base');

module.exports = class ListGroupsCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'groups',
			aliases: ['list-groups', 'show-groups'],
			group: 'commands',
			memberName: 'groups',
			description: 'Lists all command groups.',
			details: 'Only administrators may use this command.',
			clientPermissions: ["EMBED_LINKS", "SEND_MESSAGES"],
			guarded: true
		});
	}

	hasPermission(msg) {
		if(!msg.guild) return this.client.isOwner(msg.author);
		return msg.member.hasPermission('ADMINISTRATOR') || this.client.isOwner(msg.author);
	}

	run(msg) {
		return this.client.error(msg, `**__Command Groups__**\n\n${this.client.registry.groups.map(g => `**${g.name}** (\`${g.id}\`) | ${this.client.f.developer.Enabled(g.isEnabledIn(msg.guild))}`).join("\n")}`)
	}
};
