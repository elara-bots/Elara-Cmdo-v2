const discord = require('discord.js');
const CommandoRegistry = require('./registry');
const CommandDispatcher = require('./dispatcher');
const eutil = require("./util");
/**
 * @typedef {Colors} Colors
 * @property {string} [red] - The red hex color
 * @property {string} [cyan] - The cyan hex color
 * @property {string} [default] - The default hex color
 * @property {string} [yellow] - The yellow hex color 
 * @property {string} [green] - The green hex color
 * @property {string} [orange] - The orange hex color.
 */
/**
 * @typedef {Statuses} Statuses
 * @property {string} [online] - The online emoji
 * @property {string} [idle] - The idle emoji
 * @property {string} [dnd] - The dnd emoji
 * @property {string} [offline] - The offline emoji 
 * @property {string} [invisible] - The offline emoji
 */
/**
 * @typedef {Emojis} Emojis
 * @property {string} [sreact] - The success emoji id
 * @property {string} [nreact] - The 'xx' emoji id
 * @property {string} [rload] - The loading emoji id
 * @property {string} [rplan] - The planned emoji id
 * @property {string} [semoji] - The success emoji
 * @property {string} [eplan] - The planned emoji
 * @property {string} [nemoji] - The 'xx' emoji
 * @property {string} [eload] - The loading emoji
 * @property {string} [robot] - The robot emoji
 * @property {string} [eminus] - The minus emoji
 * @property {string} [rminus] - The minus emoji id
 * @property {string} [eplus] - The plus emoji
 * @property {string} [rplus] - The plus emoji id
 * @property {string} [en] - The enabled emoji
 * @property {string} [rn] - The enabled emoji id
 * @property {string} [ed] - The disabled emoji
 * @property {string} [rd] - The disabled emoji id
 */
/**
 * @typedef {ElaraUtil} ElaraUtil
 * @param {Colors} [colors] - The util colors
 * @property {string[]} [fortunes] - The list of fortunes
 * @property {string[]} [verifLevels] - The Verification levels.. array 
 * @property {object} [dcolors] - The objects of the Discord 'colors' 
 * @property {string[]} [throws] - The list of the default throws
 * @property {string[]} [jobs] - The list of the default jobs
 * @param {Emojis} [emojis] - The object of emojis
 * @param {Statuses} [status] - The object of statuses
 * @property {object} [perms] - The object of the permissions
 * @property {object} [permbits] - The bit permissions object
 */
/**
 * Discord.js Client with a command framework
 * @extends {Client}
 */
class CommandoClient extends discord.Client {
	/**
	 * Options for a CommandoClient
	 * @typedef {ClientOptions} CommandoClientOptions
	 * @property {string} [commandPrefix=!] - Default command prefix
	 * @property {number} [commandEditableDuration=30] - Time in seconds that command messages should be editable
	 * @property {boolean} [nonCommandEditable=true] - Whether messages without commands can be edited to a command
	 * @property {string|string[]|Set<string>} [owner] - ID of the bot owner's Discord user, or multiple IDs
	 * @property {string} [invite] - Invite URL to the bot's support server
	 */

