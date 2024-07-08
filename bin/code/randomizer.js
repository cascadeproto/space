// Start by setting where the results will appear and making a quick randomizer function:

const resultTarget = document.getElementById("results");

const pickOne = function(arr){
    return arr[Math.floor(Math.random()*arr.length)];
}

// A roll chart is a function, containing two parts:
//      1. [Array(s)]
//      2. [Template literal] injected into result <div>
//      Array items will be randomly chosen using the helper function above. Extra complexity may be sprinkled on as desired.

const wtfdigte = function(){
    const r1 = ["Wendy's", "Black Bear Diner", "Costa Vida", "McDonald's", "Arby's", "Rich's Bagels", "Subway", "Beto's", "Sake Restaurant", "In-n-Out", "Wingstop", "Cupbop", "Five Guys", "Chick-Fil-A", "Original Pancake House", "Denny's", "Noodles and Co", "Chipotle", "Cafe Zupas", "Texas Roadhouse", "Sakura Hibachi", "Freddy's", "Jim's Family Restaurant", "Panda Express", "Iceburg", "Cafe Rio", "Raising Cane's", "Popeye's", "Papa John's", "Taco Bell", "The Pie Pizzeria", "Koino Poke", "Chili's", "Applebee's", "Firehouse Subs", "Jersey Mike's", "MOD Pizza", "Olympus Burgers", "KFC", "Rancherito's Mexican Food", "O-Ku Sushi & Poke", "The Philadelphian", "Dairy Queen", "R&R Barbeque", "Culver's", "Mo' Bettah's"];

    resultTarget.innerHTML = `<p>You should go here to eat: <strong>${pickOne(r1)}!</strong></p>`
};

const tfprompt = function(){
    // rolltables
    const type = ['drawing', '2-image sequence', '3-image sequence', 'comic'];
    const drawing = [`a ${pickOne(type)} of someone turning into a`, 'a post-TF drawing of a'];
    const dog = ['terrier', 'border collie', 'corgi', 'dalmation', 'doberman', 'german shepherd', 'great dane', 'husky', 'labrador', 'malamute', 'poodle', 'rottweiler', 'shiba inu'];
    const digimon = ['renamon', 'gabumon'];
    const pokemon = ['eevee', 'eeveelution', 'braixen', 'blaziken', 'decidueye', 'charmeleon', 'charizard', 'luxray', 'pikachu', 'lucario'];
    const species = ['fox', 'wolf', pickOne(dog), 'deer', 'kangaroo', 'bear', 'protogen', 'kobold', 'dragon', 'kitsune', 'argonian', 'renamon', pickOne(digimon), 'khajiit', 'lombax', 'koopa', 'mimiga', 'pony', pickOne(pokemon), 'snake', 'arctic fox', 'armadillo', 'axolotl', 'badger', 'bat', 'blue jay', 'capybara', 'chameleon', 'cheetah', 'chicken', 'chipmunk', 'civet', 'corvid', 'cockatiel', 'cougar', 'cow', 'coyote', 'reindeer', 'dinosaur', 'dolphin', 'donkey', 'duck', 'eagle', 'elephant', 'fennec', 'flamingo', 'ferret', 'frog', 'gazelle', 'gecko', 'griaffe', 'goat', 'hamster', 'hedgehog', 'hippo', 'bee', 'horse', 'cat', 'hyena', 'iguana', 'jackal', 'kangaroo mouse', 'koala', 'lemur', 'leopard', 'lion', 'lizard', 'llama', 'lynx', 'magpie', 'maned wolf', 'marmoset', 'marten', 'meerkat', 'mink', 'mole', 'moose', 'monkey', 'mouse', 'musk ox', 'newt', 'ocelot', 'octopus', 'okapi', 'opossum', 'orca', 'ostrich', 'otter', 'owl', 'panda', 'pangolin', 'panther', 'parakeet', 'parrot', 'peacock', 'penguin', 'pig', 'pigeon', 'porcupine', 'rabbit', 'raccoon', 'rat', 'red panda', 'robin', 'salamander', 'seagull', 'seal', 'secretary bird', 'eastern dragon', 'shark', 'sergal', 'synth', 'sheep', 'shrew', 'skunk', 'sloth', 'snow leopard', 'sparrow', 'squirrel', 'stoat', 'swan', 'tanuki', 'turtle', 'wallaby', 'weasel', 'wolverine', 'zebra'];
    const number = ['1', '1', '1', '2'];
    const startGender = ['male', 'female', 'non-binary'];
    const endGender = ['female', 'non-binary'];
    const situation = ['kidnapped', 'in a shady alley', 'with their partner', 'in a museum', 'stealing something', 'exploring nature', 'upsetting someone', 'having a breakdown', 'eating something', 'relaxing'];
    const trigger = ['a witch', 'magic', 'a zappy ray', 'hypnosis', 'a potion', 'an artifact', 'sheer will', 'a trigger word', 'filling out a form', 'watching a video', 'something they ate', 'a pokeball', 'a tarot card'];
    const reaction = ["They're quite embarassed.", "They didn't even notice.", "They're pretty happy about it!", "They gots the horny now.", "They're just plain annoyed.", "They're confused about what just happened."];

    // Template: 
    resultTarget.innerHTML = `<p>You should draw ${pickOne(drawing)} ${pickOne(species)}!</p><p>The ${pickOne(number)} subject(s) was ${pickOne(startGender)} to begin with, but now they're ${pickOne(endGender)}. They were ${pickOne(situation)}, and got transformed by ${pickOne(trigger)}. ${pickOne(reaction)}</p>`;
}

document.getElementById("wtfdigte").addEventListener('click', wtfdigte);
document.getElementById("tfprompt").addEventListener('click', tfprompt);