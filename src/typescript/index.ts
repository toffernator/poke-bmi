interface Pokemon {
  name: string
  weight: number
  height: number
  sprites: Sprites
}

interface Sprites {
  front_default: string // The default front facing sprite of the pokemon
}

type FetchParams = Parameters<typeof fetch>;
async function typedFetch<T>(...params: FetchParams): Promise<T> {
  return fetch(...params)
    .then((resp) => resp.json() as Promise<T>);
}

const searchFieldElement = document.getElementById('pokemonNameSearch') as HTMLInputElement;
const spriteImg: HTMLImageElement = document.getElementById('sprite') as HTMLImageElement;
const pokemonNameElement: HTMLElement = document.getElementById('pokemonName') as HTMLElement;
const bmiCategoryElement: HTMLElement = document.getElementById('bmiCategory') as HTMLElement;

function bmi(height: number, weight: number): number {
  return weight / (height ^ 2);
}

function bmiLabel(index: number): string {
  if (index <= 18) {
    return "Underweight";
  } else if (index > 18 && index <= 24) {
    return "Healthy";
  } else if (index > 24 && index <= 29) {
    return "Overweight";
  } else if (index > 29 && index <= 39) {
    return 'Obese';
  } else {
    // Index is greater than 39 
    return 'Extremely obese';
  }
}

async function fetchPokemon(idOrName: number | string): Promise<Pokemon> {
  const pokemon = await typedFetch<Pokemon>(`https://pokeapi.co/api/v2/pokemon/${idOrName}/`);
  pokemon['weight'] *= 10; // Convert hectogram to kilogram
  pokemon['height'] *= 10; // Convert decimeter to meter
  return pokemon;
}

function generateRandomId(): number {
  // ID ranges are 1-905 and 10001-10249
  // https://github.com/PokeAPI/pokeapi/blob/master/data/v2/csv/pokemon.csv
  const totalIds = (905 - 1) + (10249 - 10001);

  let randomId = Math.floor(Math.random() * totalIds) + 1;
  if (randomId > 905) {
    randomId = randomId - 905 + 10000;
  }

  return randomId;
}

async function handleFormSubmit(event: Event) {
  event.preventDefault()

  const pokemon = await fetchPokemon(searchFieldElement.value.toLowerCase());
  displayPokemon(pokemon);

  // Prevent the form from POSTing
  return false
}

async function handleRandom(event: Event) {
  event.preventDefault()
  const randomId = generateRandomId();
  const pokemon = await fetchPokemon(randomId);
  displayPokemon(pokemon);
}

function displayPokemon(pokemon: Pokemon) {
  const index = bmi(pokemon['height'], pokemon['weight']);
  const bmiCategory = bmiLabel(index);

  spriteImg.src = pokemon.sprites.front_default;
  pokemonNameElement.innerHTML = pokemon.name[0].toUpperCase() + pokemon.name.slice(1);
  bmiCategoryElement.innerHTML = bmiCategory;
}
