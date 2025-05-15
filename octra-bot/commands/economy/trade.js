const { SlashCommandBuilder } = require('discord.js');
const { supabase } = require('../../utils/supabaseClient');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('trade')
    .setDescription('Tausche Items oder Geld mit einem anderen Nutzer.')
    .addUserOption(option => 
      option.setName('partner')
        .setDescription('Der Nutzer, mit dem du handeln möchtest.')
        .setRequired(true)
    )
    .addIntegerOption(option =>
      option.setName('amount')
        .setDescription('Betrag, den du tauschen möchtest.')
        .setRequired(true)
    ),
  
  async execute(interaction) {
    const userId = interaction.user.id;
    const partnerId = interaction.options.getUser('partner').id;
    const amount = interaction.options.getInteger('amount');
    
    // Hole das Guthaben des Nutzers
    const { data: user, error } = await supabase
      .from('users')
      .select('balance')
      .eq('user_id', userId)
      .single();
    
    if (error || !user) {
      return interaction.reply({ content: 'Du hast noch kein Konto. Bitte arbeite zuerst, um ein Konto zu erstellen.', ephemeral: true });
    }
    
    if (user.balance < amount) {
      return interaction.reply({ content: 'Du hast nicht genug Geld für diesen Handel.', ephemeral: true });
    }
    
    // Reduziere das Guthaben des Nutzers und des Partners entsprechend
    const { data: partner, partnerError } = await supabase
      .from('users')
      .select('balance')
      .eq('user_id', partnerId)
      .single();
    
    if (partnerError || !partner) {
      return interaction.reply({ content: 'Der Handelspartner existiert nicht oder hat kein Konto.', ephemeral: true });
    }
    
    const newUserBalance = user.balance - amount;
    const newPartnerBalance = partner.balance + amount;
    
    // Update das Guthaben
    await supabase.from('users').update({ balance: newUserBalance }).eq('user_id', userId);
    await supabase.from('users').update({ balance: newPartnerBalance }).eq('user_id', partnerId);
    
    return interaction.reply({
      content: `Du hast erfolgreich **${amount}** an **${partnerId}** getauscht! Dein neuer Kontostand beträgt **${newUserBalance}**.`
    });
  },
};
