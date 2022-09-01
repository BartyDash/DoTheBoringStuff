const mineflayer = require('mineflayer');
const config = require('./config');

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

bot.on('physicTick', lookAtNearestPlayer);

bot.on('login', () => {
    console.log('Bot connected to server');
});