	/**
	 * @param {CommandoClientOptions} [options] - Options for the client
	 */
	constructor(options = {}) {
		if(typeof options.commandPrefix === 'undefined') options.commandPrefix = '!';
		if(options.commandPrefix === null) options.commandPrefix = '';
		if(typeof options.commandEditableDuration === 'undefined') options.commandEditableDuration = 30;
		if(typeof options.nonCommandEditable === 'undefined') options.nonCommandEditable = true;
		super(options);

		/**
		 * The client's command registry
		 * @type {CommandoRegistry}
		 */
		this.registry = new CommandoRegistry(this);

		/**
		 * The client's command dispatcher
		 * @type {CommandDispatcher}
		 */
		this.dispatcher = new CommandDispatcher(this, this.registry);
		/**
		* The utility for the bot
		* @type {ElaraUtil}
		*/
		this.util = eutil;
        this.GlobalCmds = []; 
		this.main = false; 
		this.GlobalUsers = [];
        this.afkUsers = new discord.Collection();
		this.error = async function(msg, error, valid = [], del = false, options = {thumbnail: null, image: null}){
				let fields = [];
				if(valid.length !== 0) fields.push({name: `Valid Responses`, value: valid.map(v => `\`${v}\``).join(", ")});
				let embed = {
					embed: {
						title: `INFO`,
						color: msg.client.getColor(msg.guild),
						author: {
							name: msg.author.tag,
							icon_url: msg.author.displayAvatarURL()
						},
						timestamp: new Date(),
						description: error,
						fields: fields,
						thumbnail: {
							url: options.thumbnail
						},
						image: {
							url: options.image
						}
					}
				};
                if(msg.channel.type === 'dm') return msg.channel.send(embed).then(msgs => {
                    if(del){
                        msgs.delete({timeout: 10000}).catch(() => {})
                    }
                }).catch(() => {});
                if(msg.channel.permissionsFor(msg.guild.me).has('EMBED_LINKS') == true){
                    msg.channel.send(embed).then(msgs => {
                        if(del){
                            msgs.delete({timeout: 10000}).catch(() => {})
                        }
                    }).catch(() => {})
                }else{
					msg.channel.send(`**Error:** I don't have 'Embed Links' permission in this channel, contact one of the staff members to fix this issue!`).catch(() => {});
                }
        }
		/**
		* To get the prefix of the guild/client provided
		* @type {function}
		*/
		this.getPrefix = (guild) => guild ? guild._commandPrefix ? guild._commandPrefix : options.commandPrefix : options.commandPrefix;
        	/**
		* To get the command usage of the command provided
		* @type {function}
		*/
		this.getUsage = (guild, usage) => `${guild ? guild._commandPrefix ? guild._commandPrefix : options.commandPrefix : options.commandPrefix}${usage}`;
        	/**
		* To get the color of the guild provided
		* @type {function}
		*/
		this.getColor = (guild) => guild ? guild.color ? guild.color : this.util.colors.default : this.util.colors.default
		this.type = (channel) => {
			channel.startTyping(true);
			setTimeout(() => channel.stopTyping(true), 5000);
		};
		this.getEmoji = (name) => {
			return this.util.emojis[name] ? this.util.emojis[name] : "";
		};
		this.getDB = async (name, search = {}) => {
			let db = await this.dbs[name].findOne(search);
			if(!db) return null;
			return db;
		};
		this.getMutual = (user) => {
			let search = user;
			if(user.hasOwnProperty("id")) search = user.id;

			this.users.fetch(search).then((u) => {
				return this.guilds.cache.filter(g => g.members.cache.has(u.id));
			}).catch((err) => {
				return []
			});
		};
		this.handleError = (client, message, error) => {
			client.error(message, error.message);
			client.logger(client, message, error.stack);
		};
		/**
		 * The client's setting provider
		 * @type {?SettingProvider}
		 */

		this.provider = null;

		/**
		 * Internal global command prefix, controlled by the {@link CommandoClient#commandPrefix} getter/setter
		 * @type {?string}
		 * @private
		 */
		this._commandPrefix = null;

		/**
		 * The say/send function
		 * @type {function}
		 */
		this.say = function (channel, content){
			if(channel instanceof discord.Channel){
			  channel.send(content).catch(() => {});
			}else
			if(channel instanceof discord.Message){
			  channel.channel.send(content).catch(() => {});
			}else
			if(channel instanceof discord.User){
				channel.send(content).catch(() => {});
			}else
			if(!isNaN(channel)){
			  let ch = this.channels.cache.get(channel);
			  if(!ch) ch = this.users.cache.get(channel);
			  if(!ch) return null;
			  ch.send(content).catch(() => {});
			}
		};
		this.type = (channel) => {
			channel.startTyping(true);
			setTimeout(() => channel.stopTyping(true), 5000);
		}
		// Set up command handling
		const msgErr = (err) => { this.emit('error', err); };
		this.on('message', message => { this.dispatcher.handleMessage(message).catch(msgErr); });
		this.on('messageUpdate', (oldMessage, newMessage) => this.dispatcher.handleMessage(newMessage, oldMessage).catch(msgErr));

		// Fetch the owner(s)
		if(options.owner) {
			this.once('ready', () => {
				if(options.owner instanceof Array || options.owner instanceof Set) {
					for(const owner of options.owner) {
						this.users.fetch(owner).catch(err => {
							this.emit('warn', `Unable to fetch owner ${owner}.`);
							this.emit('error', err);
						});
					}
				} else {
					this.users.fetch(options.owner).catch(err => {
						this.emit('warn', `Unable to fetch owner ${options.owner}.`);
						this.emit('error', err);
					});
				}
			});
		}
	}

