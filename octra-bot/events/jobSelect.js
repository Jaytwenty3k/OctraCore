client.on('jobSelect', async (userId, selectedJobId) => {
  console.log(`Benutzer ${userId} hat den Job ${selectedJobId} gewählt.`);

  // Beispiel: Datenbankeintrag für den Job anpassen
  // Hier kannst du auch den Joblevel, das Gehalt oder zusätzliche Daten aktualisieren

  // Gehalt basierend auf dem Job berechnen (hier als Beispiel)
  let salary = 0;
  if (selectedJobId === 'Farmer') {
    salary = 50; // Beispielgehalt für Farmer
  } else if (selectedJobId === 'Miner') {
    salary = 75; // Beispielgehalt für Miner
  } else {
    salary = 100; // Standardgehalt
  }

  // Gehalt dem Benutzer hinzufügen
  const { error } = await supabase
    .from('users')
    .update({ balance: supabase.raw('balance + ?', [salary]) })
    .eq('user_id', userId);

  if (error) {
    console.error(`Fehler beim Hinzufügen des Gehalts für Benutzer ${userId}:`, error);
  }

  // Optional: Benutzer über das neue Gehalt informieren
  const user = await client.users.fetch(userId);
  user.send(`Du hast den Job "${selectedJobId}" gewählt und erhältst ein Gehalt von ${salary} Münzen!`);
});
// Joblevel im Event handler hinzufügen
const { data: userData } = await supabase
  .from('users')
  .select('job_level')
  .eq('user_id', userId)
  .single();

let newJobLevel = userData.job_level || 1; // Standardwert für das Level

// Joblevel erhöhen
newJobLevel++;

const { error } = await supabase
  .from('users')
  .update({ job_level: newJobLevel })
  .eq('user_id', userId);

if (error) {
  console.error(`Fehler beim Joblevel erhöhen für Benutzer ${userId}:`, error);
}

// Benutzer über das Level-up informieren
const user = await client.users.fetch(userId);
user.send(`Du hast jetzt Level ${newJobLevel} im Job "${selectedJobId}" erreicht!`);
