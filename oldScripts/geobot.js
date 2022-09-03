// const { versions } = require('minecraft-data')
// const mineflayer = require('mineflayer');
// const { pathfinder, Movements, goals } = require('mineflayer-pathfinder')
// const { GoalNear } = require('mineflayer-pathfinder').goals
// const GoalFollow = goals.GoalFollow

// const delay = require('delay')

// var vec3 = require('vec3')

// var seedName = 'pumpkin';

// const bot = mineflayer.createBot({
//     host: 'localhost',
//     port: 58589,
//     username: 'ciamajda',
//     version: '1.16.4'
// })

// bot.loadPlugin(pathfinder);

// bot.on('error', (err) => console.log(err))

// let mcData = require('minecraft-data')('1.16.4')

// bot.once('spawn', () => {
//     const mcData = require('minecraft-data')(bot.version)
//     const defaultMove = new Movements(bot, mcData)
//     console.log('--------------------------------------------------------------------')

//     bot.chat('/login qwert')
//     console.log("zalogowano!")
//     sayItems();
//     delay(5000);
//     loop();
//     //bot.pathfinder.setMovements(defaultMove)
//     //bot.pathfinder.setGoal(new GoalNear(playerX, playerY, playerZ, RANGE_GOAL))
//   })

//   function sayItems (items = bot.inventory.items()) {
//     const output = items.map(itemToString).join(', ')
//     if(output){
//       console.log(output)
//     }else{
//       console.log('empty')
//     }
//   }

//   function itemToString (item) {
//     if (item) {
//       return `${item.name} x ${item.count}`
//     } else {
//       return '(nothing)'
//     }
//   }

//   async function loop () {

//     // if (bot.inventory.slots.filter(v=>v==null).length < 30) {
//     //   await depositLoop();
//     // } else {
//     //   await farmLoop();
//     // }

//     if (bot.inventory.slots.filter(v=>v==null).length < 30) {
//       await depositLoop();
//     } else {

//     }
  
//     setTimeout(loop, 1000);
//   }

//   async function depositLoop() {
//     var loc = vec3(24, 4, -6)
//     let chestToOpen = bot.findBlock({
//       matching: mcData.blocksByName.chest.id,
//       point: loc
//       //matching: mcData.blocksByName['chest'].id
//     });
  
//     let stack = false;
  
//     if (!chestToOpen) return;
  
//     if (bot.entity.position.distanceTo(chestToOpen.position) < 1) {
//       bot.setControlState('forward', false);
  
//       let chest = await bot.openChest(chestToOpen);
  
//       for (slot of bot.inventory.slots) {
//         if(slot && slot.name == seedName){
//           if(stack){
//             await chest.deposit(slot.type, null, slot.count);
//           }
//           stack = true;
//         }
//         if (slot && slot.name != seedName) {
//           await chest.deposit(slot.type, null, slot.count);
//         }
//       }
//       chest.close();
//     } else {
//       bot.lookAt(chestToOpen.position);
//       bot.setControlState('forward', true);
//     }
//   }































  
const mineflayer = require('mineflayer')
const { pathfinder, Movements, goals } = require('mineflayer-pathfinder')
const GoalFollow = goals.GoalFollow
const GoalBlock = goals.GoalBlock

const delay = require('delay')

const bot = mineflayer.createBot({
    host: 'mineapolis.pl',
    //host: 'localhost',
    port: 25565,
    username: 'ciamajda',
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
    // const goal = new GoalBlock(x, y, z)
    const goal = new GoalBlock(-8837, 154, -1291)
    bot.pathfinder.setGoal(goal)
}

//bot.once('spawn', locateEmeraldBlock)

bot.once('spawn', () => {
    console.log('--------------------------------------------------------------------')
    bot.chat('/login qwert')
    console.log("zalogowano!")
    delay(10000)
    locateEmeraldBlock()
    //followPlayer()
})

bot.on('chat', (username, message) => {
    if (username === bot.username) return
    console.log(username + '  ' + message)
  })
// bot.once('chat', (username, message) => {
//     if(message === 'hej'){
//         locateEmeraldBlock()
//     }
// })