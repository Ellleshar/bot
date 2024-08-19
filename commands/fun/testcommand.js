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
            await rcon.send('execute as laurka39 at laurka39 run playsound minecraft:entity.creeper.primed master laurka39 ~ ~ ~-1 1 1');
        }
        await interaction.reply('Laura shat herself ;D');
        
            
        rcon.end();
        
    },
};
