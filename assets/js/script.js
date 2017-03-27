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

// general game variables
  var p1confirmed = false
  var p2confirmed = false
  var hasGameStarted = false
  var isGameOver = false
  var refreshCounter = 0
  var powerUpCounter = 0
  var powerUpActive = false

// important!
  resizeCanvas()

// add keyboard eventListeners for start-game screen
  window.addEventListener('keydown', function (e) {
    keysPressed[e.keyCode] = true
    if (!hasGameStarted) {
      if (e.keyCode === 65) {
        $('#p1left').css('background-color', '#8a0707')
      } else if (e.keyCode === 68) {
        $('#p1right').css('background-color', '#8a0707')
      } else if (e.keyCode === 87) {
        $('#p1up').css('background-color', '#8a0707')
      } else if (e.keyCode === 83) {
        $('#p1down').css('background-color', '#8a0707')
      } else if (e.keyCode === 37) {
        $('#p2left').css('background-color', '#8a0707')
      } else if (e.keyCode === 39) {
        $('#p2right').css('background-color', '#8a0707')
      } else if (e.keyCode === 38) {
        $('#p2up').css('background-color', '#8a0707')
      } else if (e.keyCode === 40) {
        $('#p2down').css('background-color', '#8a0707')
      } else if (e.keyCode === 32) {
        p1confirmed = !p1confirmed
        checkConfirm('p1', p1confirmed)
      } else if (e.keyCode === 13) {
        p2confirmed = !p2confirmed
        checkConfirm('p2', p2confirmed)
      }
      if (p1confirmed && p2confirmed) {
        window.setTimeout(function () {
          loadGame()
        }, 1200)
        $('#start-game').css('opacity', '0.0')
        $('#start-game').css('transition', 'opacity 1.2s')
      }
    } else {
      if (e.keyCode === 32) {
        p1.abilityCharge > 0 ? p1.useAbility() : p1.abilityCharge = 0
        p1.abilityCharge > 0 ? p1.abilityCharge -= 1 : p1.abilityCharge = 0
      } else if (e.keyCode === 13) {
        p2.abilityCharge > 0 ? p2.useAbility() : p2.abilityCharge = 0
        p2.abilityCharge > 0 ? p2.abilityCharge -= 1 : p2.abilityCharge = 0
      }
    }
  }, false)

  window.addEventListener('keyup', function (e) {
    delete keysPressed[e.keyCode]
    if (!hasGameStarted) {
      if (e.keyCode === 65) {
        $('#p1left').css('background-color', '')
      } else if (e.keyCode === 68) {
        $('#p1right').css('background-color', '')
      } else if (e.keyCode === 87) {
        $('#p1up').css('background-color', '')
      } else if (e.keyCode === 83) {
        $('#p1down').css('background-color', '')
      } else if (e.keyCode === 37) {
        $('#p2left').css('background-color', '')
      } else if (e.keyCode === 39) {
        $('#p2right').css('background-color', '')
      } else if (e.keyCode === 38) {
        $('#p2up').css('background-color', '')
      } else if (e.keyCode === 40) {
        $('#p2down').css('background-color', '')
      }
    }
  }, false)

  // animate the player choosing screen
  function checkConfirm (player, confirmed) {
    if (confirmed) {
      $('#' + player).css('background-color', 'rgba(255,255,255,0.2)')
      $('#' + player + 'confirm').css('animation', 'steady-confirm')
      $('#' + player + 'confirm').css('background-color', '#FFFFFF')
      $('#' + player + 'confirm').css('color', '#8a0707')
      $('#' + player + 'up').text('')
      $('#' + player + 'down').text('')
      $('#' + player + 'left').text('')
      $('#' + player + 'right').text('')
      $('#' + player + 'confirm').text('Ready!')
    } else {
      $('#' + player + 'confirm').css('animation', 'blink-confirm 2s infinite')
      $('#' + player).css('background-color', 'rgba(0,0,0,0.2)')
      $('#' + player + 'confirm').css('color', '#FFFFFF')
      if (player === 'p1') {
        $('#' + player + 'up').text('W')
        $('#' + player + 'down').text('S')
        $('#' + player + 'left').text('A')
        $('#' + player + 'right').text('D')
        $('#' + player + 'confirm').text('Press [ spacebar ] to choose me')
      } else if (player === 'p2') {
        $('#' + player + 'up').text('⇧')
        $('#' + player + 'down').text('⇩')
        $('#' + player + 'left').text('⇦')
        $('#' + player + 'right').text('⇨')
        $('#' + player + 'confirm').text('Press [ enter ] to choose me')
      }
    }
  }

  window.addEventListener('resize', resizeCanvas, false)

  window.addEventListener('orientationchange', resizeCanvas, false)

  // resize the canvas if necessary
  function resizeCanvas () {
    canvas.width = window.innerWidth
    canvas.height = window.innerHeight * 0.8
    var margin = window.innerHeight * 0.1
    width = canvas.width
    height = canvas.height
    // make the 3 screens the same dimensions as the canvas
    $('#start-game').css('width', width + 'px')
    $('#start-game').css('height', height + 'px')
    $('#load-game').css('width', width + 'px')
    $('#load-game').css('height', height + 'px')
    $('#game-over').css('width', width + 'px')
    $('#game-over').css('height', height + 'px')
    $('h1').css('height', margin + 'px')
  }

