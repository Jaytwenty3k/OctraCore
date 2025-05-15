// events/interactionCreate.js
module.exports = {
  name: "interactionCreate",
  async execute(interaction, client) {
    console.log(`🔄 Interaktion erkannt: ${interaction.commandName}`);

    // Überprüfe, ob die Interaktion ein Slash-Command ist
    if (!interaction.isCommand()) return;

    const command = client.commands.get(interaction.commandName);
    if (!command) return;

    try {
      console.log(`📝 Führe Command aus: ${interaction.commandName}`);
      await command.execute(interaction);
    } catch (error) {
      console.error(`❌ Fehler beim Ausführen von ${interaction.commandName}:`, error);
      await interaction.reply({
        content: "❌ Ein Fehler ist aufgetreten. Bitte versuche es später erneut.",
        ephemeral: true,
      });
    }
  },
};

client.on('interactionCreate', async (interaction) => {
  if (!interaction.isSelectMenu()) return; // Nur auf Auswahlmenü reagieren

  if (interaction.customId === 'job_select_menu') {
    const selectedJobId = interaction.values[0]; // Der ausgewählte Job
    const userId = interaction.user.id;

    // Job in der Datenbank speichern/aktualisieren
    const { error } = await supabase
      .from('users')
      .update({ job_id: selectedJobId })
      .eq('user_id', userId);

    if (error) {
      return interaction.reply({ content: '❌ Fehler beim Jobwechsel.', ephemeral: true });
    }

    // Benutzerdefiniertes Event auslösen
    client.emit('jobSelect', userId, selectedJobId);

    interaction.reply({ content: `Du hast den Job "${selectedJobId}" erfolgreich ausgewählt!`, ephemeral: true });
  }
});
