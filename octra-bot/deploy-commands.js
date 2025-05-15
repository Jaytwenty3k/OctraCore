// deploy-commands.js
require("dotenv").config();
const fs = require("fs");
const path = require("path");
const { REST, Routes } = require("discord.js");

// Befehle laden
const commands = [];
function loadCommands(dir) {
  const files = fs.readdirSync(dir, { withFileTypes: true });
  for (const file of files) {
    const fullPath = path.join(dir, file.name);
    if (file.isDirectory()) {
      loadCommands(fullPath);
    } else if (file.name.endsWith(".js")) {
      const command = require(fullPath);
      if (command.data && command.data.name) {
        commands.push(command.data.toJSON());
        console.log(`✅ Command registriert: ${command.data.name} (${fullPath})`);
      }
    }
  }
}
loadCommands(path.join(__dirname, "commands"));

// Befehle zu Discord hochladen
const rest = new REST({ version: "10" }).setToken(process.env.TOKEN);
(async () => {
  try {
    console.log("🔄 Registriere Slash-Commands...");
    await rest.put(
      Routes.applicationCommands(process.env.CLIENT_ID),
      { body: commands }
    );
    console.log("✅ Slash-Commands erfolgreich registriert!");
  } catch (error) {
    console.error("❌ Fehler beim Registrieren der Slash-Commands:", error);
  }
})();
