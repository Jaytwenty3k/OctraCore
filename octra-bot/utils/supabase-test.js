// test-supabase.js
require("dotenv").config();
const { createClient } = require("@supabase/supabase-js");

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

async function testConnection() {
  try {
    const { data, error } = await supabase.from("users").select("*").limit(1);
    if (error) {
      console.error("Fehler bei der Datenbankabfrage:", error);
    } else {
      console.log("Verbindung erfolgreich:", data);
    }
  } catch (err) {
    console.error("Verbindungsfehler:", err);
  }
}

testConnection();
