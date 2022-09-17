"use strict";
const pokemons = {};
async function typedFetch(...params) {
    return fetch(...params)
        .then((resp) => resp.json());
}
const searchFieldElement = document.getElementById('pokemonNameSearch');
const spriteImg = document.getElementById('sprite');
const pokemonNameElement = document.getElementById('pokemonName');
const bmiCategoryElement = document.getElementById('bmiCategory');
function bmi(height, weight) {
    return weight / (height ^ 2);
}
function bmiLabel(index) {
    if (index <= 18) {
        return "Underweight";
    }
    else if (index > 18 && index <= 24) {
        return "Healthy";
    }
    else if (index > 24 && index <= 29) {
        return "Overweight";
    }
    else if (index > 29 && index <= 39) {
        return 'Obese';
    }
    else {
        // Index is greater than 39 
        return 'Extremely obese';
    }
}
async function fetchPokemon(idOrName) {
    let pokemon = pokemons[idOrName];
    if (pokemon == null) {
        // Cache miss
        pokemon = await typedFetch(`https://pokeapi.co/api/v2/pokemon/${idOrName}/`);
        pokemon['weight'] *= 10; // Convert hectogram to kilogram
        pokemon['height'] *= 10; // Convert decimeter to meter
        pokemons[idOrName] = pokemon;
    }
    return pokemon;
}
function generateRandomId() {
    // ID ranges are 1-905 and 10001-10249
    // https://github.com/PokeAPI/pokeapi/blob/master/data/v2/csv/pokemon.csv
    const totalIds = (905 - 1) + (10249 - 10001);
    let randomId = Math.floor(Math.random() * totalIds) + 1;
    if (randomId > 905) {
        randomId = randomId - 905 + 10000;
    }
    return randomId;
}
async function handleFormSubmit(event) {
    event.preventDefault();
    const pokemon = await fetchPokemon(searchFieldElement.value.toLowerCase());
    displayPokemon(pokemon);
    // Prevent the form from POSTing
    return false;
}
async function handleRandom(event) {
    event.preventDefault();
    const randomId = generateRandomId();
    const pokemon = await fetchPokemon(randomId);
    displayPokemon(pokemon);
}
function displayPokemon(pokemon) {
    const index = bmi(pokemon['height'], pokemon['weight']);
    const bmiCategory = bmiLabel(index);
    spriteImg.src = pokemon.sprites.front_default;
    pokemonNameElement.innerHTML = pokemon.name[0].toUpperCase() + pokemon.name.slice(1);
    bmiCategoryElement.innerHTML = bmiCategory;
}
