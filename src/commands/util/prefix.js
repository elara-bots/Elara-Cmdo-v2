const {Command} = require('elaracmdo'), {MessageEmbed} = require('discord.js');
module.exports = class NCommand extends Command {
         constructor(client) {
           super(client, {
             name: 'prefix',
             memberName: 'prefix',
             aliases: [`setprefix`],
             examples: [`${client.commandPrefix}prefix`],
             description: 'Checks the prefix',
             group: 'bot',
             guarded: true,
             clientPermissions: ["EMBED_LINKS", "SEND_MESSAGES"],
             throttling: {
                usages: Globalcooldown.special.usage,
                duration: Globalcooldown.special.duration
            },
            args: [
              {
                key: "prefix",
                prompt: "What do you want the new prefix to be?",
                type: "string",
                default: "",
                min: 1,
                max: 150
              }
            ]
})
}
        async run(message, {prefix}) {
        try{
        let e = new MessageEmbed().setColor(this.client.util.colors.default)
        if(message.guild){
           e.setColor(message.guild.color);
          this.client.dbs.settings.findOne({guildID: message.guild.id}, async (err, db) => {
            if(db){
              if(prefix !== ""){
              if(!message.member.hasPermission("MANAGE_GUILD")) return this.client.error(this.client, message, `You need the \`Manage Server\` permission to change the prefix!`);
              if(prefix.toLowerCase() === "reset" || prefix.toLowerCase() === "default" || db.prefix.toLowerCase() === prefix.toLowerCase()){
              db.prefix = "";
              db.save().catch(err => console.log(err));
              message.guild._commandPrefix = this.client.commandPrefix;
              e.setDescription(`Use \`${this.client.commandPrefix}\` for commands!`).setTitle(`Prefix reset`);
              return message.channel.send(e)
              }else{
                db.prefix = prefix.toLowerCase();
                db.save().catch(err => console.log(err));
                message.guild._commandPrefix = prefix;
                e.setDescription(`Use \`${prefix}\` for commands!`).setTitle(`New Prefix`);
                return message.channel.send(e)
              }
              }else{
              e.setTitle(`Prefix`).setAuthor(message.guild.name, message.guild.iconURL()).setDescription(db.prefix || this.client.commandPrefix)
              if(message.member.hasPermission("MANAGE_GUILD")) e.setFooter(`Note: To change the prefix do ${db.prefix || this.client.commandPrefix}setprefix [newprefix]`);
              return message.channel.send(e)
              }
            }else{
              e.setTitle(`Prefix`).setAuthor(message.guild.name, message.guild.iconURL()).setDescription(this.client.commandPrefix)
              if(message.member.hasPermission("MANAGE_GUILD")) e.setFooter(`Note: To change the prefix do ${this.client.commandPrefix}setprefix [newprefix]`);
              return message.channel.send(e)
            }
          });
        }else{
          e.setTitle(`Prefix`).setDescription(this.client.commandPrefix)
          return message.channel.send(e)
        }

          } catch (e) {
            this.client.error(this.client, message, e);
            this.client.logger(this.client, message, e.stack)
          }
}
}
