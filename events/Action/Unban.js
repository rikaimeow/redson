const { MessageEmbed } = require('discord.js');
const { GuildChannel, LogsDatabase } = require('../../models');
const { LogChannel } = require('../../Functions/logChannelFunctions');
module.exports = {
    event: "guildBanRemove",
    once: false,
    run: async(Guild)=> {
    try{ 
        const fetchedLogs = await Guild.guild.fetchAuditLogs({
            limit: 1,
            type: 'MEMBER_BAN_REMOVE:',
        });

        const unBanLog = fetchedLogs.entries.first()
        if(!unBanLog){
            return console.log(`${member.id} was banned from ${guild.name} but couldn't find any informations`)
        }

        const { executor, target } = unBanLog

        const unbanEmbed = {
            color: "#45ff6d",
            author: {
                name: `UNBAN DETECTION - ${target.tag}`,
                icon_url: target.displayAvatarURL({
                    dynamic: true , 
                    type: 'png'
                })
            },
            fields: [
                {
                    name: `Member`,
                    value: `\`\`\`${target.tag.toString()}\`\`\``,
                    inline: true
                },
                {
                    name: `Moderator`,
                    value: `\`\`\`${executor.tag.toString()}\`\`\``,
                    inline: true
                },
            ],
            timestamp: new Date(),
            footer: {
                text: `${target.id}`
            }
        }
        LogChannel('banLog', Guild.guild).then(c => {
            if(!c) return;
            if(c === null) return;

            else {
                c.send({embeds: [unbanEmbed]})
            }
        }).catch(err => console.log(err));
    }catch(err){
        return console.log(err)
    }
    }
}