const { versions } = require('minecraft-data')
const mineflayer = require('mineflayer')
const { mineflayer: mineflayerViewer } = require('prismarine-viewer')
const { pathfinder, Movements, goals } = require('mineflayer-pathfinder')
const { GoalNear } = require('mineflayer-pathfinder').goals
const GoalFollow = goals.GoalFollow
const Item=require('prismarine-item')('1.13.2')
const delay = require('delay')

var vec3 = require('vec3')

var seedName = 'wheat_seeds';
var harvestName = 'wheat';

function createBot () {
  let spawnCounter = 0
  let windowCounter = 0

  let mcData = require('minecraft-data')('1.13.2')

  const bot = mineflayer.createBot({
    host: 'game3.gc2.pl',
    port: 25565,
    username: 'pomocnik01',
    version: '1.13.2'
  })
  bot.on('error', (err) => console.log(err))
  bot.on('end', createBot)
  // bot.on('inject_allowed', () => {
  //   const mcData = require('minecraft-data')(bot.version)
  // })

  bot.once('spawn', () => {
    console.log('--------------------------------------------------------------------')
    //mineflayerViewer(bot, { port: 3007, firstPerson: true }) // port is the minecraft server port, if first person is false, you get a bird's-eye view
    //let mcData = require('minecraft-data')(bot.version)

    bot.chat('/zaloguj qwert')
    console.log("zalogowano!")

    //const movements = new Movements(bot, mcData)
    //bot.pathfinder.setMovements(movements)
    //bot.pathfinder.setGoal(new GoalNear(0, 44, 28, 1))
  })
  
  bot.on('windowClose', (window) => {
    console.log('window closed')
  })
  
  bot.on("windowOpen", window => {
    windowCounter++
    if(windowCounter === 1){
      bot.clickWindow(11, 0, 0)
    }else if(windowCounter === 2){
      bot.clickWindow(12, 0, 0)
    }
    //console.log("Hey! Window opened! Title: " + window.title)
    //console.log(window.slots)
  })
  
  bot.on('spawn', /*async*/ () => {
    delay(1000);
    spawnCounter++
    console.log(spawnCounter)
    if(spawnCounter === 2){
      delay(1000);
      bot.chat('/is home 3')
      sayItems();
      //await bot.waitForChunksToLoad()
    }
    if(spawnCounter === 3){
      //await watchChest()
      loop();
    }
  })

  function sayItems (items = bot.inventory.items()) {
    const output = items.map(itemToString).join(', ')
    if(output){
      console.log(output)
    }else{
      console.log('empty')
    }
  }

  function itemToString (item) {
    if (item) {
      return `${item.name} x ${item.count}`
    } else {
      return '(nothing)'
    }
  }

  async function loop () {

    if (bot.inventory.slots.filter(v=>v==null).length < 30) {
      await depositLoop();
    } else {
      await farmLoop();
    }
  
    setTimeout(loop, 1000);
  }

  async function depositLoop() {
    var loc = vec3(-1049, 10, 31151)
    let chestToOpen = bot.findBlock({
      matching: mcData.blocksByName.chest.id,
      point: loc
      //matching: mcData.blocksByName['chest'].id
    });
  
    let stack = false;
  
    if (!chestToOpen) return;
  
    if (bot.entity.position.distanceTo(chestToOpen.position) < 1) {
      bot.setControlState('forward', false);
  
      let chest = await bot.openChest(chestToOpen);
  
      for (slot of bot.inventory.slots) {
        if(slot && slot.name == seedName){
          if(stack){
            await chest.deposit(slot.type, null, slot.count);
          }
          stack = true;
        }
        if (slot && slot.name != seedName) {
          await chest.deposit(slot.type, null, slot.count);
        }
      }
      chest.close();
    } else {
      bot.lookAt(chestToOpen.position);
      bot.setControlState('forward', true);
    }
  }

  async function farmLoop() {
    let harvest = readyCrop();
  
    if (harvest) {
      bot.lookAt(harvest.position);
      try {
        if (bot.entity.position.distanceTo(harvest.position) < 1) {
          bot.setControlState('forward', false);
  
          await bot.dig(harvest);
          if (!bot.heldItem || bot.heldItem.name != seedName) await bot.equip(mcData.itemsByName[seedName].id);
  
          let dirt = bot.blockAt(harvest.position.offset(0, -1, 0));
          await bot.placeBlock(dirt, vec3(0, 1, 0));
        } else {
          bot.setControlState('forward', true);
        }
      } catch(err) {
        console.log(err);
      }
    }
  }

  function readyCrop() {
    return bot.findBlock({
      matching: (blk)=>{
        return(blk.name == harvestName && blk.metadata == 7);
      },
      maxDistance: 64
    });
  }
}

createBot()