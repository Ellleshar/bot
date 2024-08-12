const { SlashCommandBuilder } = require('discord.js');
const { Rcon } = require('rcon-client');

// Minecraft server configuration
const mcConfig = {
    host: 'localhost', // Replace with your server's IP if remote
    port: 25575,       // Default RCON port
    password: 'password' // RCON password
};


module.exports = {
    cooldown: 5,
    category: 'fun',
    data: new SlashCommandBuilder()
        .setName('testcommand')
        .setDescription('Sending a command to a minecraft server.'),
    async execute(interaction) {
        const rcon = await Rcon.connect(mcConfig);
        for(var i = 0; i < 5; i++)
        {
            await rcon.send('execute as WujekRadek at WujekRadek run summon minecraft:zombie ~20 ~ ~');
        }
        await interaction.reply('Zombies spawned');
        
            
        rcon.end();
        
    },
};
