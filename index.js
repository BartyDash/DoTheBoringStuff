const mineflayer = require('mineflayer');

const bot = mineflayer.createBot({
    host: 'localhost',
    port: 56243,
    username: 'testowyBot'
});

function lookAtNearestPlayer () {
    const playerFilter = (entity) => entity.type === 'player';
    const playerEntity = bot.nearestEntity(playerFilter);

    if (!playerEntity) return

    const pos = playerEntity.position.offset(0, playerEntity.height, 0);
    bot.lookAt(pos);
}

const welcome = () => {
    bot.chat('hi!')
  }
  
bot.once('spawn', welcome)

bot.on('physicTick', lookAtNearestPlayer);