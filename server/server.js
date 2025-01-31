const express = require('express');
const cors = require('cors');
const app = express();
const port = 5000;

app.use(cors());
app.use(express.json());

// Dados dos Pokémon (em memória)
let pokemons = [];

// Rota para obter todos os Pokémon
app.get('/pokemons', (req, res) => {
  // Organiza os Pokémon por nome --> ordem alfabetica
  const sortedPokemons = pokemons.sort((a, b) => a.name.localeCompare(b.name));
  res.json(sortedPokemons);
});

// Rota para adicionar um Pokémon
app.post('/pokemons', (req, res) => {
  const { name, type, imageUrl } = req.body;
  if (name && type && imageUrl) {
    const newPokemon = { name, type, imageUrl };
    pokemons.push(newPokemon);
    res.status(201).json(newPokemon);
  } else {
    res.status(400).send('Nome, tipo e imagem são necessários');
  }
});

app.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}`);
});
