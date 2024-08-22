const { SlashCommandBuilder } = require('discord.js');
const { Rcon } = require('rcon-client');
require('dotenv').config({ path: '../../.env' });

// Minecraft server configuration
const mcConfig = {
    host: process.env.RCON_HOST,
    port: parseInt(process.env.RCON_PORT, 10),
    password: process.env.RCON_PASSWORD
};

const TIMER_DURATION = 10 * 60 * 1000;

module.exports = {
    cooldown: 50,
    category: 'fun',
    data: new SlashCommandBuilder()
        .setName('mobcount')
        .setDescription('Counts hostile entities in the Overworld and manages spawning with a timer.'),
    async execute(interaction) {
        let rcon;
        let timer;

        try {
            rcon = await Rcon.connect(mcConfig);
            console.log('Connected to RCON');
            
            await interaction.reply('Starting the mob count process...');

            // Disable hostile mob spawning
            console.log('Disabling mob spawning');
            await rcon.send('gamerule doMobSpawning false');
            await delay(50);

            // Kill existing monsters
            console.log('Killing existing monsters');
            await rcon.send('kill @e[type=zombie]');
            await rcon.send('kill @e[type=skeleton]');
            await rcon.send('kill @e[type=creeper]');
            await rcon.send('kill @e[type=spider]');
            await delay(50);

            // Create scoreboard objective
            console.log('Creating scoreboard objective');
            await rcon.send('execute run scoreboard objectives add HostileCount dummy');
            await delay(50);

            // Display scoreboard
            console.log('Setting scoreboard display');
            await rcon.send('scoreboard objectives setdisplay sidebar HostileCount');
            await delay(50);

            // Spawn mobs
            console.log('Spawning mobs');
            for (let i = 0; i < 5; i++) {
                await rcon.send('execute as WujekRadek at WujekRadek run summon minecraft:zombie ~ ~ ~10');
                await rcon.send('execute as WujekRadek at WujekRadek run summon minecraft:skeleton ~ ~ ~15');
                await rcon.send('execute as WujekRadek at WujekRadek run summon minecraft:spider ~ ~ ~13');
                await rcon.send('execute as WujekRadek at WujekRadek run summon minecraft:creeper ~ ~ ~10');
            }
            await delay(50);

            // Count hostile entities
            console.log('Counting hostile entities');
            await rcon.send('execute as @e[type=zombie] run scoreboard players add @s HostileCount 1');
            await rcon.send('execute as @e[type=skeleton] run scoreboard players add @s HostileCount 1');
            await rcon.send('execute as @e[type=spider] run scoreboard players add @s HostileCount 1');
            await rcon.send('execute as @e[type=creeper] run scoreboard players add @s HostileCount 1');
            await delay(50);

            // Get hostile count
            console.log('Getting hostile count');
            let response = await rcon.send('execute as @a run scoreboard players list @s');
            console.log('Scoreboard response:', response);
            
            let hostileCount = parseHostileCount(response);
            console.log('Hostile count:', hostileCount);
            await delay(50);

            await interaction.followUp(`Hostile entities remaining in the Overworld: ${hostileCount}`);

            // Set timer for 10 minutes
            timer = setTimeout(async () => {
                console.log('Timer expired, resetting state');
                try {
                    await resetState(rcon);
                    await interaction.followUp('Time is up! The hostile mobs were not defeated in time. You lose!');
                } catch (error) {
                    console.error('Error during timer reset:', error);
                }
            }, TIMER_DURATION);

            // Polling function to check scoreboard
            async function checkScoreboard() {
                console.log('Checking scoreboard');
                try {
                    response = await rcon.send('execute as @a run scoreboard players list @s');
                    console.log('Scoreboard response:', response);

                    hostileCount = parseHostileCount(response);
                    console.log('Parsed hostile count:', hostileCount);

                    if (hostileCount === 0) {
                        clearTimeout(timer);
                        console.log('All hostile mobs defeated');
                        await interaction.followUp('Congratulations! All hostile mobs have been defeated.');
                        await resetState(rcon);
                    } else {
                        setTimeout(checkScoreboard, 30000);
                    }
                } catch (error) {
                    console.error('Error checking scoreboard:', error);
                    await interaction.followUp('An error occurred while checking the scoreboard.');
                }
            }

            await delay(50);
            checkScoreboard();

        } catch (error) {
            console.error('Error handling mob count:', error);
            await interaction.followUp('Failed to count hostile entities. Please try again later.');
            if (timer) clearTimeout(timer);
        } finally {
            if (rcon) {
                console.log('Ending RCON connection');
                rcon.end();
            }
        }
    },
};

// Helper functions
function parseHostileCount(response) {
    const match = response.match(/HostileCount: (\d+)/);
    return match ? parseInt(match[1], 10) : 0;
}

async function resetState(rcon) {
    try {
        console.log('Resetting state');
        await rcon.send('execute in minecraft:overworld run scoreboard objectives remove HostileCount');
        await rcon.send('execute in minecraft:overworld run gamerule doMobSpawning true');
    } catch (error) {
        console.error('Error resetting state:', error);
    }
}

function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}






/*DO POPRAWY. POTRZEBNY JEST NOWY KOD DO LICZENIA MOBÓW. OBCZAIĆ TAGI */