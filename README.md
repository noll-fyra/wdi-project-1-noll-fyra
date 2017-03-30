# _Population: One_
<http://github.io/wdi-project-1-noll-fyra/>

## Description
> A zombie apocalypse has left the human race with only two survivors. Be the last.

**_Population: One_** is a top-down zombie survival game for two players using the keyboard. The objective is to be the last player standing after a relentless zombie horde attacks. Players have to dodge increasing numbers of zombies as well as fixed obstacles, aided only by a special ability that their chosen character can use. Both players start with 5 lives and 3 ability charges, but if you survive long enough, maybe you can get a power up that will restore a charge, and help you outlast the other player.

## Controls
||Player 1 |Player 2
|:---:|:---:|:---:
|**up**|W|⇧
|**down**|S|⇩
|**left**|A|⇦
|**right**|D|⇨
|**ability**|spacebar|enter

---
## Inspiration
### _Tilt to Live_ by _One Man Left Studios_
![Tilt to Live](http://a2.mzstatic.com/us/r30/Purple/v4/f2/3d/a3/f23da3ed-603d-78e1-ff3e-755409bce909/screen568x568.jpeg)

Tilt to Live is a game that released in 2010 for iOS. Players use their device's accelerometer and gyroscope to control an arrow which has to avoid being touched by continually spawning deadly red dots. The aim is to destroy as many dots as you can and stay alive for as long as possible, with the aid of different power ups.

---
## My Implementation
### Objective
I retained the _stay alive at all costs_ aim but added the interactivity of a second human player, thereby changing the objective to _don't die before the other guy_, which contributes a certain level of tension to the game.

### Movement
I translated device tilt and orientation into simple 2-dimensional movement along the plane of the screen and made the keyboard the sole input device. This was achieved through the use of the HTML `<canvas>` element. By calculating, and manipulating, x and y distance from the `<canvas>` origin using Cartesian coordinates, I was able to move player and zombie sprites anywhere along the 2 axes.

### Collision Detection - Zombies
Collision detection was achieved by drawing an imaginary circle around both players and zombies, and checking if the distance between their centers was lesser than the sum of their radii. This is not exact because the sprites are 32x32 pixel squares, but at this small scale it is sufficiently accurate.

### Collision Detection - Obstacles
Collision detection with the boundaries of the `<canvas>` element was simple enough, but collision detection with the randomly generated walls proved insurmountable - players kept sticking to walls despite everything I did. So I cheated and redrew the player sprites outside every time they crossed the coordinates of the obstacles. This worked very well here because my obstacles are regular rectangular objects, but would not be effective at all for different shapes.

### Obstacles
Obstacles were given predetermined zones within the `<canvas>` they could appear in with random widths and height. This helps make every game feel slightly different.

### AI and Randomness
Zombies spawn randomly along the edges of the `<canvas>`, forcing players to stay in the middle as much as possible, thereby resulting in frequent moments of conflict and tension. They also chase the closest player, which was achieved by comparing the straight line distance (by Pythagorean theorem) to each player and choosing the shorter path. Zombies are also created with a random speed because I found that zombies bunched up into one sprite sooner or later if they moved at the same speed. The game can get too easy if you are experienced, which is why I increased the number of zombies spawning when players lose a certain amount of life and made it so more zombies spawn as time passes so the game will come to an inevitable end.

### Character Abilities
I designed the abilities to each break a rule of the game.

- **Invincibility** ignores player-zombie collision.
- **Life Gain** += 1 to a resource that is otherwise finite.
- **Phasing** ignores player-obstacle collision.
- **Bombs** are the only way to remove zombies from the game, and re-implements player-zombie collision.
- **Speeding** changes how much distance a keypress adds to a player's position.
- **Teleportation** simply changes one player's x-y coordinates to the other player's.

![Population: One Game Screen](http://i.imgur.com/xtVG7dy.png)

### Bringing the Game to Life
Making a game enjoyable extends to the experience of playing it. Everything that detracts has to go.

For example, I initially had a clickable start button at the beginning, and a game over page where you could either restart immediately or go back to the first page and choose another character. I realised that the game, which was played entirely by keyboard, did not need mouse input at all, and so enabled menu progression through buttons.

In addition, I simply did away with the game over screen, sending players back to the start, where they could change characters and restart the game immediately. This gave me an opportunity to effect a change to the title from **_Population: One_** to **_Population: (Winner)_**, combining the starting page with a page that announced the final survivor and that kept with the premise. Notice also how all characters have three-letter names.

Making a game fun also extends to creating moments that can delight players.

Players are greeted by a pulsing `<div>` that informs them how to continue. Surrounding the `<div>` are the keys they need to press to control their character. Without explicitly spelling out how to play the game, I hint at the controls. I feel that this is a more elegant presentation, and even if a player doesn't get it the first time, the game is quick enough that they can simply try again.

This idea of surprising discoveries extends to changing their character (and hence their abilities). If a player presses one of the movement buttons on the start screen, they get a new ability and/or fun fact about their character, encouraging them to explore further. The game rules are not spelled out, but the cost of failure is minimal, and the player can simply play again soon after.

Making a game entertaining can be achieved through careful use of micro-interactions and heart.

- A loading page tells them when the game is going to start rather than throwing the players straight into the fray.
- A small "bubble" appears around a player whenever they are hit to indicate temporary invulnerability.
- A humourous death message replaces the tagline when the players return to the starting page.
- The player choice box changes color and the pulsing `<div>` becomes a firm "Ready!" when the key is pressed.
- A funny but helpful tip is displayed while loading.
- Getting hit or getting a power up causes the screen to flash for a split second and a sound cue to play.
- Each character has a different bio to make them more interesting.

At the end of the day, the game is about more than just its mechanics.

![Population: One Menu Screen](http://i.imgur.com/79eNOe5.png)

---
## Getting Started
Just clone or download this repository to get started right away.

## Built With
- JavaScript
- jQuery
- HTML5
- CSS
- Google Fonts

All references can be found in _index.html_.

## Contributing
This is not a live project, but feel free to use the code however you like.

## Author
- Jonathan Louis Ng

## Acknowledgements
### Coding assistance:
- Prima Aulia
- Yi Sheng Lee
- Darrell Teo

### Image credits:
- Hero sprite - Uncredited / OpenGameArt.org
- Heroine sprite - Uncredited / OpenGameArt.org - _self-modified from the Hero sprite_
- Zombie sprite - Uncredited / OpenGameArt.org
- Background image - Benjamin Sloth Lindgreen / Unsplash.com - _original image altered_

### Music/Sound credits:
- Zombie Hit effect - ArriGD / FreeSound.com
- Zombie Roar effect - EagleClaw / FreeSound.com
- Power Up effect - GameAudio / FreeSound.com
- Zombie Moan music - Cyberkineticfilms / FreeSound.com
- Menu music - Uncredited / PurplePlanet.com
- Game music - Uncredited / PurplePlanet.com
