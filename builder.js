const mineflayer = require('mineflayer');
const chalk = require('chalk');
const vec3 = require('vec3');
const {pathfinder, Movements, goals} = require('mineflayer-pathfinder');
const { builderConfig } = require('./config.js');

const bot = mineflayer.createBot({
    host: builderConfig.host,
    port: builderConfig.port,
    username: builderConfig.username,
    version: builderConfig.version
});

let mcData;

bot.loadPlugin(pathfinder);

bot.on('kicked', (reason, loggedIn) => console.log(reason, loggedIn));
bot.on('error', (err) => log(chalk.red(err)));

function log(...msg) {
    console.log(`[${builderConfig.username}]`, ...msg);
}

bot.on('login', () => {
    let botSocket = bot._client.socket;
    log(chalk.ansi256(34)(`Logged in to ${botSocket.server ? botSocket.server : botSocket._host}`));
});

bot.on('spawn', async () => {
    log(chalk.ansi256(46)(`Spawned`));
    sayItems();
    bot.pathfinder.setGoal(new goals.GoalBlock(-8, -41, 9));
    //build();
});

bot.once('spawn', () => {
    bot.chat(`registered`);
    //mineflayerViewer(bot, { port: 3007, firstPerson: true }) // port is the minecraft server port, if first person is false, you get a bird's-eye view
    
    mcData = require('minecraft-data')(bot.version);
});

bot.on('end', (reason) => {
    log(chalk.red(`Disconnected: ${reason}`));

    if (reason == "disconnect.quitting") {
        return;
    }
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

async function build() {
	try {
        //await bot.equip(mcData.itemsByName.dirt.id, 'hand');
		let referenceBlock = bot.blockAt(bot.entity.position.offset(0, 1, 0));
		await bot.placeBlock(referenceBlock, vec3( 1, 0, 0));
	} catch(err) {
		console.log(err);
	}

    bot.pathfinder.setGoal(new goals.GoalBlock(bot.entity.position.x+1, bot.entity.position.y, bot.entity.position.z));
}

bot.on('goal_reached', ()=>{
    log('goal reached');
    build();
});