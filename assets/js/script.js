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

  var characterConfirm = [Math.floor(Math.random() * 6), Math.floor(Math.random() * 6)]
  var characterBio = [Math.floor(Math.random() * 10), Math.floor(Math.random() * 10)]

  // plays on load-game
  var tenebrousAudio = document.querySelector('#tenebrous')
  // plays when hit
  var zombieHitAudio = document.querySelector('#zombie-hit')
  // plays when the game starts or ends
  var zombieRoarAudio = document.querySelector('#zombie-roar')
  // plays when the game is running
  var zombieGroupAudio = document.querySelector('#zombie-group')
  // plays when the game is running
  var inPursuitAudio = document.querySelector('#in-pursuit')
  // plays when a player gets a power up
  var powerUpAudio = document.querySelector('#power-up')

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
  updateAbility()
  updateBio()

// update player ability
  function changePlayerAbility (number, direction) {
    var currentNumber = 0
    if (direction === 'right') {
      if (characterConfirm[number] === 5) {
        characterConfirm[number] = 0
      } else {
        currentNumber = characterConfirm[number]
        characterConfirm[number] = currentNumber + 1
      }
    } else if (direction === 'left') {
      if (characterConfirm[number] === 0) {
        characterConfirm[number] = 5
      } else {
        currentNumber = characterConfirm[number]
        characterConfirm[number] = currentNumber - 1
      }
    }
    updateAbility()
    updateBio()
  }

  function changePlayerBio (number, direction) {
    var currentNumber = 0
    if (direction === 'up') {
      if (characterBio[number] === 9) {
        characterBio[number] = 0
      } else {
        currentNumber = characterBio[number]
        characterBio[number] = currentNumber + 1
      }
    } else if (direction === 'down') {
      if (characterBio[number] === 0) {
        characterBio[number] = 9
      } else {
        currentNumber = characterBio[number]
        characterBio[number] = currentNumber - 1
      }
    }
    updateBio()
    updateAbility()
  }

  function updateAbility () {
    $('#p1 .player-name').text(p1AbilityArray[characterConfirm[0]].name)
    $('#p1 .ability-name').text(p1AbilityArray[characterConfirm[0]].ability)
    $('#p1 .ability-description').text(p1AbilityArray[characterConfirm[0]].description)

    $('#p2 .player-name').text(p2AbilityArray[characterConfirm[1]].name)
    $('#p2 .ability-name').text(p2AbilityArray[characterConfirm[1]].ability)
    $('#p2 .ability-description').text(p2AbilityArray[characterConfirm[1]].description)
  }

  function updateBio () {
    $('#p1 .bio-category').text(bioTemplate[characterBio[0]])
    $('#p1 .bio-quip').text(p1BioArray[characterConfirm[0]][characterBio[0]])

    $('#p2 .bio-category').text(bioTemplate[characterBio[1]])
    $('#p2 .bio-quip').text(p2BioArray[characterConfirm[1]][characterBio[1]])
  }

