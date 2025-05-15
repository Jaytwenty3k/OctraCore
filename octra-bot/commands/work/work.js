const { SlashCommandBuilder } = require('discord.js');
const { supabase } = require('../../utils/supabaseClient'); // Dein Supabase Client

module.exports = {
  data: new SlashCommandBuilder()
    .setName('work')
    .setDescription('Arbeite und verdiene Geld!'),

  async execute(interaction) {
    const userId = interaction.user.id;
    
    // Verbinde mit Supabase
    console.log('🔄 Verbinde mit Supabase...');
    const { data: user, error: userError } = await supabase
      .from('users')
      .select('*')
      .eq('user_id', userId)
      .single();
    
    if (userError && userError.code !== 'PGRST116') {
      return interaction.reply({ content: '❌ Fehler bei der Verbindung zur Datenbank', ephemeral: true });
    }

    // Wenn der Benutzer noch keinen Job hat, dann Job-Auswahl durchführen
    if (!user || !user.job_id) {
      return interaction.reply({ content: '🔄 Du musst zuerst deinen Job auswählen! Nutze `/job_select`.', ephemeral: true });
    }

    // Cooldown prüfen (4 Stunden)
    if (user.last_work && (new Date() - new Date(user.last_work)) < 4 * 60 * 60 * 1000) {
      return interaction.reply({ content: '❌ Du kannst erst wieder in 4 Stunden arbeiten!', ephemeral: true });
    }

    // Berechne Gehalt und XP
    const { data: job } = await supabase
      .from('jobs')
      .select('*')
      .eq('job_id', user.job_id)
      .single();

    const salary = job.base_salary + Math.floor(Math.random() * 50); // Zufälliges Gehalt basierend auf dem Job
    const xpReward = job.xp_reward + Math.floor(Math.random() * 50); // Zufällige XP-Belohnung

    // XP und Level up
    let newXp = user.xp + xpReward;
    let newLevel = user.level;
    while (newXp >= newLevel * 100) { // Beispiel Level-Up
      newXp -= newLevel * 100;
      newLevel++;
    }

    // Aktuellen Arbeitszeitpunkt setzen
    const { error: updateError } = await supabase
      .from('users')
      .update({ last_work: new Date(), xp: newXp, level: newLevel })
      .eq('user_id', userId);

    if (updateError) {
      return interaction.reply({ content: '❌ Fehler beim Aktualisieren der Daten', ephemeral: true });
    }

    // Erfolgreiche Antwort zurückgeben
    interaction.reply({
      content: `🛠️ Du hast gearbeitet und ${salary} Geld verdient!\nXP: +${xpReward}\nDein neues Level: ${newLevel}`,
      ephemeral: true,
    });
  },
};
