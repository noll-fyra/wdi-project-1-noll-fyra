var aliAbility = {
  name: 'Ali',
  ability: 'Invincibility',
  description: 'Invulnerable to zombies for 2 seconds',
  quip: 'Still vulnerable to heartbreak.'
}

var camAbility = {
  name: 'Cam',
  ability: 'Life Gain',
  description: 'Gain 1 life',
  quip: 'Still more lifeless than the zombies.'
}

var kaiAbility = {
  name: 'Kai',
  ability: 'Phasing',
  description: 'Pass through walls for 2 seconds',
  quip: "Can't pass last night's dinner."
}

var maxAbility = {
  name: 'Max',
  ability: 'Bombs',
  description: 'Kill all zombies within a small radius',
  quip: 'Size does matter.'
}

var royAbility = {
  name: 'Roy',
  ability: 'Speeding',
  description: 'Move faster for 2 seconds',
  quip: 'Slow and steady wins the... ahhh-!'
}

var tajAbility = {
  name: 'Taj',
  ability: 'Teleportation',
  description: 'Teleport to the other player',
  quip: 'Keep your friends close.'
}

var annAbility = {
  name: 'Ann',
  ability: 'Invincibility',
  description: 'Invulnerable to zombies for 2 seconds',
  quip: 'Also protects against skin rash.'
}

var evaAbility = {
  name: 'Eva',
  ability: 'Life Gain',
  description: 'Gain 1 life',
  quip: 'Are you expecting something here?'
}

var idaAbility = {
  name: 'Ida',
  ability: 'Phasing',
  description: 'Pass through walls for 2 seconds',
  quip: 'Walls are so passé.'
}

var joyAbility = {
  name: 'Joy',
  ability: 'Bombs',
  description: 'Kill all zombies within a small radius',
  quip: 'Watch out for flying guts.'
}

var raeAbility = {
  name: 'Rae',
  ability: 'Speeding',
  description: 'Move faster for 2 seconds',
  quip: 'And reach the end of the human race.'
}

var skyAbility = {
  name: 'Sky',
  ability: 'Teleportation',
  description: 'Teleport to the other player',
  quip: 'Keep your enemies closer.'
}

var p1AbilityArray = [aliAbility, camAbility, kaiAbility, maxAbility, royAbility, tajAbility]
var p2AbilityArray = [annAbility, evaAbility, idaAbility, joyAbility, raeAbility, skyAbility]

var tipsQuips = [
  "Zombies always chase the nearest player. Don't be the nearest player.",
  "Only players with Phasing can pass through obstacles. Don't be fazed if you can't.",
  'Zombies only spawn on the edges. Stay away from the sides.',
  "Winter is coming... unless you're in Singapore.",
  'Zombies spawn every 2.5 seconds. 2.4. 2.3. 2.2. 2.1...',
  'If you have Life Gain, tell the other player to "get a life".',
  'Zombies can sense fear. More spawn the fewer lives you have.',
  "Don't fret if you get hit. You're invulnerable. Temporarily.",
  "Zombies love brains. So you're probably safe.",
  'Players with Bombs tend to have a blast. Or a short fuse. One of them.',
  'Zombies slow down when they get closer. That\'s your cue to start Speeding away.',
  'A power up spawns every 10 seconds in the centre. Get it while it\'s hot.',
  'Zombies are pretty adventurous. They embrace everything.',
  'Teleportation is for ambitious players who are going places.',
  'Zombies love brave players with guts.',
  'Zombies can climb over walls. If you were wondering.'
]

