const { SlashCommandBuilder } = require('discord.js');
const { supabase } = require('../../utils/supabaseClient');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('auction')
    .setDescription('Versteigere einen Gegenstand oder biete auf eine Auktion.')
    .addStringOption(option =>
      option.setName('action')
        .setDescription('Wähle ob du bieten oder versteigern möchtest.')
        .setRequired(true)
        .addChoices(
          { name: 'Bieten', value: 'bid' },
          { name: 'Versteigern', value: 'sell' }
        )
    )
    .addIntegerOption(option =>
      option.setName('amount')
        .setDescription('Betrag oder Preis für den Auktionseinsatz.')
        .setRequired(true)
    ),
  
  async execute(interaction) {
    const userId = interaction.user.id;
    const action = interaction.options.getString('action');
    const amount = interaction.options.getInteger('amount');
    
    if (action === 'sell') {
      // Auktionsverkauf
      // Hier muss der Preis und das Item zum Verkauf hinzugefügt werden
      return interaction.reply({ content: `Du hast den Gegenstand erfolgreich für **${amount}** versteigert!` });
    } else if (action === 'bid') {
      // Bieten
      return interaction.reply({ content: `Du hast auf die Auktion mit **${amount}** geboten!` });
    }
  },
};
