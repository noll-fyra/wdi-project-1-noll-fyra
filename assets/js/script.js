$(document).ready(function () {
  var gameName = 'NO ONE WINS'
  // get the canvas context for drawing
  var canvas = document.getElementById('canvas')
  var context = canvas.getContext('2d')
  var width = 0
  var height = 0

  var keysPressed = {}

// general game variables
  var p1Score = 3
  var p2Score = 3
  var p1Hit = false
  var p2Hit = false
  var isGameOver = false
  var refreshCounter = 0
  $('#score').text(p1Score + ' : ' + p2Score)
  $('#game-name').text(gameName)

// player variables

// monster variables
  var monsterSpeedModifier = 0.02

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

// ensure the hero and monster images are loaded before drawing
  var isP1Ready = false
  var p1Img = document.createElement('img')
  p1Img.src = 'assets/images/hero.png'
  p1Img.onload = function () {
    isP1Ready = true
  }

  var isP2Ready = false
  var p2Img = document.createElement('img')
  p2Img.src = 'assets/images/antihero.png'
  p2Img.onload = function () {
    isP2Ready = true
  }

  var isMonsterReady = false
  var monsterImg = document.createElement('img')
  monsterImg.src = 'assets/images/monster.png'
  monsterImg.onload = function () {
    isMonsterReady = true
  }

  var isMonster2Ready = false
  var monster2Img = document.createElement('img')
  monster2Img.src = 'assets/images/monster.png'
  monster2Img.onload = function () {
    isMonster2Ready = true
  }

  function createImage () {
    var monster = document.createElement('img')
    monster.src = 'assets/images/monster.png'
    if (monster) {
      return monster
    } else {
      console.log('monster not created')
    }
  }

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

// use this!!!!


// create the heroes and monster
  var p1 = {
    speed: 192,
    x: 0,
    y: 0
  }

  var p2 = {
    speed: 192,
    x: width - 32,
    y: height - 32
  }

  function chaseTheHero (herox, monsterx, heroy, monstery) {
    return [(herox - monsterx) * monsterSpeedModifier, (heroy - monstery) * monsterSpeedModifier]
  }



  var monObj = {
    image: createImage(),
    x: width / 2,
    y: height / 2,
    update: function () {
      this.x += chaseTheHero(p1.x, this.x, p1.y, this.y)[0]
      this.y += chaseTheHero(p1.x, this.x, p1.y, this.y)[1]
    }
  }

  var monster = {
    x: 0,
    y: height - 32
  }

  var monster2 = {
    x: width - 32,
    y: 0
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
        monster.y = height - 32
      } else if (p2Hit) {
        p2.x = width - 32
        p2.y = height - 32
        p2Hit = false
        monster2.x = width - 32
        monster2.y = 0
      }
    } else {
      p1Score = 3
      p2Score = 3
      p1Hit = false
      p2Hit = false
      isGameOver = false
      refreshCounter = 0
      $('#score').text(p1Score + ' : ' + p2Score)
      $('#game-name').text(gameName)

      p1.x = 0
      p1.y = 0

      p2.x = width - 32
      p2.y = height - 32

      monster.x = 0
      monster.y = height - 32
      monster2.x = width - 32
      monster2.y = 0
      monObj.x = width / 2
      monObj.y = height / 2

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
    if (83 in keysPressed && p1.y < canvas.height - 32) { // Player holding down
      p1.y += p1.speed * modifier
    }
    if (65 in keysPressed && p1.x > 0) { // Player holding left
      p1.x -= p1.speed * modifier
    }
    if (68 in keysPressed && p1.x < canvas.width - 32) { // Player holding right
      p1.x += p1.speed * modifier
    }
// player 2 arrow keys
    if (38 in keysPressed && p2.y > 0) {
      p2.y -= p2.speed * modifier
    }
    if (40 in keysPressed && p2.y < canvas.height - 32) { // Player holding down
      p2.y += p2.speed * modifier
    }
    if (37 in keysPressed && p2.x > 0) { // Player holding left
      p2.x -= p2.speed * modifier
    }
    if (39 in keysPressed && p2.x < canvas.width - 32) { // Player holding right
      p2.x += p2.speed * modifier
    }
    monObj.update()
    monster.x += chaseTheHero(p1.x, monster.x, p1.y, monster.y)[0]
    monster.y += chaseTheHero(p1.x, monster.x, p1.y, monster.y)[1]
    monster2.x += chaseTheHero(p2.x, monster2.x, p2.y, monster2.y)[0]
    monster2.y += chaseTheHero(p2.x, monster2.x, p2.y, monster2.y)[1]

// check for collision event
    if (p1.x <= (monster.x + 32) && monster.x <= (p1.x + 32) && p1.y <= (monster.y + 32) && monster.y <= (p1.y + 32)) {
      p1Score--
      p1Hit = true
      if (p1Score > 0) {
        reset()
      } else {
        isGameOver = true
      }
    }

    if (p2.x <= (monster2.x + 32) && monster2.x <= (p2.x + 32) && p2.y <= (monster2.y + 32) && monster2.y <= (p2.y + 32)) {
      p2Score--
      p2Hit = true
      if (p2Score > 0) {
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
    if (isP1Ready) {
      context.drawImage(p1Img, p1.x, p1.y)
    }
    if (isP2Ready) {
      context.drawImage(p2Img, p2.x, p2.y)
    }

    if (isMonsterReady) {
      context.drawImage(monsterImg, monster.x, monster.y)
    }

    if (isMonster2Ready) {
      context.drawImage(monsterImg, monster2.x, monster2.y)
    }

    context.drawImage(monObj.image, monObj.x, monObj.y)

    $('#score').text(p1Score + ' : ' + p2Score)
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