// add keyboard eventListeners for start-game screen
  window.addEventListener('keydown', function (e) {
    keysPressed[e.keyCode] = true
    if (!hasGameStarted) {
      if (e.keyCode === 65) {
        if (!p1confirmed) {
          $('#p1left').css('background-color', '#8a0707')
          changePlayerAbility(0, 'left')
        }
      } else if (e.keyCode === 68) {
        if (!p1confirmed) {
          $('#p1right').css('background-color', '#8a0707')
          changePlayerAbility(0, 'right')
        }
      } else if (e.keyCode === 87) {
        if (!p1confirmed) {
          $('#p1up').css('background-color', '#8a0707')
          changePlayerBio(0, 'up')
        }
      } else if (e.keyCode === 83) {
        if (!p1confirmed) {
          $('#p1down').css('background-color', '#8a0707')
          changePlayerBio(0, 'down')
        }
      } else if (e.keyCode === 37) {
        if (!p2confirmed) {
          $('#p2left').css('background-color', '#8a0707')
          changePlayerAbility(1, 'left')
        }
      } else if (e.keyCode === 39) {
        if (!p2confirmed) {
          $('#p2right').css('background-color', '#8a0707')
          changePlayerAbility(1, 'right')
        }
      } else if (e.keyCode === 38) {
        if (!p2confirmed) {
          $('#p2up').css('background-color', '#8a0707')
          changePlayerBio(1, 'up')
        }
      } else if (e.keyCode === 40) {
        if (!p2confirmed) {
          $('#p2down').css('background-color', '#8a0707')
          changePlayerBio(1, 'down')
        }
      } else if (e.keyCode === 32) {
        p1confirmed = !p1confirmed
        checkConfirm('p1', p1confirmed)
      } else if (e.keyCode === 13) {
        p2confirmed = !p2confirmed
        checkConfirm('p2', p2confirmed)
      }
      if (p1confirmed && p2confirmed) {
        createPlayers()
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
      $('#' + player).css('background-color', 'rgba(255,255,255,0.5)')
      $('#' + player + 'confirm').css('animation', 'steady-confirm')
      $('#' + player + 'confirm').css('background-color', '#FFFFFF')
      $('#' + player + 'confirm').css('color', '#8a0707')
      $('#p' + player + '.player-name').css('color', '#8a0707')
      $('#' + player + 'up').text('')
      $('#' + player + 'down').text('')
      $('#' + player + 'left').text('')
      $('#' + player + 'right').text('')
      $('#' + player + 'confirm').text('Ready!')
    } else {
      $('#' + player + 'confirm').css('animation', 'blink-confirm 2s infinite')
      $('#' + player).css('background-color', 'rgba(0,0,0,0.5)')
      $('#' + player + 'confirm').css('color', '#FFFFFF')
      if (player === 'p1') {
        $('#' + player + 'up').text('W')
        $('#' + player + 'down').text('S')
        $('#' + player + 'left').text('A')
        $('#' + player + 'right').text('D')
        $('#' + player + 'confirm').text('[ spacebar ]')
      } else if (player === 'p2') {
        $('#' + player + 'up').text('⇧')
        $('#' + player + 'down').text('⇩')
        $('#' + player + 'left').text('⇦')
        $('#' + player + 'right').text('⇨')
        $('#' + player + 'confirm').text('[ enter ]')
      }
    }
  }

  window.addEventListener('resize', resizeCanvas, false)

  window.addEventListener('orientationchange', resizeCanvas, false)

  // resize the canvas if necessary
  function resizeCanvas () {
    var fullWidth = window.innerWidth
    var fullHeight = window.innerHeight
    var canvasDivWidth = fullWidth * 0.9
    var canvasDivHeight = fullHeight * 0.8
    $('.canvas-div').css('width', canvasDivWidth + 'px')
    $('.canvas-div').css('height', canvasDivHeight + 'px')
    canvas.width = canvasDivWidth
    canvas.height = canvasDivHeight
    width = canvas.width
    height = canvas.height
    // resize the screens
    $('#start-game').css('width', width + 'px')
    $('#start-game').css('height', fullHeight + 'px')
    $('#load-game').css('width', width + 'px')
    $('#load-game').css('height', fullHeight + 'px')
    $('.canvas-container').css('width', width + 'px')
    $('.canvas-container').css('height', fullHeight + 'px')
  }

// player objects
  function Player (number, sprite) {
    this.number = number
    this.image = createImage(sprite)
    this.startingx = width / 3 * number
    this.startingy = height / 2
    this.x = this.startingx
    this.y = this.startingy
    this.speed = 192
    this.lives = 5
    this.abilityCharge = 3
    this.hit = false
    // invincible - ability / invulnerable - when hit/spawning
    this.hasInvincible = false
    this.radius = Math.sqrt(spriteWidth * spriteWidth + spriteHeight * spriteHeight) / 2
    this.isInvulnerable = true
    this.invulnerableTimer = 120
    // phasing
    this.hasPhasing = false
    this.isPhasing = false
    this.phasingTimer = 0
    // oneUp
    this.hasOneUp = false
    // bomb
    this.hasBomb = false
    this.usingBomb = false
    this.bombPlaced = false
    this.bombTimer = 0
    this.bombRadius = Math.sqrt(spriteWidth * spriteWidth + spriteHeight * spriteHeight) * 1.5
    // speeding
    this.hasSpeeding = false
    this.isSpeeding = false
    this.speedingTimer = 0
    // teleport
    this.hasTeleporting = false
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
      case (this.hasSpeeding):
        this.isSpeeding = true
        this.speedingTimer = 120
        break
      case (this.hasTeleporting):
        if (this.number === 1) {
          this.x = p2.x
          this.y = p2.y
        } else {
          this.x = p1.x
          this.y = p1.y
        }
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

  Player.prototype.checkIfBombed = function (zombie) {
    if (this.hasBomb) {
      if (this.usingBomb) {
        var dx = zombie.x - (this.x + spriteWidth / 2)
        var dy = zombie.y - (this.y + spriteHeight / 2)
        var distance = Math.sqrt(dx * dx + dy * dy)
        if (distance < zombie.radius + this.bombRadius) {
          zombie.bombed = true
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

  Player.prototype.checkIfSpeeding = function () {
    if (this.hasSpeeding) {
      if (this.speedingTimer > 0) {
        this.speedingTimer--
        this.isSpeeding = true
        this.speed = 288
      }
      if (this.speedingTimer <= 0) {
        this.isSpeeding = false
        this.speed = 192
      }
    }
  }

// zombie objects
  function Zombie (x, y, speed) {
    this.image = createImage('zombie')
    this.hit = false
    this.bombed = false
    this.speedModifier = speed
    this.x = x
    this.y = y
    this.radius = Math.sqrt(spriteWidth * spriteWidth + spriteHeight * spriteHeight) / 2
  }

  Zombie.prototype.updatePosition = function () {
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
    this.pulseRadius < this.radius * 1.5 ? this.pulseRadius += 0.1 : this.pulseRadius = this.radius
  }

  // create the images
  function createImage (sprite) {
    if (sprite === 'player') {
      return document.querySelector('#hero')
    } else if (sprite === 'heroine') {
      return document.querySelector('#heroine')
    } else if (sprite === 'zombie') {
      return document.querySelector('#zombie')
    }
  }

  // create the players
  var ali = new Player(1, 'player')
  ali.hasInvincible = true
  var cam = new Player(1, 'player')
  cam.hasOneUp = true
  var kai = new Player(1, 'player')
  kai.hasPhasing = true
  var lex = new Player(1, 'player')
  lex.hasBomb = true
  var roy = new Player(1, 'player')
  roy.hasSpeeding = true
  var taj = new Player(1, 'player')
  taj.hasTeleporting = true
  var p1Array = [ali, cam, kai, lex, roy, taj]

  var ann = new Player(2, 'heroine')
  ann.hasInvincible = true
  var eva = new Player(2, 'heroine')
  eva.hasOneUp = true
  var ida = new Player(2, 'heroine')
  ida.hasPhasing = true
  var joy = new Player(2, 'heroine')
  joy.hasBomb = true
  var rae = new Player(2, 'heroine')
  rae.hasSpeeding = true
  var sky = new Player(2, 'heroine')
  sky.hasTeleporting = true
  var p2Array = [ann, eva, ida, joy, rae, sky]

  var pArray = []
  var p1
  var p2

  function createPlayers () {
    p1 = p1Array[characterConfirm[0]]
    p2 = p2Array[characterConfirm[1]]
    pArray.push(p1)
    pArray.push(p2)
    pArray.forEach(function (player) {
      player.x = player.startingx
      player.y = player.startingy
      player.lives = 5
      player.abilityCharge = 3
      player.hit = false
    })
  }

// create the zombiess
  var zombieArray = []
  var bombedZombiesArray = []
  function createZombie () {
    var zombie = new Zombie(randomSpawn()[0], randomSpawn()[1], randomSpeed())
    zombieArray.push(zombie)
  }

  for (var i = 0; i < 8; i++) {
    createZombie()
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

  // randomise where the zombies spawn along the edges - top right bottom left
  function randomSpawn () {
    switch (zombieArray.length % 4) {
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

  // randomise the zombies' speeds
  function randomSpeed () {
    return 0.01 + Math.floor(Math.random() * 3) / 120
  }

// make the zombies chase the nearest player
  function chaseTheHero (p1x, p1y, p2x, p2y, zomx, zomy, zomspeedmod) {
    var p1xDistance = Math.abs(p1x - zomx)
    var p1yDistance = Math.abs(p1y - zomy)
    var p1Hypotenuse = Math.sqrt(Math.pow(p1xDistance, 2) + Math.pow(p1yDistance, 2))
    var p2xDistance = Math.abs(p2x - zomx)
    var p2yDistance = Math.abs(p2y - zomy)
    var p2Hypotenuse = Math.sqrt(Math.pow(p2xDistance, 2) + Math.pow(p2yDistance, 2))
    return (p1Hypotenuse >= p2Hypotenuse ? [(p2x - zomx) * zomspeedmod, (p2y - zomy) * zomspeedmod] : [(p1x - zomx) * zomspeedmod, (p1y - zomy) * zomspeedmod])
  }

// check if the player is caught
  function catchTheHero (player, zombie) {
    if (player.x <= (zombie.x + spriteWidth) && zombie.x <= (player.x + spriteWidth) && player.y <= (zombie.y + spriteHeight) && zombie.y <= (player.y + spriteHeight)) {
      if (player.isInvulnerable) {
        return
      } else {
        if (player.lives > 0) {
          player.lives -= 1
          if (player.lives === 0) {
            isGameOver = true
          } else {
            player.hit = true
            zombie.hit = true
            reset()
          }
        }
      }
    }
  }

// remove zombies that have been bombed
  function clearBombedZombies () {
    bombedZombiesArray = zombieArray.filter(function (zombie) {
      return zombie.bombed === false
    })
    zombieArray = bombedZombiesArray
  }

  // check if an obstacle is in the way
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
        powerUpAudio.play()
        powerUpActive = false
        powerUpCounter = 0
        player.abilityCharge += 1
        $('body').css('background-color', '#FFB30F')
        $('body').css('transition', 'background-color 0.5s ease-out')
        setTimeout(function () {
          $('body').css('background-color', 'rgba(0, 0, 0, 0.0)')
        }, 300)
      }
    }
  }

  // move players and zombies, check collisions and update the score
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

// move the zombies
  function moveZombies () {
    zombieArray.forEach(function (zombie) {
      zombie.updatePosition()
    })
  }

// check if the players are caught or using abilities
  function checkIfCaught () {
    pArray.forEach(function (player) {
      player.checkIfInvulnerable()
      player.checkIfPhasing()
      player.checkIfSpeeding()
      zombieArray.forEach(function (zombie) {
        player.checkIfBombed(zombie)
        catchTheHero(player, zombie)
      })
      player.usingBomb = false
    })
    clearBombedZombies()
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
    // $('.player-info-ba r').text(p1.abilityCharge + ' charges ' + p1.lives + ' : ' + p2.lives + ' charges ' + p2.abilityCharge)
    $('#p1-info-bar .info-player-name').text(p1AbilityArray[characterConfirm[0]].name)
    $('#p1-info-bar .info-ability-name').text(p1AbilityArray[characterConfirm[0]].ability)
    $('#p1-info-bar .info-ability-charge').text(p1.abilityCharge)
    $('#p1-info-bar .info-lives').text(p1.lives)
    $('#p2-info-bar .info-player-name').text(p2AbilityArray[characterConfirm[1]].name)
    $('#p2-info-bar .info-ability-name').text(p2AbilityArray[characterConfirm[1]].ability)
    $('#p2-info-bar .info-ability-charge').text(p2.abilityCharge)
    $('#p2-info-bar .info-lives').text(p2.lives)
  }

// spawn zombies
  function spawnZombies () {
    // spawn zombies every 3 seconds
    if (refreshCounter % 180 === 0) {
      createZombie()
      // add zombies for every 3 lives lost
      var spawnWhenHurt = Math.min(3, 13 - (p1.lives + p2.lives))
      for (i = 0; i <= spawnWhenHurt; i += 3) {
        createZombie()
      }
      // add 1 zombie for every 15 seconds that has passed
      var spawnOverTime = Math.floor(refreshCounter / 900)
      for (i = 0; i <= spawnOverTime; i += 1) {
        createZombie()
      }
    }
  }

// show the loading screen between the landing page and the game
  function loadGame () {
    zombieRoarAudio.play()
    zombieGroupAudio.currentTime = 0
    zombieGroupAudio.loop = true
    zombieGroupAudio.play()
    inPursuitAudio.currentTime = 0
    inPursuitAudio.loop = true
    inPursuitAudio.play()
    tenebrousAudio.pause()
    resizeCanvas()
    var countdown = 2
    $('#start-game').hide()
    $('#countdown').text('3')
    $('#tips').text(tipsQuips[Math.floor(Math.random() * tipsQuips.length)])
    $('#load-game').show()
    var interval = window.setInterval(function () {
      $('#countdown').text(countdown)
      countdown--
    }, 1000)
    window.setTimeout(showCanvas, 3000)
    function showCanvas () {
      window.clearInterval(interval)
      startGame()
    }
  }

  // start the game
  function startGame () {
    resizeCanvas()
    hasGameStarted = true
    $('#load-game').hide()
    $('.canvas-container').show()
    then = Date.now()
    reset()
    runMainGame()
  }

  // go to game over screen
  function gameOverScreen () {
    // context.clearRect(0, 0, width, height)
    zombieRoarAudio.play()
    zombieGroupAudio.pause()
    inPursuitAudio.pause()
    tenebrousAudio.currentTime = 0
    tenebrousAudio.play()
    $('.canvas-container').css('opacity', '0.0')
    $('.canvas-container').css('transition', 'opacity 2s')
    window.setTimeout(function () {
      $('#start-game').css('opacity', '1.0')
      $('.canvas-container').hide()
      $('.canvas-container').css('opacity', '1.0')
      $('#start-game').show()
      p1confirmed = false
      checkConfirm('p1', p1confirmed)
      p2confirmed = false
      checkConfirm('p2', p2confirmed)
      hasGameStarted = false
      // $('.player-info-bar').hide()
      // update the front page
      if (p1.lives > 0) {
        console.log(p1AbilityArray[characterConfirm[0]].name)
        $('#one').text(p1AbilityArray[characterConfirm[0]].name)
        $('.tagline').text(p2AbilityArray[characterConfirm[1]].name + deathQuips[Math.floor(Math.random() * deathQuips.length)])
      } else {
        console.log(p2AbilityArray[characterConfirm[1]].name)
        $('#one').text(p2AbilityArray[characterConfirm[1]].name)
        $('.tagline').text(p1AbilityArray[characterConfirm[0]].name + deathQuips[Math.floor(Math.random() * deathQuips.length)])
      }
    }, 2000)
  }

  // reset the game when a player is hit or when game is over
  function reset () {
    if (!isGameOver) {
      pArray.forEach(function (player) {
        if (player.hit) {
          zombieHitAudio.play()
          $('body').css('background-color', '#8a0707')
          $('body').css('transition', 'background-color 0.5s ease-out')
          setTimeout(function () {
            $('body').css('background-color', 'rgba(0, 0, 0, 0.0)')
          }, 300)
          player.hit = false
          player.isInvulnerable = true
          player.invulnerableTimer = 120
        }
      })
      zombieArray.forEach(function (zombie) {
        if (zombie.hit) {
          zombie.hit = false
          zombie.x = randomSpawn()[0]
          zombie.x = randomSpawn()[1]
        }
      })
    } else {
      // reset players
      pArray = []
      createPlayers()
      // reset zombies
      zombieArray = []
      bombedZombiesArray = []
      for (var i = 0; i < 8; i++) {
        createZombie()
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

  // draw everything
  function render () {
    refreshCounter++
    powerUpCounter++
    context.clearRect(0, 0, width, height)

    context.lineWidth = 1

    context.beginPath()
    context.rect(spriteWidth, spriteHeight, width - 2 * spriteWidth, height - 2 * spriteHeight)
    context.strokeStyle = '#8a0707'
    context.stroke()

    context.lineWidth = 3

    obstacleArray.forEach(function (obstacle) {
      context.beginPath()
      context.rect(obstacle.xLeft, obstacle.yTop, obstacle.width, obstacle.height)
      context.fillStyle = '#FFFFFF'
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
        context.strokeStyle = '#FFFFFF'
        context.stroke()
      }
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

    zombieArray.forEach(function (zombie) {
      context.drawImage(zombie.image, zombie.x, zombie.y)
    })
  }

// main game loop
  var runMainGame = function () {
    var now = Date.now()
    var delta = now - then

    movePlayers(delta / 1000)
    spawnZombies()
    moveZombies()
    checkIfCaught()
    checkIfHasPowerUp()
    updateScore()
    render()

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

  // bonus - ruin the players' lives
  window.addEventListener('click', function (e) {
    if (hasGameStarted && !isGameOver) {
      var zombie = new Zombie(e.clientX - window.innerWidth * 0.05 - spriteWidth / 2, e.clientY - window.innerHeight * 0.1 - spriteHeight * 1.5, randomSpeed())
      zombieArray.push(zombie)
    }
  })
})
