const { SlashCommandBuilder } = require('discord.js');
const { supabase } = require('../../utils/supabaseClient');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('shop')
    .setDescription('Kaufe Items im Shop.')
    .addStringOption(option =>
      option.setName('item')
        .setDescription('Wähle das Item, das du kaufen möchtest.')
        .setRequired(true)
        .addChoices(
          { name: 'Windrad', value: 'windmill' },
          { name: 'Upgrades', value: 'upgrade' },
        )
    ),
  
  async execute(interaction) {
    const userId = interaction.user.id;
    const item = interaction.options.getString('item');
    
    // Überprüfe, ob der Benutzer genug Guthaben hat
    const { data: user, error } = await supabase
      .from('users')
      .select('balance')
      .eq('user_id', userId)
      .single();
    
    if (error || !user) {
      return interaction.reply({ content: 'Du hast noch kein Konto. Bitte arbeite zuerst, um ein Konto zu erstellen.', ephemeral: true });
    }
    
    let itemPrice = 0;
    
    // Preis der Items definieren
    if (item === 'windmill') {
      itemPrice = 500; // Beispielpreis für ein Windrad
    } else if (item === 'upgrade') {
      itemPrice = 1000; // Beispielpreis für ein Upgrade
    }
    
    if (user.balance < itemPrice) {
      return interaction.reply({ content: `Du hast nicht genug Geld, um das Item zu kaufen. Du benötigst **${itemPrice}**`, ephemeral: true });
    }
    
    // Abziehen des Geldes vom Konto und Bestätigung
    const newBalance = user.balance - itemPrice;
    const { error: updateError } = await supabase
      .from('users')
      .update({ balance: newBalance })
      .eq('user_id', userId);
    
    if (updateError) {
      return interaction.reply({ content: 'Es gab ein Problem beim Kauf des Items.', ephemeral: true });
    }
    
    return interaction.reply({
      content: `Du hast erfolgreich ein **${item}** gekauft! Dein neuer Kontostand beträgt: **${newBalance}**.`
    });
  },
};
