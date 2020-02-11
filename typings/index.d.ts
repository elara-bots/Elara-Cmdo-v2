declare module 'elaracmdo' {
	import { Channel, Client, ClientOptions, Collection, DMChannel, Emoji, Guild, GuildChannel, GuildMember, GuildResolvable, Message, MessageAttachment, MessageEmbed, MessageMentions, MessageOptions, MessageReaction, PermissionResolvable, PermissionString, ReactionEmoji, Role, Snowflake, StringResolvable, TextChannel, User, UserResolvable, VoiceState, Webhook } from 'discord.js';

	export class Argument {
		private constructor(client: CommandoClient, info: ArgumentInfo);

		private obtainInfinite(msg: CommandoMessage, vals?: string[], promptLimit?: number): Promise<ArgumentResult>;

		private static validateInfo(client: CommandoClient, info: ArgumentInfo);

		public default: any;
		public error: string;
		public infinite: boolean;
		public key: string;
		public label: string;
		public max: number;
		public min: number;
		public oneOf: any[];
		public parser: Function;
		public prompt: string;
		public type: ArgumentType;
		public validator: Function;
		public wait: number;

		public obtain(msg: CommandoMessage, val?: string, promptLimit?: number): Promise<ArgumentResult>;
		public parse(val: string, msg: CommandoMessage): any | Promise<any>;
		public validate(val: string, msg: CommandoMessage): boolean | string | Promise<boolean | string>;
	}

	export class ArgumentCollector {
		public constructor(client: CommandoClient, args: ArgumentInfo[], promptLimit?: number);

		public args: Argument[];
		public readonly client: CommandoClient;
		public promptLimit: number;

		public obtain(msg: CommandoMessage, provided?: any[], promptLimit?: number): Promise<ArgumentCollectorResult>;
	}

	export class ArgumentType {
		public constructor(client: CommandoClient, id: string);

		public readonly client: CommandoClient;
		public id: string;

		public parse(val: string, msg: CommandoMessage, arg: Argument): any | Promise<any>;
		public validate(val: string, msg: CommandoMessage, arg: Argument): boolean | string | Promise<boolean | string>;
		public isEmpty(val: string, msg: CommandoMessage, arg: Argument): boolean;
	}

	export class ArgumentUnionType extends ArgumentType {
		public types: ArgumentType[];
	}

	export class Command {
		public constructor(client: CommandoClient, info: CommandInfo);

		private _globalEnabled: boolean;
		private _throttles: Map<string, object>;

		private throttle(userID: string): object;

		private static validateInfo(client: CommandoClient, info: CommandInfo);

		public aliases: string[];
		public argsCount: number;
		public argsSingleQuotes: boolean;
		public argsType: string;
		public readonly client: CommandoClient;
		public clientPermissions: PermissionResolvable[];
		public defaultHandling: boolean;
		public description: string;
		public details: string;
		public examples: string[];
		public format: string;
		public group: CommandGroup;
		public groupID: string;
		public guarded: boolean;
		public hidden: boolean;
		public guildOnly: boolean;
		public memberName: string;
		public name: string;
		public nsfw: boolean;
		public ownerOnly: boolean;
		public patterns: RegExp[];
		public throttling: ThrottlingOptions;
		public unknown: boolean;
		public userPermissions: PermissionResolvable[];

		public hasPermission(message: CommandoMessage): boolean | string;
		public isEnabledIn(guild: GuildResolvable, bypassGroup?: boolean): boolean;
		public isUsable(message: Message): boolean;
		public onBlock(message: CommandoMessage, reason: string, data?: Object): Promise<Message | Message[]>;
		public onBlock(message: CommandoMessage, reason: 'guildOnly' | 'nsfw'): Promise<Message | Message[]>;
		public onBlock(message: CommandoMessage, reason: 'permission', data: { response?: string }): Promise<Message | Message[]>;
		public onBlock(message: CommandoMessage, reason: 'clientPermissions', data: { missing: string }): Promise<Message | Message[]>;
		public onBlock(message: CommandoMessage, reason: 'throttling', data: { throttle: Object, remaining: number }): Promise<Message | Message[]>;
		public onError(err: Error, message: CommandoMessage, args: object | string | string[], fromPattern: false): Promise<Message | Message[]>;
		public onError(err: Error, message: CommandoMessage, args: string[], fromPattern: true): Promise<Message | Message[]>;
		public reload(): void;
		public run(message: CommandoMessage, args: object | string | string[], fromPattern: boolean): Promise<Message | Message[] | null> | null;
		public setEnabledIn(guild: GuildResolvable, enabled: boolean): void;
		public unload(): void;
		public usage(argString?: string, prefix?: string, user?: User): string;

		public static usage(command: string, prefix?: string, user?: User): string;
	}
	export class CommandDispatcher {
		public constructor(client: CommandoClient, registry: CommandoRegistry);

		private _awaiting: Set<string>;
		private _commandPatterns: object;
		private _results: Map<string, CommandoMessage>;

		private buildCommandPattern(prefix: string): RegExp;
		private cacheCommandoMessage(message: Message, oldMessage: Message, cmdMsg: CommandoMessage, responses: Message | Message[]): void;
		private handleMessage(messge: Message, oldMessage?: Message): Promise<void>;
		private inhibit(cmdMsg: CommandoMessage): Inhibition;
		private matchDefault(message: Message, pattern: RegExp, commandNameIndex: number): CommandoMessage;
		private parseMessage(message: Message): CommandoMessage;
		private shouldHandleMessage(message: Message, oldMessage?: Message): boolean;

		public readonly client: CommandoClient;
		public inhibitors: Set<Function>;
		public registry: CommandoRegistry;

		public addInhibitor(inhibitor: Inhibitor): boolean;
		public removeInhibitor(inhibitor: Inhibitor): boolean;
	}

	export class CommandFormatError extends FriendlyError {
		public constructor(msg: CommandoMessage);
	}

	export class CommandGroup {
		public constructor(client: CommandoClient, id: string, name?: string, guarded?: boolean, commands?: Command[]);

		public readonly client: CommandoClient;
		public commands: Collection<string, Command>
		public guarded: boolean;
		public id: string;
		public name: string;

		public isEnabledIn(guild: GuildResolvable): boolean;
		public reload(): void;
		public setEnabledIn(guild: GuildResolvable, enabled: boolean): void;
	}

	export class CommandoMessage {
		public constructor(message: Message, command?: Command, argString?: string, patternMatches?: string[]);

		private deleteRemainingResponses(): void;
		private editCurrentResponse(id: string, options?: {}): Promise<Message | Message[]>;
		private editResponse(response: Message | Message[], options?: {}): Promise<Message | Message[]>;
		private finalize(responses: Message | Message[]): void;
		private respond(options?: {}): Message | Message[];

		public argString: string;
		public readonly attachments: Collection<string, MessageAttachment>;
		public readonly author: User;
		public readonly channel: TextChannel | DMChannel;
		public readonly cleanContent: string;
		public readonly client: CommandoClient;
		public command: Command;
		public readonly content: string;
		public readonly createdAt: Date;
		public readonly createdTimestamp: number;
		public readonly deletable: boolean;
		public readonly editable: boolean;
		public readonly editedAt: Date;
		public readonly editedTimestamp: number;
		public readonly edits: Message[];
		public readonly embeds: MessageEmbed[];
		public readonly guild: CommandoGuild;
		public readonly id: string;
		public readonly member: GuildMember;
		public readonly mentions: MessageMentions;
		public message: Message;
		public readonly nonce: string;
		public patternMatches: string[];
		public readonly pinnable: boolean;
		public readonly pinned: boolean;
		public readonly reactions: Collection<string, MessageReaction>;
		public responsePositions: {};
		public responses: {};
		public readonly system: boolean;
		public readonly tts: boolean;
		public readonly webhookID: string;

		public anyUsage(command?: string, prefix?: string, user?: User): string;
		public clearReactions(): Promise<Message>;
		public code(lang: string, content: StringResolvable, options?: MessageOptions): Promise<Message | Message[]>
		public delete(timeout?: number): Promise<Message>;
		public direct(content: StringResolvable, options?: MessageOptions): Promise<Message | Message[]>;
		public edit(content: StringResolvable): Promise<Message>
		public editCode(lang: string, content: StringResolvable): Promise<Message>;
		public embed(embed: MessageEmbed | {}, content?: StringResolvable, options?: MessageOptions): Promise<Message | Message[]>;
		public fetchWebhook(): Promise<Webhook>;
		public isMemberMentioned(member: GuildMember | User): boolean;
		public isMentioned(data: GuildChannel | User | Role | string): boolean;
		public parseArgs(): string | string[];
		public static parseArgs(argString: string, argCount?: number, allowSingleQuote?: boolean): string[];
		public pin(): Promise<Message>
		public react(emoji: string | Emoji | ReactionEmoji): Promise<MessageReaction>;
		public reply(content: StringResolvable, options?: MessageOptions): Promise<Message | Message[]>;
		public replyEmbed(embed: MessageEmbed | {}, content?: StringResolvable, options?: MessageOptions): Promise<Message | Message[]>;
		public run(): Promise<Message | Message[]>;
		public say(content: StringResolvable, options?: MessageOptions): Promise<Message | Message[]>;
		public unpin(): Promise<Message>;
		public usage(argString?: string, prefix?: string, user?: User): string;
	}

	export class CommandoClient extends Client {
		public constructor(options?: CommandoClientOptions);

		private _commandPrefix: string;

		public commandPrefix: string;
		public dispatcher: CommandDispatcher;
		public options: CommandoClientOptions;
		public readonly owners: User[];
		public provider: SettingProvider;
		public handleEvent: object;
		public registry: CommandoRegistry;
		public util: ElaraUtil;
		public say(channelOrUser: Channel|User, content: string): void;
		public error(message: CommandoMessage, content: string): Promise<void>;
		public type(channel: Channel): Promise<void>;
		public getDB(type: DBType, search: DBSearch): Promise<void>;
		public getMutual(user: User|string): string[];
		public getColor(guild: CommandoGuild): string;
		public getPrefix(guild: CommandoGuild): string;
		public getUsage(guild: CommandoGuild, usage: string): string;
		public handleError(client: CommandoClient, message: CommandoMessage, error: object): Promise<void>;
		public logger(client: CommandoClient, message: CommandoMessage, error: string, shard: number): Promise<void>;
		public config: ConfigFile;
		public f: FunctionsList;
		public services: ServicesList;
		public getEmoji(name: string): string;
		public isOwner(user: UserResolvable): boolean;
		public setProvider(provider: SettingProvider | Promise<SettingProvider>): Promise<void>;

		on(event: string, listener: Function): this;
		on(event: 'commandBlock', listener: (message: CommandoMessage, reason: string, data?: Object) => void): this;
		on(event: 'commandBlock', listener: (message: CommandoMessage, reason: 'guildOnly' | 'nsfw') => void): this;
		on(event: 'commandBlock', listener: (message: CommandoMessage, reason: 'permission', data: { response?: string }) => void): this;
		on(event: 'commandBlock', listener: (message: CommandoMessage, reason: 'throttling', data: { throttle: Object, remaining: number }) => void): this;
		on(event: 'commandBlock', listener: (message: CommandoMessage, reason: 'clientPermissions', data: { missing: string }) => void): this;
		on(event: 'commandCancel', listener: (command: Command, reason: string, message: CommandoMessage) => void): this;
		on(event: 'commandError', listener: (command: Command, err: Error, message: CommandoMessage, args: object | string | string[], fromPattern: false) => void): this;
		on(event: 'commandError', listener: (command: Command, err: Error, message: CommandoMessage, args: string[], fromPattern: true) => void): this;
		on(event: 'commandPrefixChange', listener: (guild: CommandoGuild, prefix: string) => void): this;
		on(event: 'commandRegister', listener: (command: Command, registry: CommandoRegistry) => void): this;
		on(event: 'commandReregister', listener: (newCommand: Command, oldCommand: Command) => void): this;
		on(event: 'commandRun', listener: (command: Command, promise: Promise<any>, message: CommandoMessage, args: object | string | string[], fromPattern: boolean) => void): this;
		on(event: 'commandStatusChange', listener: (guild: CommandoGuild, command: Command, enabled: boolean) => void): this;
		on(event: 'commandUnregister', listener: (command: Command) => void): this;
		on(event: 'groupRegister', listener: (group: CommandGroup, registry: CommandoRegistry) => void): this;
		on(event: 'groupStatusChange', listener: (guild: CommandoGuild, group: CommandGroup, enabled: boolean) => void): this;
		on(event: 'typeRegister', listener: (type: ArgumentType, registry: CommandoRegistry) => void): this;
		on(event: 'unknownCommand', listener: (message: CommandoMessage) => void): this;
		on(event: 'channelCreate', listener: (channel: Channel) => void): this;
		on(event: 'channelDelete', listener: (channel: Channel) => void): this;
		on(event: 'channelPinsUpdate', listener: (channel: Channel, time: Date) => void): this;
		on(event: 'channelUpdate', listener: (oldChannel: Channel, newChannel: Channel) => void): this;
		on(event: 'debug', listener: (info: string) => void): this;
		on(event: 'disconnect', listener: (event: any) => void): this;
		on(event: 'emojiCreate', listener: (emoji: Emoji) => void): this;
		on(event: 'emojiDelete', listener: (emoji: Emoji) => void): this;
		on(event: 'emojiUpdate', listener: (oldEmoji: Emoji, newEmoji: Emoji) => void): this;
		on(event: 'error', listener: (error: Error) => void): this;
		on(event: 'guildBanAdd', listener: (guild: CommandoGuild, user: User) => void): this;
		on(event: 'guildBanRemove', listener: (guild: CommandoGuild, user: User) => void): this;
		on(event: 'guildCreate', listener: (guild: CommandoGuild) => void): this;
		on(event: 'guildDelete', listener: (guild: CommandoGuild) => void): this;
		on(event: 'guildMemberAdd', listener: (member: GuildMember) => void): this;
		on(event: 'guildMemberAvailable', listener: (member: GuildMember) => void): this;
		on(event: 'guildMemberRemove', listener: (member: GuildMember) => void): this;
		on(event: 'guildMembersChunk', listener: (members: Collection<Snowflake, GuildMember>, guild: CommandoGuild) => void): this;
		on(event: 'guildMemberSpeaking', listener: (member: GuildMember, speaking: boolean) => void): this;
		on(event: 'guildMemberUpdate', listener: (oldMember: GuildMember, newMember: GuildMember) => void): this;
		on(event: 'guildUnavailable', listener: (guild: CommandoGuild) => void): this;
		on(event: 'guildUpdate', listener: (oldGuild: CommandoGuild, newGuild: CommandoGuild) => void): this;
		on(event: 'message', listener: (message: Message) => void): this;
		on(event: 'messageDelete', listener: (message: Message) => void): this;
		on(event: 'messageDeleteBulk', listener: (messages: Collection<Snowflake, Message>) => void): this;
		on(event: 'messageReactionAdd', listener: (messageReaction: MessageReaction, user: User) => void): this;
		on(event: 'messageReactionRemove', listener: (messageReaction: MessageReaction, user: User) => void): this;
		on(event: 'messageReactionRemoveAll', listener: (message: Message) => void): this;
		on(event: 'messageUpdate', listener: (oldMessage: Message, newMessage: Message) => void): this;
		on(event: 'presenceUpdate', listener: (oldMember: GuildMember, newMember: GuildMember) => void): this;
		on(event: 'providerReady', listener: (provider: SettingProvider) => void): this;
		on(event: 'ready', listener: () => void): this;
		on(event: 'reconnecting', listener: () => void): this;
		on(event: 'roleCreate', listener: (role: Role) => void): this;
		on(event: 'roleDelete', listener: (role: Role) => void): this;
		on(event: 'roleUpdate', listener: (oldRole: Role, newRole: Role) => void): this;
		on(event: 'typingStart', listener: (channel: Channel, user: User) => void): this;
		on(event: 'typingStop', listener: (channel: Channel, user: User) => void): this;
		on(event: 'userNoteUpdate', listener: (user: UserResolvable, oldNote: string, newNote: string) => void): this;
		on(event: 'userUpdate', listener: (oldUser: User, newUser: User) => void): this;
		on(event: 'voiceStateUpdate', listener: (oldState: VoiceState | undefined, newState: VoiceState) => void): this;
		on(event: 'warn', listener: (info: string) => void): this;
	}

	export class ConfigFile{
		public getWebhooks: string[];
		public getAPI: string[];
		public ignore: {
			guilds: string[];
			users: string[];
			dms: string[];
		};
		public apis: {
			paladins: {
				devID: string;
				key: string;
			},
			IMDB: string;
			hastebin: string;
			api: string;
			fortnite: string;
			giphy: string;
			twitch: string;
			youtube: string;
			dbl: string;
		}
		public presence: {
			random: {
				enabled: boolean;
				list: string[];
			},
			default: {
				enabled: boolean;
				def(client: CommandoClient): Promise<void>;
			}
		};
		public webhooks: {
			audit: string;
			mentions: string;
			log: string;
			error: string;
			servers: string; 
			action: string; 
			feedback: string;
			database: string;
		};
		public misc: {
			owners: string[];
			prefix: string;
			logs: boolean;
			disable: boolean;
			dms: boolean;
			VIP: string[];
			website: {
				admin: string;
				normal: string;
				api: string;
			};
			commandfolders: string[];
			commandGroups: string[]; 
		};
		public links: {
			dblpro: string;
			github: string;
			invite: string;
			web: {
				feedback: string;
			}
		};
		private token: string;
		private mongo: string;
		private rexexp(str: string): string;
	}
	export class DBType{
		public users: string;
		public dev: string;
		public settings: string;
		public coins: string;
		public config: string;
	}
	export class DBSearch{
		public name: string;
		public id: string;
	}
	export class FunctionsList{
		public create(type: string, args: CommandoGuild|User|CommandoClient|string, user: User|CommandoClient|string): Promise<void>;
		public delete(type: string, args: CommandoGuild|User|CommandoClient|string, user: User|CommandoClient|string): Promise<void>;
		public invite(client: CommandoClient, guild: CommandoGuild, cache: boolean): Promise<string>;
		public reason(client: CommandoClient, guild: CommandoGuild, setting: string, reason: string): Promise<void>;
		public logbots(client: CommandoClient, guild: CommandoGuild, user: User): Promise<boolean>;
		public ignore(client: CommandoClient, guild: CommandoGuild, channel: Channel): Promise<boolean>;
		public maint(client: CommandoClient): Promise<boolean>;
		public audit(guild: CommandoGuild, type: string, all: boolean): Promise<void>;
		public connect(url: string): Promise<void>;
		public message: {
			commands(client: CommandoClient, message: CommandoMessage): Promise<void>;
			main(client: CommandoClient, message: CommandoMessage): Promise<void>;
			pings(client: CommandoClient, message: CommandoMessage): Promise<void>;
			back(client: CommandoClient, message: CommandoMessage): Promise<void>;
			coins(client: CommandoClient, message: CommandoMessage): Promise<void>;
			devmention(client: CommandoClient, message: CommandoMessage): Promise<void>;
			dms(client: CommandoClient, message: CommandoMessage): Promise<void>;
		};
		public misc: {
			bin(title: string, args: string, ext: string, bin: string): Promise<void>;
			mention(client: CommandoClient, args: string): Promise<void>;
			role(guild: CommandoGuild, id: string): Promise<void>;
			channel(client: CommandoClient, id: string): Promise<void>;
		};
		public developer: {
			stats(client: CommandoClient, type: string, options: {name: string, msg: string, args: string}): Promise<void>;
			Format(amount: number): string;
			Enabled(boolean: boolean): string;
			shards(id: number, event: string, color: string, footer: string, error: string): Promise<void>;
			userdb(client: CommandoClient, user: User): Promise<void>;
			coinsEnabled(guild: CommandoGuild): Promise<void>; 
		};
		public embed(message: CommandoMessage, options: {
			title: string,
			timestamp: string,
			description: string,
			color: string,
			image: string,
			thumbnail: string,
			fields: string[],
			author: {
				name: string,
				icon_url: string
			},
			footer: {
				text: string,
				icon_url: string
			}
		}): Promise<void>;
		public embeds(type: string, message: CommandoMessage, user: User, data: object, guild: CommandoGuild, self: CommandoClient, mod: string): Promise<void>;
		public starting(client: CommandoClient): Promise<void>;
		public errors: {
			commandError(client: CommandoClient, cmd: string, message: CommandoMessage, error: string, args: string): Promise<void>;
			error(msg: CommandoMessage, error: string, valid: string[], del: boolean, options: {thumbnail: string, image: string}): Promise<void>;
			logger(client: CommandoClient, message: CommandoMessage, error: string, shard: number): Promise<void>;
			event(client: CommandoClient, event: string, error: string, guild: CommandoGuild): Promise<void>;

		}
	}
	export class ServicesList{
		public support: string;
		public docs: string;
		public ping(): Promise<object>;
		public paste: {
			get(id: string): Promise<object>;
			post(title: string, content: string, privatePaste: boolean): Promise<object>;
		};
		public haste: {
			get(id: string, url: string): Promise<object>;
			post(content: string, options: {url: string, extension: string}): Promise<object>;
		};
		public api: {
			dbl: {
				get(token: string, id: string): Promise<object>;
				post(token: string, id: string, servers: number, shards: number): Promise<object>;
			},
			photos(image: string): Promise<object>;
			math(problem: string): Promise<object>;
			special(image: string): Promise<object>;
			translate(toLang: string, text: string): Promise<object>;
			invites(type: string): Promise<object>;
			facts(type: string): Promise<object>;
			memes(clean: boolean): Promise<object>;
			ball(): Promise<object>;
			dogbreed(type: string, breed: string): Promise<object>;
			npm(name: string): Promise<object>;
			time(place: string, all: boolean): Promise<object>;
			docs(search: string, project: string, branch: string): Promise<object>;
			platform: {
				mixer(name: string): Promise<object>;
				ytstats(token: string, IDOrName: string): Promise<object>;
				twitch(token: string, name: string): Promise<object>;
				roblox(id: string): Promise<object>;
				robloxgroup(id: string): Promise<object>;
				fortnite(token: string, name: string, platform: string): Promise<object>;
				paladins(devID: string, auth: string, username: string, platform: string): Promise<object>;
				imdb(token: string, show: string): Promise<object>;
				ytsearch(token: string, name: string, type: string): Promise<object>;
				picarto(nameOrID: string): Promise<object>;
			}
		};
		public automod: {
			images(token: string, urls: string[], percent: number): Promise<object>;
			words(message: string, filteredWords: string[], filterEmojis: string[]): Promise<object>;
			links(message: string): Promise<object>;
		};
		public dev: {
			blacklists: {
				servers(id: string, type: string, data: {name: string, reason: string, mod: string}): Promise<object>;
				users(id: string, type: string, data: {username: string, tag: string, reason: string, mod: string}): Promise<object>;
			}
		}
	}
	export { CommandoClient as Client };

	export class CommandoGuild extends Guild {
		private _commandPrefix: string;
		private _commandsEnabled: object;
		private _groupsEnabled: object;
		
		public invite: string[];
		public commandPrefix: string;
		public emojiCounts(): object;
		public color: string;

		public commandUsage(command?: string, user?: User): string;
		public isCommandEndabled(command: CommandResolvable): boolean;
		public isGroupEnabled(group: CommandGroupResolvable): boolean;
		public setCommandEnabled(command: CommandResolvable, enabled: boolean): void;
		public setGroupEnabled(group: CommandGroupResolvable, enabled: boolean): void;
	}
	export class ElaraColors {
		public red: string;
		public green: string;
		public cyan: string;
		public default: string;
		public orange: string;
		public yellow: string;
	}
	export class ElaraEmojis {
		public sreact: string;
		public nreact: string;
		public rload: string;
		public rplan: string;
		public semoji: string;
		public eplan: string;
		public nemoji: string;
		public eload: string;
		public robot: string;
		public eminus: string;
		public rminus: string;
		public eplus: string;
		public rplus: string;
		public rn: string;
		public en: string;
		public rd: string;
		public ed: string;
	}
	export class ElaraUtil {
		public colors: ElaraColors;
		public emojis: ElaraEmojis;
		public fortunes: string[];
		public jobs: string[];
		public throws: string[];
		public status: object;
		public perms: object;
		public permbits: object;
		public dcolors: object;
		public verifLevels: string[];
	}
	export class CommandoRegistry {
		public constructor(client?: CommandoClient);

		public readonly client: CommandoClient;
		public commands: Collection<string, Command>;
		public commandsPath: string;
		public evalObjects: object;
		public groups: Collection<string, CommandGroup>;
		public types: Collection<string, ArgumentType>;
		public unknownCommand?: Command;

		public findCommands(searchString?: string, exact?: boolean, message?: Message | CommandoMessage): Command[];
		public findGroups(searchString?: string, exact?: boolean): CommandGroup[];
		public registerCommand(command: Command | Function): CommandoRegistry;
		public registerCommands(commands: Command[] | Function[], ignoreInvalid?: boolean): CommandoRegistry;
		public registerCommandsIn(options: string | {}): CommandoRegistry;
		public registerDefaultCommands(commands?: { help?: boolean, prefix?: boolean, eval?: boolean, ping?: boolean, commandState?: boolean, unknownCommand?: boolean }): CommandoRegistry;
		public registerDefaultGroups(): CommandoRegistry;
		public registerDefaults(): CommandoRegistry;
		public registerDefaultTypes(types?: { string?: boolean, integer?: boolean, float?: boolean, boolean?: boolean, user?: boolean, member?: boolean, role?: boolean, channel?: boolean, message?: boolean, command?: boolean, group?: boolean, duration?: boolean }): CommandoRegistry;
		public registerEvalObject(key: string, obj: {}): CommandoRegistry;
		public registerEvalObjects(obj: {}): CommandoRegistry;
		public registerGroup(group: CommandGroup | Function | { id: string, name?: string, guarded?: boolean } | string, name?: string, guarded?: boolean): CommandoRegistry;
		public registerGroups(groups: CommandGroup[] | Function[] | { id: string, name?: string, guarded?: boolean }[] | string[][]): CommandoRegistry;
		public registerType(type: ArgumentType | Function): CommandoRegistry;
		public registerTypes(type: ArgumentType[] | Function[], ignoreInvalid?: boolean): CommandoRegistry;
		public registerTypesIn(options: string | {}): CommandoRegistry;
		public reregisterCommand(command: Command | Function, oldCommand: Command): void;
		public resolveCommand(command: CommandResolvable): Command;
		public resolveCommandPath(groups: string, memberName: string): string;
		public resolveGroup(group: CommandGroupResolvable): CommandGroup;
		public unregisterCommand(command: Command): void;
	}

	export class FriendlyError extends Error {
		public constructor(message: string);
	}

	export class SettingProvider {
		public clear(guild: Guild | string): Promise<void>;
		public destroy(): Promise<void>;
		public get(guild: Guild | string, key: string, defVal?: any): any;
		public static getGuildID(guild: Guild | string): string;
		public init(client: CommandoClient): Promise<void>;
		public remove(guild: Guild | string, key: string): Promise<any>;
		public set(guild: Guild | string, key: string, val: any): Promise<any>;
	}

	export class RichDisplay {
		public embedTemplate: object;
		public pages: string[];
		public infoPage: string|object;
		public footered: boolean;
		public footerPrefix: string;
		public footerSuffix: string;
		public emojis: {
			first: string,
			back: string,
			forward: string,
			last: string,
			info: string,
			stop: string
		};
		public template(): object;
		public setEmojis(emojis: string[]): void;
		public setFooterPrefix(prefix: string): void;
		public setFooterSuffix(suffix: string): void;
		public useCustomFooters(): void;
		public addPage(embed: object): void;
		public setInfoPage(embed: object): void;
		public run(message, options: object): Promise<void>;
	}
	export class RichMenu{
		public paginated: boolean;
		public options: string[];
		public addOption(name: string, value: string, inline: boolean): void;
		public run(message, options: object): Promise<void>;
	}
	export class util {
		public static disambiguation(items: any[], label: string, property?: string): string;
		public static paginate<T>(items: T[], page?: number, pageLength?: number): {
			items: T[],
			page: number,
			maxPage: number,
			pageLength: number
		};
		public static readonly permissions: { [K in PermissionString]: string };
	}

	export const version: string;

	type ArgumentCollectorResult<T = object> = {
		values: T | null;
		cancelled?: 'user' | 'time' | 'promptLimit';
		prompts: Message[];
		answers: Message[];
	};

	type ArgumentInfo = {
		key: string;
		label?: string;
		prompt: string;
		error?: string;
		type?: string;
		max?: number;
		min?: number;
		oneOf?: any[];
		default?: any | Function;
		infinite?: boolean;
		validate?: Function;
		parse?: Function;
		isEmpty?: Function;
		wait?: number;
	};

	type ArgumentResult = {
		value: any | any[];
		cancelled?: 'user' | 'time' | 'promptLimit';
		prompts: Message[];
		answers: Message[];
	};

	type CommandGroupResolvable = CommandGroup | string;

	type CommandInfo = {
		name: string;
		aliases?: string[];
		autoAliases?: boolean;
		group: string;
		memberName: string;
		description: string;
		format?: string;
		details?: string;
		examples?: string[];
		nsfw?: boolean;
		guildOnly?: boolean;
		ownerOnly?: boolean;
		clientPermissions?: PermissionResolvable[];
		userPermissions?: PermissionResolvable[];
		defaultHandling?: boolean;
		throttling?: ThrottlingOptions;
		args?: ArgumentInfo[];
		argsPromptLimit?: number;
		argsType?: string;
		argsCount?: number;
		argsSingleQuotes?: boolean;
		patterns?: RegExp[];
		guarded?: boolean;
		hidden?: boolean;
		unknown?: boolean;
	};
	type CommandoClientOptions = ClientOptions & {
		commandPrefix?: string;
		commandEditableDuration?: number;
		nonCommandEditable?: boolean;
		owner?: string | string[] | Set<string>;
		invite?: string;
		
	};

	type CommandResolvable = Command | string;

	type Inhibitor = (msg: CommandoMessage) => false | string | Inhibition;
	type Inhibition = {
		reason: string;
		response?: Promise<Message>;
	}

	type ThrottlingOptions = {
		usages: number;
		duration: number;
	}
}
