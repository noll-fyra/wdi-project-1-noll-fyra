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
  var isGameOver = false
  var refreshCounter = 0
  $('#game-name').text(gameName)

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
  function createMonster () {
    var monster = new Monster(randomSpawn()[0], randomSpawn()[1], randomSpeed())
    monsterArray.push(monster)
  }
  createMonster()
  createMonster()
  createMonster()
  createMonster()

  // randomise where the monsters spawn
  function randomSpawn () {
    return [spriteWidth * 4 + (Math.random() * (width - spriteWidth * 8)), spriteHeight * 4 + (Math.random() * (height - spriteHeight * 8))]
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
  function catchTheHero (play, mon) {
    if (play.x <= (mon.x + spriteWidth) && mon.x <= (play.x + spriteWidth) && play.y <= (mon.y + spriteHeight) && mon.y <= (play.y + spriteHeight)) {
      play.lives--
      play.hit = true
      mon.hit = true
      if (play.lives > 0) {
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
    $('#restart').show()
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
            monster.x = randomSpawn()[1]
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
      })
      isGameOver = false
      refreshCounter = 0
      $('#game-name').text(gameName)
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

    if (refreshCounter % 600 === 0) {
      createMonster()
    }

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
