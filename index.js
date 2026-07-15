const {
  Client,
  GatewayIntentBits,
  EmbedBuilder,
  REST,
  Routes,
  SlashCommandBuilder,
  PermissionFlagsBits
} = require("discord.js");

const fs = require("fs");
require("dotenv").config();

const client = new Client({
  intents: [GatewayIntentBits.Guilds]
});

const dosya = "./lisanslar.json";

if (!fs.existsSync(dosya)) {
  fs.writeFileSync(dosya, JSON.stringify({}));
}

function lisansOku() {
  return JSON.parse(fs.readFileSync(dosya));
}

function lisansKaydet(data) {
  fs.writeFileSync(dosya, JSON.stringify(data, null, 2));
}


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
),

new SlashCommandBuilder()
.setName("panel")
.setDescription("Alman Store panelini göster")

].map(x=>x.toJSON());



client.once("ready", async()=>{

console.log(`${client.user.tag} aktif!`);

const rest = new REST({version:"10"})
.setToken(process.env.TOKEN);


await rest.put(
Routes.applicationGuildCommands(
process.env.CLIENT_ID,
process.env.GUILD_ID
),
{
body:commands
}
);

console.log("Komutlar yüklendi!");

});



client.on("interactionCreate", async interaction=>{

if(!interaction.isChatInputCommand()) return;



if(interaction.commandName==="panel"){

const embed = new EmbedBuilder()

.setTitle("🇩🇪 Alman Store")

.setDescription(
`
**Lisans Sistemi**

🔑 Lisans oluşturma
✅ Lisans kontrol
🛒 Ürün teslim sistemi

Alman Store
`
)

.setColor("Blue");


return interaction.reply({
embeds:[embed]
});

}




if(interaction.commandName==="lisans-oluştur"){


if(!interaction.member.permissions.has(PermissionFlagsBits.Administrator))
return interaction.reply({
content:"❌ Yetkin yok!",
ephemeral:true
});


let lisanslar = lisansOku();


let key =
"ALMAN-" +
Math.random()
.toString(36)
.substring(2,10)
.toUpperCase();



lisanslar[key]={
aktif:true,
kullanan:null,
tarih:new Date()
};



lisansKaydet(lisanslar);



const embed=new EmbedBuilder()

.setTitle("🇩🇪 Alman Store")

.setDescription(
`Yeni lisans oluşturuldu:

\`${key}\``
)

.setColor("Green");


interaction.reply({
embeds:[embed],
ephemeral:true
});


}





if(interaction.commandName==="lisans-kontrol"){


let key =
interaction.options.getString("anahtar");


let lisanslar=lisansOku();


if(lisanslar[key]){


interaction.reply({

content:
"✅ Lisans geçerli!\n\nAlman Store",

ephemeral:true

});


}else{


interaction.reply({

content:
"❌ Lisans bulunamadı!",

ephemeral:true

});


}


}


});



client.login(process.env.TOKEN);
