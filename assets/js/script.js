$(document).ready(function () {
  // get the canvas context for drawing
  var canvas = document.getElementById('canvas')
  var context = canvas.getContext('2d')
  var width = 0
  var height = 0
  var spriteWidth = 32
  var spriteHeight = 32

  var keysPressed = {}
  var then = Date.now()

  $('#start').on('click', function () {
    startGame()
  })

// general game variables
  var hasGameStarted = false
  var isGameOver = false
  var refreshCounter = 0

// background object
  function Background (sprite, x, y) {
    this.image = createImage(sprite)
    this.x = x
    this.y = y
  }

// player object
  function Player (sprite, x, y) {
    this.image = createImage(sprite)
    this.lives = 5
    this.hit = false
    this.speed = 192
    this.startingx = x
    this.startingy = y
    this.x = x
    this.y = y
  }

// monster object
  function Monster (x, y, speed) {
    this.image = createImage('monster')
    this.hit = false
    this.speedModifier = speed
    this.x = x
    this.y = y
  }

  Monster.prototype.updatePosition = function () {
    this.x += chaseTheHero(p1.x, p1.y, p2.x, p2.y, this.x, this.y, this.speedModifier)[0]
    this.y += chaseTheHero(p1.x, p1.y, p2.x, p2.y, this.x, this.y, this.speedModifier)[1]
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
    $('#start-game').css('width', width + 'px')
    $('#start-game').css('height', height + 'px')
    $('#p1Canvas').css('width', width + 'px')
    $('#p1Canvas').css('height', height / 2 * 0.5 + 'px')

    $('#game-over').css('width', width + 'px')
    $('#game-over').css('height', height + 'px')
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

  // create the background
  // var background = new Background('background', 0, 0)

  // create the players
  var pArray = []
  var p1 = new Player('player', width / 3, height / 2)
  var p2 = new Player('antihero', width * 2 / 3, height / 2)
  pArray.push(p1)
  pArray.push(p2)

// create the monsters
  var monsterArray = []

  function createMonster () {
    var monster = new Monster(randomSpawn()[0], randomSpawn()[1], randomSpeed())
    monsterArray.push(monster)
  }
  createMonster()
  createMonster()
  createMonster()
  createMonster()
  createMonster()
  createMonster()
  createMonster()
  createMonster()

  // randomise where the monsters spawn along the edges - top right bottom left
  function randomSpawn () {
    switch (monsterArray.length % 4) {
      case 0:
        return [Math.floor(Math.random() * width) - spriteWidth, 0]
      case 1:
        return [width - spriteWidth, Math.floor(Math.random() * height) - spriteHeight]
      case 2:
        return [Math.floor(Math.random() * width) - spriteWidth, height - spriteHeight]
      default:
        return [0, Math.floor(Math.random() * height) - spriteHeight]
    }
  }

  // randomise the monsters' speeds
  function randomSpeed () {
    return 0.01 + Math.floor(Math.random() * 2) / 100
  }

// make the monsters chase the nearest player
  function chaseTheHero (p1x, p1y, p2x, p2y, monx, mony, monspeedmod) {
    var p1xDistance = Math.abs(p1x - monx)
    var p1yDistance = Math.abs(p1y - mony)
    var p1Hypotenuse = Math.sqrt(Math.pow(p1xDistance, 2) + Math.pow(p1yDistance, 2))
    var p2xDistance = Math.abs(p2x - monx)
    var p2yDistance = Math.abs(p2y - mony)
    var p2Hypotenuse = Math.sqrt(Math.pow(p2xDistance, 2) + Math.pow(p2yDistance, 2))
    return (p1Hypotenuse >= p2Hypotenuse ? [(p2x - monx) * monspeedmod, (p2y - mony) * monspeedmod] : [(p1x - monx) * monspeedmod, (p1y - mony) * monspeedmod])
  }

// check if the player is caught
  function catchTheHero (player, mon) {
    if (player.x <= (mon.x + spriteWidth) && mon.x <= (player.x + spriteWidth) && player.y <= (mon.y + spriteHeight) && mon.y <= (player.y + spriteHeight)) {
      player.lives--
      player.hit = true
      mon.hit = true
      if (player.lives > 0) {
        reset()
      } else {
        isGameOver = true
      }
    }
  }

  // move players and monster and check collisions
  function moveSpritesAndCheckCollisions (modifier) {
  // player 1 wasd
    if (87 in keysPressed && p1.y > 0) {
      p1.y -= p1.speed * modifier
    }
    if (83 in keysPressed && p1.y < canvas.height - spriteHeight) {
      p1.y += p1.speed * modifier
    }
    if (65 in keysPressed && p1.x > 0) {
      p1.x -= p1.speed * modifier
    }
    if (68 in keysPressed && p1.x < canvas.width - spriteWidth) {
      p1.x += p1.speed * modifier
    }
  // player 2 arrow keys
    if (38 in keysPressed && p2.y > 0) {
      p2.y -= p2.speed * modifier
    }
    if (40 in keysPressed && p2.y < canvas.height - spriteHeight) {
      p2.y += p2.speed * modifier
    }
    if (37 in keysPressed && p2.x > 0) {
      p2.x -= p2.speed * modifier
    }
    if (39 in keysPressed && p2.x < canvas.width - spriteWidth) {
      p2.x += p2.speed * modifier
    }

    monsterArray.forEach(function (mon) {
      mon.updatePosition()
    })

    pArray.forEach(function (player) {
      monsterArray.forEach(function (monster) {
        catchTheHero(player, monster)
      })
    })

    $('#score').text(p1.lives + ' : ' + p2.lives)
  }

  // go to game over screen
  function gameOverScreen () {
    context.clearRect(0, 0, width, height)
    $('canvas').hide()
    $('#game-over').show()
    if (p1.hit) {
      $('h1').text('Player 2 wins!')
    } else {
      $('h1').text('Player 1 wins!')
    }
  }

  // reset the game on player hit or when game is over
  function reset () {
    if (!isGameOver) {
      pArray.forEach(function (player) {
        if (player.hit) {
          player.x = player.startingx
          player.y = player.startingy
          player.hit = false
        }
        monsterArray.forEach(function (monster) {
          if (monster.hit) {
            monster.x = randomSpawn()[0]
            monster.y = randomSpawn()[1]
            monster.hit = false
          }
        })
      })
    } else {
      pArray.forEach(function (player) {
        player.lives = 5
        player.x = player.startingx
        player.y = player.startingy
        player.hit = false
      })
      monsterArray.forEach(function (monster) {
        monster.x = randomSpawn()[0]
        monster.y = randomSpawn()[1]
        monster.hit = false
        monsterArray = []
        createMonster()
        createMonster()
        createMonster()
        createMonster()
        createMonster()
        createMonster()
        createMonster()
        createMonster()
      })
      isGameOver = false
      refreshCounter = 0
    }
  }

  // restart the game
  $('#restart').on('click', function () {
    $('#game-over').hide()
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

  // draw everything
  function render () {
    refreshCounter++
    context.clearRect(0, 0, width, height)

    pArray.forEach(function (player) {
      context.drawImage(player.image, player.x, player.y)
    })

    monsterArray.forEach(function (mon) {
      context.drawImage(mon.image, mon.x, mon.y)
    })
  }

  var runMainGame = function () {
    var now = Date.now()
    var delta = now - then

    moveSpritesAndCheckCollisions(delta / 1000)
    render()

    if (refreshCounter % 150 === 0) {
      createMonster()
      createMonster()
    }

    then = now

    if (!isGameOver) {
      window.requestAnimationFrame(runMainGame)
    } else {
      window.requestAnimationFrame(gameOverScreen)
    }
  }

  function startGame () {
    hasGameStarted = true
    $('#start-game').hide()
    $('canvas').show()
    then = Date.now()
    reset()
    runMainGame()
  }
})
