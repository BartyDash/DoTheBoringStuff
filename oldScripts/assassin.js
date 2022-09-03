const mineflayer = require('mineflayer')
const { pathfinder, Movements, goals } = require('mineflayer-pathfinder')
const GoalFollow = goals.GoalFollow
const GoalBlock = goals.GoalBlock

const delay = require('delay')

const bot = mineflayer.createBot({
    host: 'localhost',
    port: 59578,
    username: 'Assassin',
    version: '1.16.4'
})

bot.on('error', (err) => console.log(err))
bot.loadPlugin(pathfinder)

function followPlayer() {
    const playerCI = bot.players['HiddenKillerXD']

    if (!playerCI || !playerCI.entity) {
        console.log("I can't see CI!")
        return
    }

    const mcData = require('minecraft-data')(bot.version)
    const movements = new Movements(bot, mcData)
    movements.scafoldingBlocks = []

    bot.pathfinder.setMovements(movements)

    const goal = new GoalFollow(playerCI.entity, 1)
    bot.pathfinder.setGoal(goal, true)
}

async function locateEmeraldBlock () {
    const mcData = require('minecraft-data')(bot.version)
    const movements = new Movements(bot, mcData)
    movements.scafoldingBlocks = []
    bot.pathfinder.setMovements(movements)

    const emeraldBlock = bot.findBlock({
        matching: mcData.blocksByName.emerald_block.id,
        maxDistance: 64
    })

    if (!emeraldBlock) {
        console.log("I can't see any emerald blocks!")
        return
    }

    const x = emeraldBlock.position.x
    const y = emeraldBlock.position.y + 1
    const z = emeraldBlock.position.z
    const goal = new GoalBlock(x, y, z)
    bot.pathfinder.setGoal(goal)
}

//bot.once('spawn', locateEmeraldBlock)

bot.once('spawn', () => {
    console.log('--------------------------------------------------------------------')
    console.log("zalogowano!")
    delay(5000)
    pozdro()
    //locateEmeraldBlock()
    followPlayer()
})

let i = 0
function pozdro () {
  if (i < 5) {
    setTimeout(() => {
            bot.chat('do zobaczenia...')
            bot.chat('...na TAMTYM ŚWIECIE!!!')
        pozdro()
    }, 5000)
    i++
  }
}
pozdro()