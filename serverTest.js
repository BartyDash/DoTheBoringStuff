const mineflayer = require('mineflayer');
const { mineflayer: mineflayerViewer } = require('prismarine-viewer');
const chalk = require('chalk');
const { config } = require('./config.js');

const bot = mineflayer.createBot({
    host: config.host,
    port: config.port,
    username: config.username,
    version: config.version
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
        /(Jestes juz zarejestrowany|Zostales pomyslnie zarejestrowany)/,
        'register',
        'Registration required'
    );
    bot.chatAddPattern(
        /(Jestes juz zalogowany|Zostales pomyslnie zalogowany)/,
        'loggingOn',
        'Login required'
    );
});

bot.once('spawn', () => {
    bot.chat(`/register ${config.password} ${config.password}`);
    mineflayerViewer(bot, { port: 3007, firstPerson: true }) // port is the minecraft server port, if first person is false, you get a bird's-eye view
});

bot.on('end', (reason) => {
    log(chalk.red(`Disconnected: ${reason}`));

    if (reason == "disconnect.quitting") {
        return;
    }
});

//register and login to the server
const login = () => {
    log(chalk.ansi256(22)('Already logged on to the server')); //ansi256 22
    //tutaj dać rozpoczęcie funkcji do wybierania okienek
}
const register = () => {
    bot.chat(`/login ${config.password}`);
    log(chalk.ansi256(22)('Already registered on the server')); //ansi256 22
}
  
bot.on('loggingOn', login);
bot.on('register', register);

bot.on('chat', (username, message) => {
    if (username === bot.username) return
    console.log(username + '  ' + message)
  });