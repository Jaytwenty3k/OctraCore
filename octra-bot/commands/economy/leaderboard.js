const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { supabase } = require('../../utils/supabaseClient');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('leaderboard')
    .setDescription('Zeigt die Rangliste der reichsten Nutzer an.'),
  
  async execute(interaction) {
    // Abfrage der Top 10 Nutzer mit dem höchsten Kontostand
    const { data: leaderboard, error } = await supabase
      .from('users')
      .select('user_id, balance')
      .order('balance', { ascending: false })
      .limit(10);
    
    if (error) {
      return interaction.reply({ content: 'Es gab ein Problem beim Abrufen der Rangliste.', ephemeral: true });
    }
    
    // Erstelle das Embed für die Rangliste
    const leaderboardEmbed = new EmbedBuilder()
      .setColor('#0099ff')
      .setTitle('Top 10 Reichste Nutzer')
      .setDescription('Die Nutzer mit dem höchsten Kontostand.')
      .addFields(
        leaderboard.map((user, index) => ({
          name: `#${index + 1} - <@${user.user_id}>`,
          value: `${user.balance} Geld`,
        }))
      )
      .setTimestamp()
      .setFooter({ text: 'Octra-Bot' });
    
    return interaction.reply({ embeds: [leaderboardEmbed] });
  },
};