// background object
  // function Background (sprite, x, y) {
  //   this.image = createImage(sprite)
  //   this.x = x
  //   this.y = y
  // }

// player objects
  function Player (sprite, x, y) {
    this.image = createImage(sprite)
    this.lives = 5
    this.hit = false
    this.speed = 192
    this.startingx = x
    this.startingy = y
    this.x = x
    this.y = y
    this.radius = Math.sqrt(spriteWidth * spriteWidth + spriteHeight * spriteHeight) / 2
    this.isInvulnerable = true
    this.invulnerableTimer = 120
    this.isPhasing = false
    this.phasingTimer = 0
    this.usingBomb = false
    this.bombPlaced = false
    this.bombTimer = 0
    this.bombRadius = Math.sqrt(spriteWidth * spriteWidth + spriteHeight * spriteHeight) * 1.5
    this.abilityCharge = 3
    this.hasInvincible = false
    this.hasPhasing = false
    this.hasOneUp = false
    this.hasBomb = false
  }

  Player.prototype.useAbility = function () {
    switch (true) {
      case (this.hasInvincible):
        this.isInvulnerable = true
        this.invulnerableTimer = 120
        break
      case (this.hasPhasing):
        this.isPhasing = true
        this.phasingTimer = 120
        break
      case (this.hasOneUp):
        this.lives += 1
        break
      case (this.hasBomb):
        this.usingBomb = true
        this.bombPlaced = true
        this.bombTimer = 30
        break
      default:
        return
    }
  }

  Player.prototype.checkIfInvulnerable = function () {
    if (this.invulnerableTimer > 0) {
      this.invulnerableTimer--
      this.isInvulnerable = true
    }
    if (this.invulnerableTimer <= 0) {
      this.isInvulnerable = false
    }
  }

  Player.prototype.checkIfPhasing = function () {
    if (this.hasPhasing) {
      if (this.phasingTimer > 0) {
        this.phasingTimer--
        this.isPhasing = true
      }
      if (this.phasingTimer <= 0) {
        this.isPhasing = false
      }
    }
  }

  Player.prototype.checkIfBombed = function (monster) {
    if (this.hasBomb) {
      if (this.usingBomb) {
        var dx = monster.x - (this.x + spriteWidth / 2)
        var dy = monster.y - (this.y + spriteHeight / 2)
        var distance = Math.sqrt(dx * dx + dy * dy)
        if (distance < monster.radius + this.bombRadius) {
          monster.bombed = true
        }
      }
      if (this.bombTimer > 0) {
        this.bombTimer--
        this.bombPlaced = true
      }
      if (this.bombTimer <= 0) {
        this.bombPlaced = false
      }
    }
  }

  function clearBombedMonsters () {
    bombedMonstersArray = monsterArray.filter(function (monster) {
      return monster.bombed === false
    })
    monsterArray = bombedMonstersArray
  }