var deathQuips = [
  ' was mauled to death by a zombie baby. How cute.',
  ' was torn apart by grief, sorrow and about 47 hungry zombies.',
  ' fell off a cliff while running from the horde. Watch your step.',
  ' died horribly to tetanus poisoning after a rusty paper clip incident.',
  ' choked to death after swallowing a passing ladybird, who was minding her own business.',
  ' died peacefully in their sleep at the ripe old age of 22. Because zombies. And not peacefully. Oh no.',
  ' drank expired Mountain Dew and paid for it. It cost $1.50. Then zombies attacked.',
  ' was trampled by a startled herd of rhinos. Rhino zombies. I know. Scary.',
  ' shot themself in the face while cleaning their BB-gun.',
  ' drowned in a 1cm deep puddle of water, setting a new world record in the process. Congratulations!',
  ' was minding their own business and was set upon by feral poodles. They did not make it.',
  ' was taken early due to atherosclerosis and myocardial infarction. Smoking kills more people than zombies.',
  ' held off an army of zombies at Thermopylae with just 300... wait, wrong story. Horrible death really.',
  ' collapsed from excessive blood loss after a shaving incident went horribly, horribly wrong.',
  ' met their fate at the hands of nature thanks to a mega-volcanic-ultra-tornado-hyper-tsunami-meterorite.'
]
var bioTemplate = ['Weapon',
  'Favourite Food',
  'Pet Peeve',
  'Hobby',
  'Good At',
  'Dreams Of',
  'Born',
  'Spirit Animal',
  'Quirk',
  'Misses'
]

var aliBio = ['Hammer',
  'Chee cheong fun',
  'Bad drivers',
  'Hunting cows',
  'Golf',
  'World peace',
  '14 Feb 1982',
  'Fox',
  'Twitching his nose',
  'His mommy'
]

var camBio = ['2B Pencil',
  'Mac & cheese',
  'Brown cats',
  'Stamp collecting',
  'Lazing around',
  'A hot meal',
  '26 Apr 1971',
  'Mongoose',
  'Rapidly blinking',
  'The internet'
]

var kaiBio = ['Glock-18',
  'Oyakodon',
  'Rude grandmothers',
  'Jam making',
  'Origami',
  'The sun rising',
  '02 Sep 1999',
  'Cheetah',
  'Coughing softly',
  'TV'
]

var maxBio = ['Chainsaw',
  'Chicken McNuggets',
  'Unenthusiastic people',
  'Playing catch',
  'Pyrotechnics',
  'A quieter world',
  '01 Oct 1998',
  'Sloth',
  'Hopping',
  'Ida'
]

var royBio = ['Bare hands',
  'Tomato soup',
  'Public flossing',
  'Solitaire',
  'Math',
  'Heaven',
  '19 May 1980',
  'Gorilla',
  'Licking his nose',
  'His old job'
]

var tajBio = ['Sniper rifle',
  'Fish and chips',
  'Poor spelling',
  'Reading the dictionary',
  'Spelling',
  'Words',
  '07 Nov 1956',
  'Dolphin',
  'Correcting other people',
  'His dog'
]

var annBio = ['Nail clipper',
  'Oats',
  'Meat eaters',
  'Environmental campaigning',
  'Annoying others',
  'Flying',
  '28 Jun 1995',
  'Raccoon',
  'Squinting',
  'Handwritten letters'
]

var evaBio = ['Katana',
  'Fried rice',
  'Jaywalkers',
  'Catching butterfiles',
  'Gymnastics',
  'A better tomorrow',
  '12 Aug 1989',
  'Moose',
  'Snapping fingers',
  'Her teddy'
]

var idaBio = ['Shotgun',
  'Baked beans',
  'Drunks',
  'Spelunking',
  'Card games',
  'Romance',
  '19 Jan 2002',
  'Condor',
  'Involuntary shivering',
  'Max'
]

var joyBio = ['Smooth stones',
  'Duck confit',
  'Boys',
  'Jogging',
  'Chemistry',
  'Living underwater',
  '23 Dec 2003',
  'Walrus',
  'Constant giggling',
  'Home'
]

var raeBio = ['Submachine gun',
  'Dim sum',
  'Brothers',
  'Eating',
  'Interior design',
  'Travelling abroad',
  '06 Jul 1991',
  'Tyrannosaurus Rex',
  'Waking up early',
  'Never misses'
]

var skyBio = ['Spear',
  'Ceviche',
  'Loud music',
  'Reading',
  'Painting',
  'A time gone by',
  '17 Mar 1993',
  'Armadillo',
  'Panic attacks',
  'Childhood'
]

var p1BioArray = [aliBio, camBio, kaiBio, maxBio, royBio, tajBio]
var p2BioArray = [annBio, evaBio, idaBio, joyBio, raeBio, skyBio]
