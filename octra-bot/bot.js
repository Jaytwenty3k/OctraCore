// bot.js
require("dotenv").config();
const fs = require("fs");
const path = require("path");
const { Client, GatewayIntentBits, Collection, REST, Routes } = require("discord.js");

// Client erstellen
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMembers,
  ],
});
client.commands = new Collection();
const commands = [];

// 🔄 Rekursives Laden aller Commands
function loadCommands(dir) {
  const files = fs.readdirSync(dir, { withFileTypes: true });
  for (const file of files) {
    const fullPath = path.join(dir, file.name);
    if (file.isDirectory()) {
      loadCommands(fullPath); // Unterordner durchsuchen
    } else if (file.name.endsWith(".js")) {
      const command = require(fullPath);
      if (command.data && command.data.name) {
        client.commands.set(command.data.name, command);
        commands.push(command.data.toJSON());
        console.log(`✅ Command geladen: ${command.data.name} (${fullPath})`);
      } else {
        console.warn(`⚠️ Fehlerhafte Command-Datei: ${fullPath}`);
      }
    }
  }
}

// Befehle laden
loadCommands(path.join(__dirname, "commands"));

// 🔄 Slash-Commands zu Discord hochladen
const rest = new REST({ version: "10" }).setToken(process.env.TOKEN);
(async () => {
  try {
    console.log("🔄 Slash-Commands werden registriert...");
    await rest.put(
      Routes.applicationCommands(process.env.CLIENT_ID),
      { body: commands }
    );
    console.log("✅ Slash-Commands erfolgreich registriert!");
  } catch (error) {
    console.error("❌ Fehler beim Registrieren der Slash-Commands:", error);
  }
})();

// 🔄 Events automatisch laden
const eventFiles = fs.readdirSync("./events").filter(file => file.endsWith(".js"));
for (const file of eventFiles) {
  const event = require(`./events/${file}`);
  const eventName = file.split(".")[0];
  client.on(eventName, (...args) => event.execute(...args, client));
  console.log(`✅ Event geladen: ${eventName}`);
}

// Client einloggen
client.on("interactionCreate", (interaction) => {
  console.log("🔄 Interaktion erkannt:", interaction.commandName);
});

client.login(process.env.TOKEN);
