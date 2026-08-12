const { Client, GatewayIntentBits } = require('discord.js');
const http = require('http');

const client = new Client({ intents: [GatewayIntentBits.Guilds] });

const CHANNEL_ID = '691426509583417406';
const FRASES = [
  'Blizzer furrita <a:GW_gatococa:1280306527609290843>',
  'Bizzler te amo <:Etto2:885858191898988554>',
];
const INTERVALO_MS = 5 * 60 * 60 * 1000; // 5 horas

client.once('ready', () => {
  console.log(`Serrucho conectado como ${client.user.tag}`);

  // Manda una frase apenas arranca, y después cada 5 horas
  enviarFrase();
  setInterval(enviarFrase, INTERVALO_MS);
});

async function enviarFrase() {
  try {
    const canal = await client.channels.fetch(CHANNEL_ID);
    const frase = FRASES[Math.floor(Math.random() * FRASES.length)];
    await canal.send(frase);
    console.log(`Enviado: "${frase}"`);
  } catch (err) {
    console.error('Error enviando mensaje:', err);
  }
}

client.login(process.env.DISCORD_TOKEN);

// Truco para que Render lo mantenga como Web Service activo
http
  .createServer((req, res) => res.end('Serrucho está despierto.'))
  .listen(process.env.PORT || 3000);