// monster objects
  function Monster (x, y, speed) {
    this.image = createImage('monster')
    this.hit = false
    this.bombed = false
    this.speedModifier = speed
    this.x = x
    this.y = y
    this.radius = Math.sqrt(spriteWidth * spriteWidth + spriteHeight * spriteHeight) / 2
  }

  Monster.prototype.updatePosition = function () {
    this.x += chaseTheHero(p1.x, p1.y, p2.x, p2.y, this.x, this.y, this.speedModifier)[0]
    this.y += chaseTheHero(p1.x, p1.y, p2.x, p2.y, this.x, this.y, this.speedModifier)[1]
  }

  // obstacle objects
  function Obstacle (xLeft, yTop, width, height) {
    this.xLeft = xLeft
    this.yTop = yTop
    this.xRight = xLeft + width
    this.yBottom = yTop + height
    this.width = width
    this.height = height
  }

  // power up objects
  function PowerUp (x, y, radius, start, end) {
    this.x = x
    this.y = y
    this.radius = radius
    this.pulseRadius = radius
    this.start = start
    this.end = end
  }

  PowerUp.prototype.pulse = function () {
    this.pulseRadius < this.radius * 1.5 ? this.pulseRadius += 0.2 : this.pulseRadius = this.radius
  }

  // create the images
  function createImage (sprite) {
    if (sprite === 'player') {
      return document.querySelector('#hero')
    } else if (sprite === 'antihero') {
      return document.querySelector('#antihero')
    } else if (sprite === 'monster') {
      return document.querySelector('#monster')
    }
  }

  // create the background
  // var background = new Background('background', 0, 0)

  // create the players
  var pArray = []
  var p1 = new Player('player', width / 3, height / 2)
  var p2 = new Player('antihero', width * 2 / 3, height / 2)
  p1.hasInvincible = true
  // p1.hasOneUp = true
  // p1.hasPhasing = true
  p2.hasBomb = true
  pArray.push(p1)
  pArray.push(p2)

// create the monsters
  var monsterArray = []
  var bombedMonstersArray = []
  function createMonster () {
    var monster = new Monster(randomSpawn()[0], randomSpawn()[1], randomSpeed())
    monsterArray.push(monster)
  }

  for (var i = 0; i < 8; i++) {
    createMonster()
  }

  // create the obstacles
  var obstacleArray = []
  function createObstacles () {
    var xGap = spriteWidth * 2
    var xWidth = width / 3
    var yGap = spriteHeight * 2
    var yHeight = height / 2
    var obsPositionArray = [[xGap, yGap], [xGap + xWidth, yGap], [xGap + 2 * xWidth, yGap], [xGap, yGap + yHeight], [xGap + xWidth, yGap + yHeight], [xGap + 2 * xWidth, yGap + yHeight]]
    obsPositionArray.forEach(function (pos) {
      var obsWidth = Math.max(Math.random() * xWidth / 2, 48)
      var obsHeight = Math.max(Math.random() * yHeight / 2, 48)
      var obsX = Math.random() * (xWidth - 2 * xGap - obsWidth) + pos[0]
      var obsY = Math.random() * (yHeight - 2 * yGap - obsHeight) + pos[1]
      var obstacle = new Obstacle(obsX, obsY, obsWidth, obsHeight)
      obstacleArray.push(obstacle)
    })
  }
  createObstacles()

  // create a PowerUp
  var powerUpArray = []
  function createPowerUp () {
    var powerUp = new PowerUp(width / 2 - 8, height / 2 - 8, 16, 0, 2 * Math.PI)
    powerUpArray.push(powerUp)
  }
  createPowerUp()

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
    return 0.01 + Math.floor(Math.random() * 3) / 120
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
      if (player.isInvulnerable) {
        return
      } else {
        if (player.lives > 0) {
          player.lives--
          player.hit = true
          mon.hit = true
          reset()
        } else {
          isGameOver = true
        }
      }
    }
  }

  // check if an obstacle is in the way
  // TL = top left, TR = top right, BL = bottom left, BR = bottom right
  // returns [canMoveUp?, canMoveDown?, canMoveLeft?, canMoveRight?]
  // function isObstacleBlocking (player, obs) {
  //   var canMove = []
  //   player.x + spriteWidth <= obs.xLeft || player.x >= obs.xRight || player.y + spriteHeight <= obs.yTop || player.y >= obs.yBottom ? canMove.push(true) : canMove.push(false)
  //   player.x + spriteWidth <= obs.xLeft || player.x >= obs.xRight || player.y + spriteHeight <= obs.yTop || player.y >= obs.yBottom ? canMove.push(true) : canMove.push(false)
  //   player.x >= obs.xRight || player.x + spriteWidth <= obs.xLeft || player.y <= obs.yTop || player.y >= obs.yBottom ? canMove.push(true) : canMove.push(false)
  //   player.x >= obs.xRight || player.x + spriteWidth <= obs.xLeft || player.y + spriteHeight <= obs.yTop || player.y >= obs.yBottom ? canMove.push(true) : canMove.push(false)
  //   return canMove
  // }
  function isObstacleBlocking (player, obs) {
    return player.x < obs.xRight && player.x + spriteWidth > obs.xLeft && player.y + spriteHeight > obs.yTop && player.y < obs.yBottom
  }

