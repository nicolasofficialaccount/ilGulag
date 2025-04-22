const { SlashCommandBuilder, EmbedBuilder, PermissionsBitField } = require('discord.js');

// Inserisci qui l'ID del canale target
const TARGET_CHANNEL_ID = '1364126924284104784';

module.exports = {
    data: new SlashCommandBuilder()
        .setName('valutazione')
        .setDescription('Permette ai membri amministrativi di assegnare una valutazione')
        .addUserOption(option =>
            option.setName('utente')
                .setDescription('L\'utente da valutare')
                .setRequired(true))
        .addIntegerOption(option =>
            option.setName('valore')
                .setDescription('Valutazione da 1 a 5')
                .setRequired(true)
                .setMinValue(1)
                .setMaxValue(5)),

    async execute(interaction) {
        // Controlla se l'utente ha i permessi amministrativi
        if (!interaction.member.permissions.has(PermissionsBitField.Flags.Administrator)) {
            return interaction.reply({ content: 'Non hai i permessi per usare questo comando.', ephemeral: true });
        }

        const utente = interaction.options.getUser('utente');
        const valore = interaction.options.getInteger('valore');

        // Determina il colore dell'embed in base alla valutazione
        let embedColor;
        if (valore >= 4) {
            embedColor = 0x00ff00; // Verde (positivo)
        } else if (valore <= 2) {
            embedColor = 0xff0000; // Rosso (negativo)
        } else {
            embedColor = 0xffff00; // Giallo (neutro)
        }

        // Crea l'embed
        const embed = new EmbedBuilder()
            .setTitle('📊 Nuova Valutazione')
            .setDescription(`È stata assegnata una nuova valutazione a ${utente}.`)
            .addFields(
                { name: 'Utente', value: `${utente.tag}`, inline: true },
                { name: 'Valutazione', value: `${valore}/5 ⭐`, inline: true },
                { name: 'Assegnata da', value: `${interaction.user.tag}` }
            )
            .setColor(embedColor)
            .setTimestamp();

        // Recupera il canale di destinazione
        const targetChannel = interaction.guild.channels.cache.get(TARGET_CHANNEL_ID);
        if (!targetChannel) {
            return interaction.reply({ content: '❌ Canale di destinazione non trovato. Controlla l\'ID.', ephemeral: true });
        }

        await targetChannel.send({ embeds: [embed] });

        // Risposta privata all'utente che ha eseguito il comando
        await interaction.reply({ content: `✅ Valutazione di ${valore}/5 assegnata a ${utente.tag} e inviata nel canale.`, ephemeral: true });
    },
};
