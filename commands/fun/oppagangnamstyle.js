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
        .setName('oppagangnamstyle')
        .setDescription('Trigger an Oppagangnamstyle event for a player.')
        .addStringOption(option =>
            option.setName('player') 
                .setDescription('Player to oppagangnamstyle')
                .setRequired(true)),
    async execute(interaction) {
        const rcon = await Rcon.connect(mcConfig);
        const playerName = interaction.options.getString('player', true);

        // Execute Oppa Gangnam Style commands on the specified player
        await rcon.send(`execute as ${playerName} at ${playerName} run tellraw @a ["",{"text":"🎶 ","color":"yellow"},{"text":"Oppa Gangnam Style!","color":"gold","bold":true},{"text":" 🎶","color":"yellow"}]`);
        await rcon.send(`execute as ${playerName} at ${playerName} run tellraw @a ["",{"text":"🎉 ","color":"yellow"},{"text":"${playerName} ","color":"gold","bold":true},{"text":"is the Dance Master now!","color":"light_purple","bold":true},{"text":" 🎉","color":"yellow"}]`);
        await rcon.send(`execute as ${playerName} at ${playerName} run playsound minecraft:music_disc.11 master @a ~ ~ ~ 0.5 1`);
        await rcon.send(`execute as ${playerName} at ${playerName} run summon minecraft:firework_rocket ~ ~1 ~`);
        await rcon.send(`execute as ${playerName} at ${playerName} run tellraw @a ["",{"text":"💥 ","color":"red"},{"text":"Fireworks!","color":"aqua","bold":true},{"text":" 💥","color":"red"}]`);
        await rcon.send(`execute as ${playerName} at ${playerName} run tellraw @a ["",{"text":"Get ready to dance!","color":"light_purple","bold":true,"italic":true}]`);
        await rcon.send(`execute as ${playerName} at ${playerName} run effect give @a minecraft:speed 10 2 true`);
        await rcon.send(`execute as ${playerName} at ${playerName} run effect give ${playerName} minecraft:speed 120 2 true`);
        await rcon.send(`execute as ${playerName} at ${playerName} run effect give ${playerName} minecraft:jump_boost 120 1 true`);
        await rcon.send(`execute as ${playerName} at ${playerName} run particle minecraft:happy_villager ~ ~1 ~ 0.5 1 0.5 0 100 force @a`);


        await interaction.reply(`Oppagangnamstyle triggered for ${playerName}! 🎉`);

        rcon.end();
    },
};
