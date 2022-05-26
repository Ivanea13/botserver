const { SlashCommandBuilder } = require('@discordjs/builders')
const { MessageEmbed } = require('discord.js')
const config = require('../../config.json')
const fetch = require('node-fetch')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('youtube')
        .setDescription('Crea una sesion de YouTube.')
        .addBooleanOption(option => option.setName('ilimitado').setDescription('Activa esta opcion para que la invitacion nunca expire. De lo contrario expirara a los 15 minutos.')),
    async run(client, interaction, language) {
        await interaction.reply({ content: client.languages.__({ phrase: 'youtube.loading', locale: language }), ephemeral: true}) 
        if (!interaction.member.voice.channel) return interaction.editReply({ content: client.languages.__({ phrase: 'youtube.noChannel', locale: language}), ephemeral: true})
        if (interaction.options._hoistedOptions[0]?.value) {
            //Crear la invitacion
            createTogetherCode(client,  interaction.member.voice.id, '755600276941176913', 900).then(invite => {
                const embed = new MessageEmbed()
                .setColor(config.defaultSuccessColor)
                .setDescription(`**[Haz click aqui](${invite.code} 'Enlace de YouTube')**`)
                return interaction.editReply({ content: ' ', embeds: [embed]})
            }).catch(e => {
                if (e == 'Ha ocurrido un error al obtener los datos.') {
                    const errorembed = new MessageEmbed()
                    .setColor(config.defaultErrorColor)
                    .setTitle(client.languages.__({ phrase: 'utilities.errorEmbed', locale: language}))
                    .setDescription(client.languages.__({ phrase: 'utilities.unexpectedError', locale: language}))
                    .setFooter(interaction.member.user.username, interaction.member.user.avatarURL())
                    return interaction.editReply({ content: ' ', embeds: [errorembed]})
                } else if (e == 'Tu bot no tiene los permisos necesarios.') {
                    const errorembed = new MessageEmbed()
                    .setColor(config.defaultErrorColor)
                    .setTitle(client.languages.__({ phrase: 'utilities.errorEmbed', locale: language}))
                    .setDescription(client.languages.__({ phrase: 'utilities.noInvitePerms', locale: language}))
                    .setFooter(interaction.member.user.username, interaction.member.user.avatarURL())
                    return interaction.editReply({ content: ' ', embeds: [errorembed] })
                }
            })
        } else {

        }
    }                               
}

async function createTogetherCode(client, voiceChannelId, applicationID, time) {
    let returnData = {}
    return new Promise((resolve, reject) => {
        fetch(`https://discord.com/api/v8/channels/${voiceChannelId}/invites`, {
            method: 'POST',
            body: JSON.stringify({
                max_age: time,
                max_uses: 0,
                target_application_id: applicationID,
                target_type: 2,
                temporary: false,
                validate: null
            }),
            headers: {
                'Authorization': `Bot ${client.token}`,
                'Content-Type': 'application/json'
            }
        }).then(res => res.json())
        .then(invite => {
            if (invite.error || !invite.code) reject('Ha ocorrido un error al obtener los datos.')
            if (invite.code === 50013 || invite.code === '50013') reject('Tu bot no tiene los permisos necesarios')
            returnData.code = `https://discord.com/invite/${invite.code}`
            resolve(returnData)
        }).catch(e => {
            console.log(e)
        })

    })
}