$(document).ready(function () {
  var gameName = 'NO ONE WINS'

  // get the canvas context for drawing
  var canvas = document.getElementById('canvas')
  var context = canvas.getContext('2d')
  var width = 0
  var height = 0
  var spriteWidth = 32
  var spriteHeight = 32

  var keysPressed = {}

// general game variables
  var p1Lives = 3
  var p2Lives = 3
  var p1Hit = false
  var p2Hit = false
  var isGameOver = false
  var refreshCounter = 0
  $('#score').text(p1Lives + ' : ' + p2Lives)
  $('#game-name').text(gameName)

// player object
  function Player (sprite, x, y) {
    this.image = createImage(sprite)
    this.lives = 3
    this.hit = false
    this.speed = 192
    this.x = x
    this.y = y
  }

// monster variables
  var monsterSpeedModifier = 0.02

  function Monster (x, y) {
    this.image = createImage('monster')
    this.speedModifier = 0.02
    this.x = x
    this.y = y
  }

  Monster.prototype.updatePosition = function () {
    this.x += chaseTheHero(p1.x, p1.y, p2.x, p2.y, this.x, this.y)[0]
    this.y += chaseTheHero(p1.x, p1.y, p2.x, p2.y, this.x, this.y)[1]
  }

  resizeCanvas()

// add keyboard and window state change eventListeners
  window.addEventListener('keydown', function (e) {
    keysPressed[e.keyCode] = true
  }, false)

  window.addEventListener('keyup', function (e) {
    delete keysPressed[e.keyCode]
  }, false)

  window.addEventListener('resize', resizeCanvas, false)

  window.addEventListener('orientationchange', resizeCanvas, false)

  // resize the canvas if necessary
  function resizeCanvas () {
    canvas.width = window.innerWidth * 0.8
    canvas.height = window.innerHeight * 0.8
    var margin = window.innerHeight * 0.1
    width = canvas.width
    height = canvas.height
    $('body').css('margin', '0px, ' + margin + 'px auto')
    $('h1').css('height', margin + 'px')
  }

  // create the images
  function createImage (sprite) {
    var image = document.createElement('img')
    if (sprite === 'player') {
      image.src = 'assets/images/hero.png'
    } else if (sprite === 'antihero') {
      image.src = 'assets/images/antihero.png'
    } else if (sprite === 'monster') {
      image.src = 'assets/images/monster.png'
    }
    if (image) {
      return image
    } else {
      console.log(sprite + 'not created')
    }
  }

  // create the players
  var pArray = []
  var p1 = new Player('player', 0, 0)
  var p2 = new Player('antihero', width - spriteWidth, height - spriteHeight)
  pArray.push(p1)
  pArray.push(p2)

// create the monsters
  var monsterArray = []
  var monster = new Monster(0, height - spriteHeight)
  var monster2 = new Monster(width - spriteWidth, 0)
  var monster3 = new Monster(width / 3, height / 3)
  var monster4 = new Monster(width * 2 / 3, height * 2 / 3)
  monsterArray.push(monster)
  monsterArray.push(monster2)
  monsterArray.push(monster3)
  monsterArray.push(monster4)

  // var isMonsterReady = false
  // var monsterImg = document.createElement('img')
  // monsterImg.src = 'assets/images/monster.png'
  // monsterImg.onload = function () {
  //   isMonsterReady = true
  // }
  //
  // var isMonster2Ready = false
  // var monster2Img = document.createElement('img')
  // monster2Img.src = 'assets/images/monster.png'
  // monster2Img.onload = function () {
  //   isMonster2Ready = true
  // }

  function monsterHorde () {
    // monsterHordeReady.append(false)
    var monsterTestReady = false
    var index = monsterHordeReady.length - 1
    var monsterTest = document.createElement('img')
    monsterTest.src = 'assets/images/monster.png'
    monsterTest.onload = function () {
      // monsterHordeReady[index] = true
      monsterTestReady = true
    }
  }

// make the monsters chase the nearest player
  function chaseTheHero (p1x, p1y, p2x, p2y, monsterx, monstery) {
    var p1xDistance = Math.abs(p1x - monsterx)
    var p1yDistance = Math.abs(p1y - monstery)
    var p1Hypotenuse = Math.sqrt(Math.pow(p1xDistance, 2) + Math.pow(p1yDistance, 2))
    var p2xDistance = Math.abs(p2x - monsterx)
    var p2yDistance = Math.abs(p2y - monstery)
    var p2Hypotenuse = Math.sqrt(Math.pow(p2xDistance, 2) + Math.pow(p2yDistance, 2))
    return (p1Hypotenuse >= p2Hypotenuse ? [(p2x - monsterx) * monsterSpeedModifier, (p2y - monstery) * monsterSpeedModifier] : [(p1x - monsterx) * monsterSpeedModifier, (p1y - monstery) * monsterSpeedModifier])
  }

// check if the player is caught
  function catchTheHero (play, mon) {
    if (play.x <= (mon.x + spriteWidth) && mon.x <= (play.x + spriteWidth) && play.y <= (mon.y + spriteHeight) && mon.y <= (play.y + spriteHeight)) {
      play.lives--
      play.hit = true
      if (play.lives > 0) {
        reset()
      } else {
        isGameOver = true
      }
    }
  }

  // go to game over screen
  function gameOverScreen () {
    context.clearRect(0, 0, width, height)
    $('canvas').hide()
    $('#restart').show()
    if (p1Hit) {
      $('h1').text('Player 2 wins!')
    } else {
      $('h1').text('Player 1 wins!')
    }
  }

  // reset the game on player hit or when game is over
  function reset () {
    if (!isGameOver) {
      if (p1Hit) {
        p1.x = 0
        p1.y = 0
        p1Hit = false
        monster.x = 0
        monster.y = height - spriteWidth
      } else if (p2Hit) {
        p2.x = width - spriteWidth
        p2.y = height - spriteHeight
        p2Hit = false
        monster2.x = width - spriteWidth
        monster2.y = 0
      }
    } else {
      p1Lives = 3
      p2Lives = 3
      p1Hit = false
      p2Hit = false
      isGameOver = false
      refreshCounter = 0
      $('#score').text(p1Lives + ' : ' + p2Lives)
      $('#game-name').text(gameName)

      p1.x = 0
      p1.y = 0

      p2.x = width - spriteWidth
      p2.y = height - spriteHeight

      monster.x = 0
      monster.y = height - spriteHeight
      monster2.x = width - spriteWidth
      monster2.y = 0
      // monObj.x = width / 2
      // monObj.y = height / 2

      // monster.x = 32 + (Math.random() * (width - 64))
      // monster.y = 32 + (Math.random() * (height - 64))
      // monster2.x = 32 + (Math.random() * (width - 64))
      // monster2.y = 32 + (Math.random() * (height - 64))
    }
  }

  // restart the game
  $('#restart').on('click', function () {
    $(this).hide()
    $('canvas').show()
    reset()
    runMainGame()
  })

  $('#restart').on('mouseenter', function () {
    $(this).text('Let\'s go!')
  })

  $('#restart').on('mouseleave', function () {
    $(this).text('One more round?')
  })

  // move players on key presses
  function movePlayers (modifier) {
  // player 1 wasd
    if (87 in keysPressed && p1.y > 0) {
      p1.y -= p1.speed * modifier
    }
    if (83 in keysPressed && p1.y < canvas.height - spriteHeight) { // Player holding down
      p1.y += p1.speed * modifier
    }
    if (65 in keysPressed && p1.x > 0) { // Player holding left
      p1.x -= p1.speed * modifier
    }
    if (68 in keysPressed && p1.x < canvas.width - spriteWidth) { // Player holding right
      p1.x += p1.speed * modifier
    }
// player 2 arrow keys
    if (38 in keysPressed && p2.y > 0) {
      p2.y -= p2.speed * modifier
    }
    if (40 in keysPressed && p2.y < canvas.height - spriteHeight) { // Player holding down
      p2.y += p2.speed * modifier
    }
    if (37 in keysPressed && p2.x > 0) { // Player holding left
      p2.x -= p2.speed * modifier
    }
    if (39 in keysPressed && p2.x < canvas.width - spriteWidth) { // Player holding right
      p2.x += p2.speed * modifier
    }

    monsterArray.forEach(function (mon) {
      mon.updatePosition()
    })

// check for collision event
    if (p1.x <= (monster.x + spriteWidth) && monster.x <= (p1.x + spriteWidth) && p1.y <= (monster.y + spriteHeight) && monster.y <= (p1.y + spriteHeight)) {
      p1Lives--
      p1Hit = true
      if (p1Lives > 0) {
        reset()
      } else {
        isGameOver = true
      }
    }

    if (p2.x <= (monster2.x + spriteWidth) && monster2.x <= (p2.x + spriteWidth) && p2.y <= (monster2.y + spriteHeight) && monster2.y <= (p2.y + spriteHeight)) {
      p2Lives--
      p2Hit = true
      if (p2Lives > 0) {
        reset()
      } else {
        isGameOver = true
      }
    }
  }

  // draw everything
  function render () {
    refreshCounter++

    context.clearRect(0, 0, width, height)
    // if (isP1Ready) {
    context.drawImage(p1.image, p1.x, p1.y)
    // }
    // if (isP2Ready) {
    context.drawImage(p2.image, p2.x, p2.y)
    // }

    context.drawImage(monster.image, monster.x, monster.y)
    context.drawImage(monster2.image, monster2.x, monster2.y)
    context.drawImage(monster3.image, monster3.x, monster3.y)
    context.drawImage(monster4.image, monster4.x, monster4.y)
    // monsterArray.forEach(function (mon) {
    //   context.drawImage(mon.image, mon.x, mon.y)
    // }

    // if (isMonsterReady) {
    //   context.drawImage(monsterImg, monster.x, monster.y)
    // }
    //
    // if (isMonster2Ready) {
    //   context.drawImage(monsterImg, monster2.x, monster2.y)
    // }

    // context.drawImage(monObj.image, monObj.x, monObj.y)

    $('#score').text(p1Lives + ' : ' + p2Lives)
  }

  var runMainGame = function () {
    var now = Date.now()
    var delta = now - then

    movePlayers(delta / 1000)
    render()

    then = now

    if (!isGameOver) {
      window.requestAnimationFrame(runMainGame)
    } else {
      window.requestAnimationFrame(gameOverScreen)
    }
  }

  var then = Date.now()
  reset()
  runMainGame()
})
