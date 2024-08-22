const { SlashCommandBuilder } = require('discord.js');
const { Rcon } = require('rcon-client');
require('dotenv').config({ path: '../../.env' });

// Minecraft server configuration
const mcConfig = {
    host: process.env.RCON_HOST,
    port: parseInt(process.env.RCON_PORT, 10),
    password: process.env.RCON_PASSWORD
};

module.exports = {
    cooldown: 300,
    category: 'fun',
    data: new SlashCommandBuilder()
        .setName('szpadel')
        .setDescription('Gives player a really cool shovel.')
        .addStringOption(option =>
            option.setName('player') 
                .setDescription('Player to give a cool shovel to.')
                .setRequired(true)),
    async execute(interaction) {
        console.log("RCON_HOST:", process.env.RCON_HOST);
console.log("RCON_PORT:", process.env.RCON_PORT);
console.log("RCON_PASSWORD:", process.env.RCON_PASSWORD);
        const rcon = await Rcon.connect(mcConfig);
        const playerName = interaction.options.getString('player', true);

        await rcon.send(`give ${playerName} minecraft:wooden_shovel[custom_name='["",{"text":"Szpadel","italic":false}]',lore=['["",{"text":"Fajny szpadel, zajebisty nawet ;)","italic":false}]'],enchantments={levels:{looting:25,sharpness:35},show_in_tooltip:false},damage=58]`);

        await interaction.reply(`Szpadel sent to ${playerName}! 🎉`);

        // Close the RCON connection
        rcon.end();
    },
};


