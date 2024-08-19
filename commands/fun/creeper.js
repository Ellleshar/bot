const { SlashCommandBuilder } = require('discord.js');
const { Rcon } = require('rcon-client');

// Minecraft server configuration
const mcConfig = {
    host: 'localhost', // Replace with your server's IP if remote
    port: 25575,       // Default RCON port
    password: 'password' // RCON password
};

module.exports = {
    category: 'fun',
    data: new SlashCommandBuilder()
        .setName('creeper')
        .setDescription('Plays a creeper primed sound behind a player.')
        .addStringOption(option =>
            option.setName('player') // Must be all lowercase
                .setDescription('Player to scare')
                .setRequired(true)),
    async execute(interaction) {
        const rcon = await Rcon.connect(mcConfig);
        const playerName = interaction.options.getString('player', true);

        // Sending the command to play the creeper sound behind the specified player
        await rcon.send(`execute as ${playerName} at ${playerName} run playsound minecraft:entity.creeper.primed master ${playerName} ~ ~ ~-1 1 1`);
        
        await interaction.reply(`Creeper sound played behind ${playerName}.`);
        
        rcon.end();
    },
};
