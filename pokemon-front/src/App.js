import React, { useState, useEffect } from 'react';
import axios from 'axios';

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
    <div className="p-4 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold text-center mb-6">Pokémon Manager</h1>

      <div className="flex justify-center gap-4 mb-6">
        <input
          type="text"
          placeholder="Search Pokémon"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="p-2 border rounded w-1/3"
        />
        <select
          value={filterType}
          onChange={(e) => setFilterType(e.target.value)}
          className="p-2 border rounded w-1/3"
        >
          <option value="">All Types</option>
          <option value="grass">Grass</option>
          <option value="fire">Fire</option>
          <option value="water">Water</option>
          {/* Add other types as needed */}
        </select>
      </div>

      <div className="flex flex-col items-center gap-4 mb-6">
        <h2 className="text-xl font-semibold">Add Your Pokémon</h2>
        <input
          type="text"
          placeholder="Name"
          value={newPokemon.name}
          onChange={(e) => setNewPokemon({ ...newPokemon, name: e.target.value })}
          className="p-2 border rounded"
        />
        <input
          type="text"
          placeholder="Type"
          value={newPokemon.type}
          onChange={(e) => setNewPokemon({ ...newPokemon, type: e.target.value })}
          className="p-2 border rounded"
        />
        <input
          type="text"
          placeholder="Image URL"
          value={newPokemon.image}
          onChange={(e) => setNewPokemon({ ...newPokemon, image: e.target.value })}
          className="p-2 border rounded"
        />
        <button onClick={handleAddPokemon} className="p-2 bg-blue-500 text-white rounded mt-2">Add Pokémon</button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {filteredPokemon.map((pokemon, index) => (
          <div key={index} className="bg-white p-4 rounded-lg shadow-md hover:shadow-xl transition-shadow">
            <img src={pokemon.sprites?.front_default || pokemon.image} alt={pokemon.name} className="w-full h-32 object-cover mb-4 rounded" />
            <h3 className="text-xl font-semibold text-center">{pokemon.name}</h3>
            <p className="text-center text-gray-500">Type: {pokemon.types ? pokemon.types.map((t) => t.type.name).join(', ') : pokemon.type}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
