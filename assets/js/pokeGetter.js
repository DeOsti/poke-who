// get a ramdom pokemon number between 1 and 1025
const selectPokemon = Math.ceil(Math.random() * 1025);

async function setPokemon(pokemonIndex) {
    // Verify if pokemon info is on local storage
    if (localStorage.getItem("1")) {
        return;
    }

    // fetch pokemon info
    const pokemon = await getPokemon("1");
    const pokedex = await getPokedex("1");

    // Get random pokedex entry
    const entries = filterDexEntries(pokedex.flavor_text_entries);
    const ramdomEntryNum = Math.ceil(Math.random() * entries.length);

    // Create object with info we want
    const whoIsThatPokemon = {
        name: pokemon.name,
        image: pokemon.sprites.other["official-artwork"].front_default,
        dexEntry: entries[ramdomEntryNum],
        type1: pokemon.types[0].type.name,
        type2: pokemon.types[1].type.name,
        eggGroup1: pokedex.egg_groups[0].name,
        eggGroup2: pokedex.egg_groups[1].name,
        ability1: pokemon.abilities[0].ability.name,
        ability2: pokemon.abilities[1].ability.name,
        height: pokemon.height,
        weight: pokemon.weight,
        generation: pokedex.generation.name,
    };

    // Save in local storage
    localStorage.setItem("1", JSON.stringify(whoIsThatPokemon));
}

setPokemon();

// FUNCTIONS

async function getPokemon(pokemonIndex) {
    const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemonIndex}`);
    const poke = await res.json();
    return poke;
}

async function getPokedex(pokemonIndex) {
    const res = await fetch(`https://pokeapi.co/api/v2/pokemon-species/${pokemonIndex}`);
    const dex = await res.json();
    return dex;
}

function filterDexEntries(dexEntries) {
    const entries = dexEntries
        .map((ele) => ele.language.name === "en" && ele.flavor_text)
        .filter((ele) => ele !== false);

    let filteredEntries = [];

    for (const element of entries) {
        filteredEntries.push(element.replace(/[\r\n\f]+/gm, " "));
    }

    filteredEntries = [...new Set(filteredEntries)];
    return filteredEntries;
}

function getTypeColorClass(type) {
    return `type-${type}`;
}

function getTypeIcon(type) {
    return `../images/${type}-icon.png`;
}
