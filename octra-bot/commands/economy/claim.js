const { SlashCommandBuilder } = require('discord.js');
const { supabase } = require('../../utils/supabaseClient');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('claim')
    .setDescription('Fordere dein passives Einkommen an.'),
  
  async execute(interaction) {
    const userId = interaction.user.id;
    
    // Überprüfe, ob der Benutzer in der Datenbank existiert
    const { data: user, error } = await supabase
      .from('users')
      .select('balance, passive_income')
      .eq('user_id', userId)
      .single();
    
    if (error || !user) {
      return interaction.reply({ content: 'Du hast noch kein Konto. Bitte arbeite zuerst, um ein Konto zu erstellen.', ephemeral: true });
    }
    
    // Berechne passives Einkommen (z.B. Windräder)
    const passiveIncome = user.passive_income || 0;
    const newBalance = user.balance + passiveIncome;
    
    // Aktualisiere den Kontostand
    const { error: updateError } = await supabase
      .from('users')
      .update({ balance: newBalance })
      .eq('user_id', userId);
    
    if (updateError) {
      return interaction.reply({ content: 'Es gab ein Problem beim Abrufen deines Einkommens.', ephemeral: true });
    }
    
    // Bestätigung der Auszahlung
    return interaction.reply({ 
      content: `Du hast dein passives Einkommen erhalten! Dein neuer Kontostand beträgt: **${newBalance}**.`
    });
  },
};
