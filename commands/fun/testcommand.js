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