// original obstacle check failed -> workaround - redraw player sprite if it runs into an obstacle
// x: 0 = left, 1 = right; y: 0 = top, 1 = bottom
  function shiftPlayerModel (player, obs) {
    var minX = Math.abs(player.x - obs.xRight) > Math.abs((player.x + spriteWidth) - obs.xLeft) ? obs.xLeft - spriteWidth : obs.xRight
    var minY = Math.abs(player.y - obs.yBottom) > Math.abs((player.y + spriteHeight) - obs.yTop) ? obs.yTop - spriteHeight : obs.yBottom
    return [minX, minY]
  }

  function getPowerUp (player, powerUp) {
    if (powerUpActive) {
      var dx = powerUp.x - (player.x + spriteWidth / 2)
      var dy = powerUp.y - (player.y + spriteHeight / 2)
      var distance = Math.sqrt(dx * dx + dy * dy)

      if (distance < powerUp.radius + player.radius) {
        powerUpActive = false
        powerUpCounter = 0
        player.abilityCharge += 1
        $('body').css('background-color', '#FFB30F')
        $('body').css('transition', 'background-color 0.5s ease-out')
        setTimeout(function () {
          $('body').css('background-color', '#484349')
        }, 500)
      }
    }
  }

  // move players and monsters, check collisions and update the score
  function movePlayers (modifier) {
  // player 1 wasd
    if (87 in keysPressed && p1.y > 0) {
      p1.y -= p1.speed * modifier
      if (!p1.isPhasing) {
        obstacleArray.forEach(function (obstacle) {
          if (isObstacleBlocking(p1, obstacle)) {
            p1.y = shiftPlayerModel(p1, obstacle)[1]
          }
        })
      }
    }
    if (83 in keysPressed && p1.y < canvas.height - spriteHeight) {
      p1.y += p1.speed * modifier
      if (!p1.isPhasing) {
        obstacleArray.forEach(function (obstacle) {
          if (isObstacleBlocking(p1, obstacle)) {
            p1.y = shiftPlayerModel(p1, obstacle)[1]
          }
        })
      }
    }
    if (65 in keysPressed && p1.x > 0) {
      p1.x -= p1.speed * modifier
      if (!p1.isPhasing) {
        obstacleArray.forEach(function (obstacle) {
          if (isObstacleBlocking(p1, obstacle)) {
            p1.x = shiftPlayerModel(p1, obstacle)[0]
          }
        })
      }
    }
    if (68 in keysPressed && p1.x < canvas.width - spriteWidth) {
      p1.x += p1.speed * modifier
      if (!p1.isPhasing) {
        obstacleArray.forEach(function (obstacle) {
          if (isObstacleBlocking(p1, obstacle)) {
            p1.x = shiftPlayerModel(p1, obstacle)[0]
          }
        })
      }
    }
  // player 2 arrow keys
    if (38 in keysPressed && p2.y > 0) {
      p2.y -= p2.speed * modifier
      if (!p2.isPhasing) {
        obstacleArray.forEach(function (obstacle) {
          if (isObstacleBlocking(p2, obstacle)) {
            p2.y = shiftPlayerModel(p2, obstacle)[1]
          }
        })
      }
    }
    if (40 in keysPressed && p2.y < canvas.height - spriteHeight) {
      p2.y += p2.speed * modifier
      if (!p2.isPhasing) {
        obstacleArray.forEach(function (obstacle) {
          if (isObstacleBlocking(p2, obstacle)) {
            p2.y = shiftPlayerModel(p2, obstacle)[1]
          }
        })
      }
    }
    if (37 in keysPressed && p2.x > 0) {
      p2.x -= p2.speed * modifier
      if (!p2.isPhasing) {
        obstacleArray.forEach(function (obstacle) {
          if (isObstacleBlocking(p2, obstacle)) {
            p2.x = shiftPlayerModel(p2, obstacle)[0]
          }
        })
      }
    }
    if (39 in keysPressed && p2.x < canvas.width - spriteWidth) {
      p2.x += p2.speed * modifier
      if (!p2.isPhasing) {
        obstacleArray.forEach(function (obstacle) {
          if (isObstacleBlocking(p2, obstacle)) {
            p2.x = shiftPlayerModel(p2, obstacle)[0]
          }
        })
      }
    }
  }

