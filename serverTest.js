import mineflayer from 'mineflayer';
import chalk from 'chalk';
import { config } from'./config.js';

const bot = mineflayer.createBot({
    host: config.host,
    port: config.port,
    username: config.username
});

function lookAtNearestPlayer () {
    const playerFilter = (entity) => entity.type === 'player';
    const playerEntity = bot.nearestEntity(playerFilter);

    if (!playerEntity) return

    const pos = playerEntity.position.offset(0, playerEntity.height, 0);
    bot.lookAt(pos);
}

bot.on('error', (err) => log(chalk.red(err)));

bot.on('physicTick', lookAtNearestPlayer);

function log(...msg) {
    console.log(`[${config.username}]`, ...msg);
}

bot.on('login', () => {
    let botSocket = bot._client.socket;
    log(chalk.ansi256(34)(`Logged in to ${botSocket.server ? botSocket.server : botSocket._host}`));
});

bot.on('spawn', async () => {
    log(chalk.ansi256(46)(`Spawned`));

    bot.chatAddPattern(
        /(register haslo haslo)/,
        'register',
        'Registration required'
    );
    bot.chatAddPattern(
        /(login haslo)/,
        'loggingOn',
        'Login required'
    );
});

bot.on('end', (reason) => {
    log(chalk.red(`Disconnected: ${reason}`));

    if (reason == "disconnect.quitting") {
        return;
    }
});

//register and login to the server
const login = () => {
    bot.chat(`./login ${config.password}`);
    log(chalk.ansi256(22)('Logged on to the server')); //ansi256 22
}
const register = () => {
    bot.chat(`./register ${config.password} ${config.password}`);
    log(chalk.ansi256(22)('Registered on the server')); //ansi256 22
}
  
bot.on('loggingOn', login);
bot.on('register', register);