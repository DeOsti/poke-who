// get a ramdom pokemon number between 1 and 1025
let selectPokemon = `${Math.ceil(Math.random() * 1025)}`;

beginGame(selectPokemon);

// FUNCTIONS

async function beginGame(pokemonIndex) {
    await setPokemon(pokemonIndex);

    data = JSON.parse(localStorage.getItem(pokemonIndex));
    document.querySelector(".pokedex-entry p").textContent = data.dexEntry;

    document.addEventListener("keydown", (pressed) => {
        pressed.key === "Enter" && isNameCorrect(data.name);
    });

    const clicableFields = document.querySelectorAll(".click");
    clicableFields.forEach((ele) => {
        ele.addEventListener("click", () => {
            const changes = document.getElementById(ele.id);

            switch (ele.id) {
                case "type1":
                case "type2":
                    changes.classList.remove("type-default");
                    changes.classList.remove("hover-fx");
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
                    changes.classList.remove("hover-fx");
                    break;
                case "image":
                    changes.querySelector("img").src = data.image;
                    changes.classList.add("poke-hidden");
                    changes.classList.remove("hover-fx");
                    break;
                case "reveal":
                    revealAllPokemon(data.name);
                    break;
                case "change":
                    let changePokemon = resetGame();
                    beginGame(changePokemon);
                default:
                    break;
            }
        });
    });
}

async function setPokemon(pokemonIndex) {
    // Verify if pokemon info is on local storage
    if (localStorage.getItem(pokemonIndex)) {
        return;
    }

    // fetch pokemon info
    const pokemon = await getPokemon(pokemonIndex).catch((er) => er.message);
    const pokedex = await getPokedex(pokemonIndex).catch((er) => er.message);

    // Get random pokedex entry
    const entries = filterDexEntries(pokedex.flavor_text_entries);
    const ramdomEntryNum = Math.floor(Math.random() * entries.length);

    // Create object with info we want
    const whoIsThatPokemon = {
        name: pokemon.name,
        image: pokemon.sprites.other["official-artwork"].front_default,
        dexEntry: entries[ramdomEntryNum],
        type1: pokemon.types[0].type.name,
        type2: pokemon.types[1]?.type.name ?? "-",
        eggGroup1: pokedex.egg_groups[0].name,
        eggGroup2: pokedex.egg_groups[1]?.name ?? "-",
        ability1: pokemon.abilities[0].ability.name,
        ability2: pokemon.abilities[1]?.ability.name ?? "-",
        height: +pokemon.height / 10,
        weight: +pokemon.weight / 10,
        generation: pokedex.generation.name,
    };

    // Save in local storage
    localStorage.setItem(pokemonIndex, JSON.stringify(whoIsThatPokemon));
}

async function getPokemon(pokemonIndex) {
    const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemonIndex}`);
    if (!res.ok) {
        const message = `An error has ocurred: ${res.status}`;
        throw new Error(message);
    }
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

function resetGame() {
    const pokemonName = document.querySelector(".answer > input");
    pokemonName.value = "";
    pokemonName.classList.remove("success");
    pokemonName.disabled = false;

    const changes = document.querySelectorAll(".click");
    changes.forEach((ele) => {
        switch (ele.id) {
            case "type1":
            case "type2":
                ele.classList.add("type-default");
                ele.classList.add("hover-fx");
                ele.classList.remove(`type-${data[ele.id]}`);
                ele.querySelector("img").src = `./assets/images/default-icon.png`;
                ele.querySelector("p").textContent = "-";
                break;
            case "eggGroup1":
            case "eggGroup2":
            case "ability1":
            case "ability2":
            case "height":
            case "weight":
            case "generation":
                ele.querySelector("p").textContent = "-";
                ele.classList.add("hover-fx");
                break;
            case "image":
                ele.querySelector("img").src = `./assets/images/default-pokemon.png`;
                ele.classList.remove("poke-hidden");
                ele.classList.add("hover-fx");
            default:
                break;
        }
    });

    return `${Math.ceil(Math.random() * 1025)}`;
}

function revealAllPokemon(name) {
    const pokemonName = document.querySelector(".answer > input");
    pokemonName.value = name;
    pokemonName.classList.add("success");
    pokemonName.disabled = true;
    const changes = document.querySelectorAll(".click");
    changes.forEach((ele) => {
        switch (ele.id) {
            case "type1":
            case "type2":
                ele.classList.remove("type-default");
                ele.classList.remove("hover-fx");
                ele.classList.add(`type-${data[ele.id]}`);
                ele.querySelector("img").src = `./assets/images/${data[ele.id]}_icon.png`;
                ele.querySelector("p").textContent = data[ele.id];
                break;
            case "eggGroup1":
            case "eggGroup2":
            case "ability1":
            case "ability2":
            case "height":
            case "weight":
            case "generation":
                ele.querySelector("p").textContent = data[ele.id];
                ele.classList.remove("hover-fx");
                break;
            case "image":
                ele.querySelector("img").src = data.image;
                ele.classList.remove("poke-hidden");
                ele.classList.remove("hover-fx");
            default:
                break;
        }
    });
}

function isNameCorrect(name) {
    const pokemonName = document.querySelector(".answer > input");
    if (name === pokemonName.value) {
        revealAllPokemon(name);
        return;
    }

    pokemonName.classList.add("failure");
    setTimeout(() => pokemonName.classList.remove("failure"), 300);
}