// move the monsters
  function moveMonsters () {
    monsterArray.forEach(function (mon) {
      mon.updatePosition()
    })
  }

// check if the players are caught
  function checkIfCaught () {
    pArray.forEach(function (player) {
      player.checkIfInvulnerable()
      player.checkIfPhasing()
      monsterArray.forEach(function (monster) {
        player.checkIfBombed(monster)
        catchTheHero(player, monster)
      })
      player.usingBomb = false
    })
    clearBombedMonsters()
  }

  // check if the players have a power up
  function checkIfHasPowerUp () {
    pArray.forEach(function (player) {
      powerUpArray.forEach(function (powerUp) {
        getPowerUp(player, powerUp)
      })
    })
  }

// update the score
  function updateScore () {
    $('#score').text(p1.abilityCharge + ' charges ' + p1.lives + ' : ' + p2.lives + ' charges ' + p2.abilityCharge)
  }

// show the loading screen between the landing page and the game
  function loadGame () {
    var countdown = 2
    $('#start-game').hide()
    $('#countdown').text('3')
    $('#load-game').show()
    var interval = window.setInterval(function () {
      $('#countdown').text(countdown)
      countdown--
    }, 1000)

    function showCanvas () {
      window.clearInterval(interval)
      startGame()
    }
    window.setTimeout(showCanvas, 3000)
  }

  // start the game
  function startGame () {
    resizeCanvas()
    hasGameStarted = true
    // $('#start-game').hide()
    $('#load-game').hide()
    $('canvas').show()
    then = Date.now()
    reset()
    runMainGame()
  }

  // go to game over screen
  function gameOverScreen () {
    context.clearRect(0, 0, width, height)
    $('canvas').hide()
    $('#game-over').show()
    // update the front page
    // $('.story').text('The final survivor was')
    // if (p1.lives > 0) {
      // $('.be-the-last').text('Last Human #1')
    // } else {
    //   $('#be-the-last').text('Last Human #2')
    // }
  }

  // reset the game when a player is hit or when game is over
  function reset () {
    if (!isGameOver) {
      pArray.forEach(function (player) {
        if (player.hit) {
          $('body').css('background-color', '#8a0707')
          $('body').css('transition', 'background-color 0.5s ease-out')
          setTimeout(function () {
            $('body').css('background-color', '#484349')
          }, 500)
          player.hit = false
          player.isInvulnerable = true
          player.invulnerableTimer = 120
        }
      })
      monsterArray.forEach(function (monster) {
        if (monster.hit) {
          monster.hit = false
          monster.x = randomSpawn()[0]
          monster.x = randomSpawn()[1]
        }
      })
    } else {
      // reset players
      pArray = []
      p1 = new Player('player', width / 3, height / 2)
      p2 = new Player('antihero', width * 2 / 3, height / 2)
      p1.hasInvincible = true
        // p1.hasOneUp = true
        // p1.hasPhasing = true
      p2.hasBomb = true
      pArray.push(p1)
      pArray.push(p2)
      // reset monsters
      monsterArray = []
      bombedMonstersArray = []
      for (var i = 0; i < 8; i++) {
        createMonster()
      }
      // reset obstacles
      obstacleArray = []
      createObstacles()
      // reset powerups
      powerUpArray = []
      createPowerUp()
      // reset game variables
      p1confirmed = false
      p2confirmed = false
      hasGameStarted = true
      isGameOver = false
      refreshCounter = 0
      powerUpCounter = 0
      powerUpActive = false
    }
  }

  // restart the game
  $('#back-to-start-game').on('mouseenter', function () {
    $(this).text('Yes! I want to finish last!')
  })

  $('#back-to-start-game').on('mouseleave', function () {
    $(this).text('Play again?')
  })

