import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';


function App() {
  const [pokemonData, setPokemonData] = useState([]);
  const [userPokemon, setUserPokemon] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState('');
  const [newPokemon, setNewPokemon] = useState({ name: '', type: '', image: '' });

  useEffect(() => {
    axios.get('https://pokeapi.co/api/v2/pokemon?limit=151')
      .then((response) => {
        const fetchDetails = response.data.results.map((pokemon) => 
          axios.get(pokemon.url).then((res) => res.data)
        );
        Promise.all(fetchDetails).then((details) => setPokemonData(details));
      });
  }, []);

  const handleAddPokemon = () => {
    if (newPokemon.name && newPokemon.type && newPokemon.image) {
      setUserPokemon([...userPokemon, newPokemon]);
      setNewPokemon({ name: '', type: '', image: '' });
    }
  };

  const filteredPokemon = [...pokemonData, ...userPokemon]
    .filter((pokemon) => pokemon.name.toLowerCase().includes(searchQuery.toLowerCase()))
    .filter((pokemon) => (filterType ? pokemon.types.some(t => t.type.name === filterType) : true));

  return (
    <div className="page-container">
      <h1 className="pokedex-title">PokeDex</h1>

      <div className="flex-container">
        <input
          type="text"
          placeholder="Pesquisar Pokémon"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="p-2 border rounded w-1/3"
        />
        <select
          value={filterType}
          onChange={(e) => setFilterType(e.target.value)}
          className="p-2 border rounded w-1/3"
        >
          <option value="">Todos os Tipos</option>
          <option value="grass">Planta</option>
          <option value="fire">Fogo</option>
          <option value="water">Agua</option>
          <option value="bug">inseto</option>
          <option value="poison">Venenoso</option>
        </select>
      </div>

      <div className="column-flex container">
        <h2 className="add-pokemon-title">Adicione seu pokemon</h2>
        <input
          type="text"
          placeholder="Nome"
          value={newPokemon.name}
          onChange={(e) => setNewPokemon({ ...newPokemon, name: e.target.value })}
          className="p-2 border rounded"
        />
        <input
          type="text"
          placeholder="Tipo"
          value={newPokemon.type}
          onChange={(e) => setNewPokemon({ ...newPokemon, type: e.target.value })}
          className="p-2 border rounded"
        />
        <input
          type="text"
          placeholder="Imagem link"
          value={newPokemon.image}
          onChange={(e) => setNewPokemon({ ...newPokemon, image: e.target.value })}
          className="p-2 border rounded"
        />
        <button onClick={handleAddPokemon} className="add-pokemon-button">Adicionar Pokémon</button>
      </div>

          <div className="pokemon-grid">
            {filteredPokemon.map((pokemon, index) => (
              <div key={index} className="pokemon-card">
                <img 
                  src={pokemon.sprites?.front_default || pokemon.image} 
                  alt={pokemon.name} 
                  className="pokemon-card__image" 
                />
                <h3 className="pokemon-card__title">
                  {pokemon.name}
                </h3>
                <p className="pokemon-card__type">
                  Type: {pokemon.types ? pokemon.types.map((t) => t.type.name).join(', ') : pokemon.type}
                </p>
              </div>
            ))}
          </div>
    </div>
  );
}

export default App;
