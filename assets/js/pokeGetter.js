// get a ramdom pokemon number between 1 and 1025
const selectPokemon = Math.ceil(Math.random() * 1025);

async function beginGame() {
    await setPokemon("1");

    data = JSON.parse(localStorage.getItem("1"));
    document.querySelector(".pokedex-entry p").textContent = data.dexEntry;

    const clicableFields = document.querySelectorAll(".click");
    clicableFields.forEach((ele) => {
        ele.addEventListener("click", () => {
            const changes = document.getElementById(ele.id);

            switch (ele.id) {
                case "type1":
                case "type2":
                    changes.classList.remove("type-default");
                    changes.classList.add(`type-${data[ele.id]}`);
                    changes.querySelector("img").src = `./assets/images/${data[ele.id]}_icon.png`;
                    changes.querySelector("p").textContent = data[ele.id];
                    break;
                case "eggGroup1":
                case "eggGroup2":
                case "ability1":
                case "ability2":
                case "height":
                case "weight":
                case "generation":
                    changes.querySelector("p").textContent = data[ele.id];
                    break;
                case "image":
                    changes.querySelector("img").src = data.image;
                    changes.classList.add("poke-hidden");
                default:
                    break;
            }
        });
    });
}

beginGame();

// FUNCTIONS

async function setPokemon(pokemonIndex) {
    // Verify if pokemon info is on local storage
    if (localStorage.getItem(pokemonIndex)) {
        return;
    }

    // fetch pokemon info
    const pokemon = await getPokemon(pokemonIndex);
    const pokedex = await getPokedex(pokemonIndex);

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
        height: +pokemon.height / 10,
        weight: +pokemon.weight / 10,
        generation: pokedex.generation.name,
    };

    // Save in local storage
    localStorage.setItem(pokemonIndex, JSON.stringify(whoIsThatPokemon));
}

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
