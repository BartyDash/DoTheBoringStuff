const mineflayer = require('mineflayer');
const { mineflayer: mineflayerViewer } = require('prismarine-viewer');
const chalk = require('chalk');
const gui = require("mineflayer-gui");
const ChatMessage = require('prismarine-chat')('1.18.2');
const { config } = require('./config.js');

const bot = mineflayer.createBot({
    host: config.host,
    port: config.port,
    username: config.username,
    version: config.version
});

let mcData;
bot.loadPlugin(gui.plugin)

function lookAtNearestPlayer () {
    const playerFilter = (entity) => entity.type === 'player';
    const playerEntity = bot.nearestEntity(playerFilter);

    if (!playerEntity) return

    const pos = playerEntity.position.offset(0, playerEntity.height, 0);
    bot.lookAt(pos);
}

bot.on('error', (err) => log(chalk.red(err)));

//bot.on('physicTick', lookAtNearestPlayer);

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
    mcData = require('minecraft-data')(bot.version);
});

bot.on('end', (reason) => {
    log(chalk.red(`Disconnected: ${reason}`));

    if (reason == "disconnect.quitting") {
        return;
    }
});

//register and login to the server
async function login() {
    log(chalk.ansi256(22)('Already logged on to the server')); //ansi256 22
    //tutaj dać rozpoczęcie funkcji do wybierania okienek
    await sayItems();
    //try activate item in hand
    await bot.activateItem();
}
const register = () => {
    bot.chat(`/login ${config.password}`);
    log(chalk.ansi256(22)('Already registered on the server')); //ansi256 22
}
  
bot.on('loggingOn', login);
bot.on('register', register);

//print all chat to the console
bot.on('chat', (username, message) => {
    if (username === bot.username) return
    console.log(username + '  ' + message)
});

//print to the console own inventory
function sayItems (items = bot.inventory.items()) {
    const output = items.map(itemToString).join(', ');
    if(output){
      log(`Inventory: ${output}`);
    }else{
      log('Inventory: empty');
    }
};

//convert to string
function itemToString (item) {
    if (item) {
      return `${item.name} x ${item.count}`;
    } else {
      return '(nothing)';
    }
};

bot.on('windowClose', (window) => {
    log(`${window} closed`);
});
  
bot.on("windowOpen", window => {
    // if(windowCounter === 1){
    //   bot.clickWindow(11, 0, 0)
    // }else if(windowCounter === 2){
    //   bot.clickWindow(12, 0, 0)
    // }
    console.log("Hey! Window opened! Title: " + window.title);
    console.log(window.slots);
    example(window);
});

// create an object for configuring navigation
function createOptions(window) {
    this.window = window;
    this.include = true;
};

function createItem(name, lore) {
    this.name = new ChatMessage(name);
    this.lore = [
        new ChatMessage(lore)
    ]
};

async function example(window) {
    let options = new createOptions(window)
    // clicks the item matching the object made with createItem
    await bot.gui.clickItem(options, new createItem("SkyBlock", "Wersja:"));
};