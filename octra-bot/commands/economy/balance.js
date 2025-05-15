const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const supabase = require("../../utils/supabaseClient");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("balance")
    .setDescription("Zeigt deinen Kontostand an"),
  async execute(interaction) {
    try {
      const userId = interaction.user.id;
      console.log(`🔄 /balance ausgeführt für Benutzer: ${userId}`);

      // Überprüfen, ob der Benutzer in der Datenbank existiert
      const { data, error } = await supabase
        .from("users")
        .select("balance")
        .eq("user_id", userId)
        .single();

      if (error) {
        console.error("❌ Fehler beim Abrufen des Kontostands:", error);
        await interaction.reply({
          content: "Es gab ein Problem beim Abrufen deines Kontostands.",
          ephemeral: true,
        });
        return;
      }

      let balance = 0;

      if (data) {
        balance = data.balance;
      } else {
        // Benutzer nicht gefunden, neuen Eintrag erstellen
        const { error: insertError } = await supabase
          .from("users")
          .insert([{ user_id: userId, balance: 0 }]);

        if (insertError) {
          console.error("❌ Fehler beim Erstellen des Benutzers:", insertError);
          await interaction.reply({
            content: "Es gab ein Problem beim Erstellen deines Benutzerkontos.",
            ephemeral: true,
          });
          return;
        }
      }

      // Erstelle ein Embed
      const embed = new EmbedBuilder()
        .setColor(0x0099ff)
        .setTitle("💰 Kontostand")
        .setDescription(`Dein aktueller Kontostand beträgt **${balance}** Coins.`)
        .setThumbnail(interaction.user.displayAvatarURL())
        .setFooter({ text: `Angefordert von ${interaction.user.tag}` })
        .setTimestamp();

      await interaction.reply({ embeds: [embed], ephemeral: true });
      console.log(`✅ Kontostand erfolgreich angezeigt: ${balance} Coins`);
    } catch (err) {
      console.error("❌ Fehler beim Ausführen des /balance-Befehls:", err);
      await interaction.reply({
        content: "Ein Fehler ist aufgetreten. Bitte versuche es später erneut.",
        ephemeral: true,
      });
    }
  },
};