// return to landing page
  $('#back-to-start-game').on('click', function () {
    p1confirmed = false
    checkConfirm('p1', p1confirmed)
    p2confirmed = false
    checkConfirm('p2', p2confirmed)
    hasGameStarted = false
    $('#start-game').css('opacity', '1.0')
    $('#game-over').hide()
    $('#start-game').show()
    $('#score').text('')
  })

  // draw everything
  function render () {
    refreshCounter++
    powerUpCounter++
    context.clearRect(0, 0, width, height)

    context.lineWidth = 3

    obstacleArray.forEach(function (obstacle) {
      context.beginPath()
      context.rect(obstacle.xLeft, obstacle.yTop, obstacle.width, obstacle.height)
      context.fillStyle = '#484349'
      context.fill()
    })

    pArray.forEach(function (player) {
      if (player.bombPlaced) {
        context.beginPath()
        context.arc(player.x + spriteWidth / 2, player.y + spriteHeight / 2, player.bombRadius, 0, 2 * Math.PI)
        context.fillStyle = '#8a0707'
        context.fill()
      }
      context.drawImage(player.image, player.x, player.y)
      if (player.isInvulnerable) {
        context.beginPath()
        context.arc(player.x + spriteWidth / 2, player.y + spriteHeight / 2, player.radius, 0, 2 * Math.PI)
        context.strokeStyle = '#457394'
        context.stroke()
      }
    })

    monsterArray.forEach(function (mon) {
      context.drawImage(mon.image, mon.x, mon.y)
    })

    if (powerUpActive) {
      powerUpArray.forEach(function (powerUp) {
        context.beginPath()
        context.arc(powerUp.x, powerUp.y, powerUp.radius, powerUp.start, powerUp.end)
        context.fillStyle = '#FFB30F'
        context.fill()

        context.beginPath()
        context.arc(powerUp.x, powerUp.y, powerUp.pulseRadius, powerUp.start, powerUp.end)
        context.strokeStyle = '#FFB30F'
        context.stroke()

        powerUp.pulse()
      })
    }
  }

// main game loop
  var runMainGame = function () {
    var now = Date.now()
    var delta = now - then

    movePlayers(delta / 1000)
    moveMonsters()
    checkIfCaught()
    checkIfHasPowerUp()
    updateScore()
    render()

// add more monsters every 3s (1 + 1 monster for every three combined lives lost)
    if (refreshCounter % 180 === 0) {
      var numToSpawn = Math.min(2, 12 - (p1.lives + p2.lives))
      createMonster()
      for (i = 0; i <= numToSpawn; i += 2) {
        createMonster()
      }
    }

// spawn a powerUp every 10s
    if (powerUpCounter % 600 === 0) {
      powerUpActive ? powerUpActive = true : powerUpActive = true
    }

    then = now

    if (!isGameOver) {
      window.requestAnimationFrame(runMainGame)
    } else {
      window.requestAnimationFrame(gameOverScreen)
    }
  }
})
