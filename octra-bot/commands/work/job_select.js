const { ActionRowBuilder, StringSelectMenuBuilder, SlashCommandBuilder } = require('discord.js');

module.exports = { slashb
  data: { 
    name: 'job_select', // Slash-Befehl für Jobwahl
    description: 'Wähle deinen Job!',
  },
  async execute(interaction) {
    // Auswahlmenü erstellen
    const jobSelectMenu = new ActionRowBuilder()
      .addComponents(
        new StringSelectMenuBuilder()
          .setCustomId('job_select_menu')
          .setPlaceholder('Wähle deinen Job')
          .addOptions(
            { label: 'Farmer', value: 'Farmer' },
            { label: 'Miner', value: 'Miner' },
            { label: 'Builder', value: 'Builder' }
          )
      );

    await interaction.reply({
      content: 'Wähle deinen Job!',
      components: [jobSelectMenu],
    });
  },
};
