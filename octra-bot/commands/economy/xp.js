const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { supabase } = require('../../utils/supabaseClient');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('xp')
    .setDescription('Zeigt deinen aktuellen Level und XP an.'),
  
  async execute(interaction) {
    const userId = interaction.user.id;
    
    // Hole die Daten des Nutzers
    const { data: user, error } = await supabase
      .from('users')
      .select('level, xp')
      .eq('user_id', userId)
      .single();
    
    if (error || !user) {
      return interaction.reply({ content: 'Du hast noch kein Konto. Bitte arbeite zuerst, um ein Konto zu erstellen.', ephemeral: true });
    }
    
    // Erstelle das Embed für Level und XP
    const xpEmbed = new EmbedBuilder()
      .setColor('#0099ff')
      .setTitle(`${interaction.user.username}'s Level und XP`)
      .addFields(
        { name: 'Level', value: `${user.level}`, inline: true },
        { name: 'XP', value: `${user.xp}`, inline: true }
      )
      .setTimestamp()
      .setFooter({ text: 'Octra-Bot' });
    
    return interaction.reply({ embeds: [xpEmbed] });
  },
};
