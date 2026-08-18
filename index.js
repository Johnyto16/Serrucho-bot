const { Client, GatewayIntentBits, EmbedBuilder, PermissionsBitField } = require('discord.js');
const http = require('http');

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
});

const CHANNEL_ID = '1521096118488797215';
const FRASES = [
  '<@1024012772952002602> chambea <:Catnice:1519445727980556498>',
  '<@665445384642101249> <:paglorya:1519801713404547235>',
  '<@665445384642101249> chambea <:Catnice:1519445727980556498>',
  '<@751628419258777600> chambea <:Catnice:1519445727980556498>',
  'Todo es culpa de Mat',
  'Ban a la furra de Brazzers',
  'Ban al femboy de Glorya',
  'Ban al peruano de Mat',
  'Hoy live de pocket?',
  'Hoy sale sorteito?',
  'Hoy abriré cuentas',
  'Brazzers chupala',
  'Apenas me salieron 69 oaks <:sadvibes:1519317106993270846>',
];
const INTERVALO_MS = 5 * 60 * 60 * 1000; // 5 horas
const PREFIX = '!anuncio';

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

client.on('messageCreate', async (message) => {
  if (message.author.bot) return;
  if (!message.content.startsWith(PREFIX)) return;

  // Solo gente con permiso de "Gestionar mensajes" puede usarlo
  if (!message.member?.permissions.has(PermissionsBitField.Flags.ManageMessages)) {
    return message.reply('No tenés permiso para usar este comando.');
  }

  const texto = message.content.slice(PREFIX.length).trim();
  if (!texto) {
    return message.reply('Escribí algo después de `!anuncio`, ej: `!anuncio Hoy hay evento a las 20hs`');
  }

  const embed = new EmbedBuilder()
    .setColor(0x5865f2)
    .setDescription(texto);

  await message.channel.send({ embeds: [embed] });

  try {
    await message.delete();
  } catch (err) {
    console.error('No se pudo borrar el mensaje del comando:', err.message);
  }
});

client.login(process.env.DISCORD_TOKEN);

// Truco para que Render lo mantenga como Web Service activo
http
  .createServer((req, res) => res.end('Serrucho está despierto.'))
  .listen(process.env.PORT || 3000);
