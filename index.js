const { Client, GatewayIntentBits, EmbedBuilder, REST, Routes, SlashCommandBuilder } = require("discord.js");
require("dotenv").config();

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds
  ]
});

const lisanslar = new Map();

const commands = [
  new SlashCommandBuilder()
    .setName("lisans-oluştur")
    .setDescription("Yeni lisans oluşturur"),

  new SlashCommandBuilder()
    .setName("lisans-kontrol")
    .setDescription("Lisans kontrol eder")
    .addStringOption(option =>
      option.setName("anahtar")
      .setDescription("Lisans anahtarı")
      .setRequired(true)
    )
].map(command => command.toJSON());


client.once("ready", async () => {

  console.log(`${client.user.tag} aktif!`);

  const rest = new REST({version:"10"}).setToken(process.env.TOKEN);

  await rest.put(
    Routes.applicationGuildCommands(
      process.env.CLIENT_ID,
      process.env.GUILD_ID
    ),
    {body: commands}
  );

});


client.on("interactionCreate", async interaction => {

  if(!interaction.isChatInputCommand()) return;


  if(interaction.commandName === "lisans-oluştur"){

    const key =
    "ALMAN-" +
    Math.random().toString(36).substring(2,10).toUpperCase();


    lisanslar.set(key,{
      aktif:true,
      user:null
    });


    const embed = new EmbedBuilder()
    .setTitle("🇩🇪 Alman Store")
    .setDescription(
      `Yeni lisans oluşturuldu:\n\`\`\`${key}\`\`\``
    );


    interaction.reply({
      embeds:[embed],
      ephemeral:true
    });

  }


  if(interaction.commandName === "lisans-kontrol"){

    const key =
    interaction.options.getString("anahtar");


    if(lisanslar.has(key)){

      interaction.reply({
        content:"✅ Lisans geçerli!",
        ephemeral:true
      });

    }else{

      interaction.reply({
        content:"❌ Lisans bulunamadı!",
        ephemeral:true
      });

    }

  }


});


client.login(process.env.TOKEN);
