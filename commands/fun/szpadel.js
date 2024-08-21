const { SlashCommandBuilder } = require('discord.js');
const { Rcon } = require('rcon-client');

// Minecraft server configuration
const mcConfig = {
    host: 'localhost', // Replace with your server's IP if remote
    port: 25575,       // Default RCON port
    password: 'password' // RCON password
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
        const rcon = await Rcon.connect(mcConfig);
        const playerName = interaction.options.getString('player', true);

        await rcon.send(`give ${playerName} minecraft:wooden_shovel[custom_name='["",{"text":"Szpadel","italic":false}]',lore=['["",{"text":"Fajny szpadel, zajebisty nawet ;)","italic":false}]'],enchantments={levels:{looting:25,sharpness:35},show_in_tooltip:false},damage=58]`);

        await interaction.reply(`Szpadel sent to ${playerName}! 🎉`);

        // Close the RCON connection
        rcon.end();
    },
};