	/**
	 * Global command prefix. An empty string indicates that there is no default prefix, and only mentions will be used.
	 * Setting to `null` means that the default prefix from {@link CommandoClient#options} will be used instead.
	 * @type {string}
	 * @emits {@link CommandoClient#commandPrefixChange}
	 */
	get commandPrefix() {
		if(typeof this._commandPrefix === 'undefined' || this._commandPrefix === null) return this.options.commandPrefix;
		return this._commandPrefix;
	}

	set commandPrefix(prefix) {
		this._commandPrefix = prefix;
		this.emit('commandPrefixChange', null, this._commandPrefix);
	}

	/**
	 * Owners of the bot, set by the {@link CommandoClientOptions#owner} option
	 * <info>If you simply need to check if a user is an owner of the bot, please instead use
	 * {@link CommandoClient#isOwner}.</info>
	 * @type {?Array<User>}
	 * @readonly
	 */
	get owners() {
		if(!this.options.owner) return null;
		if(typeof this.options.owner === 'string') return [this.users.cache.get(this.options.owner)];
		const owners = [];
		for(const owner of this.options.owner) owners.push(this.users.cache.get(owner));
		return owners;
	}

	/**
	 * Checks whether a user is an owner of the bot (in {@link CommandoClientOptions#owner})
	 * @param {UserResolvable} user - User to check for ownership
	 * @return {boolean}
	 */
	isOwner(user) {
		if(!this.options.owner) return false;
		user = this.users.resolve(user);
		if(!user) throw new RangeError('Unable to resolve user.');
		if(typeof this.options.owner === 'string') return user.id === this.options.owner;
		if(this.options.owner instanceof Array) return this.options.owner.includes(user.id);
		if(this.options.owner instanceof Set) return this.options.owner.has(user.id);
		throw new RangeError('The client\'s "owner" option is an unknown value.');
	}

	/**
	 * Sets the setting provider to use, and initialises it once the client is ready
	 * @param {SettingProvider|Promise<SettingProvider>} provider Provider to use
	 * @return {Promise<void>}
	 */
	async setProvider(provider) {
		provider = await provider;
		this.provider = provider;

		if(this.readyTimestamp) {
			this.emit('debug', `Provider set to ${provider.constructor.name} - initialising...`);
			await provider.init(this);
			this.emit('debug', 'Provider finished initialisation.');
			return undefined;
		}

		this.emit('debug', `Provider set to ${provider.constructor.name} - will initialise once ready.`);
		await new Promise(resolve => {
			this.once('ready', () => {
				this.emit('debug', `Initialising provider...`);
				resolve(provider.init(this));
			});
		});

		/**
		 * Emitted upon the client's provider finishing initialisation
		 * @event CommandoClient#providerReady
		 * @param {SettingProvider} provider - Provider that was initialised
		 */
		this.emit('providerReady', provider);
		this.emit('debug', 'Provider finished initialisation.');
		return undefined;
	}

	async destroy() {
		await super.destroy();
		if(this.provider) await this.provider.destroy();
	}
}

module.exports = CommandoClient;
