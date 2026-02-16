import { useEffect, useState } from "react"
import PokemonCard from "../components/PokemonCard"

export default function Home() {
  const [pokemons, setPokemons] = useState<any[]>([])

  useEffect(() => {
    async function carregarDados() {
      const resposta = await fetch("https://pokeapi.co/api/v2/pokemon?limit=20")
      const dados = await resposta.json()
      setPokemons(dados.results)
    }

    carregarDados()
  }, [])

  return (
    <div className="min-h-screen bg-zinc-900 text-white p-4">
      <div className="container mx-auto">
        <h1 className="text-3xl font-bold text-center mb-8">Pokedex 🔴</h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {pokemons.map((pokemon) => (
            <PokemonCard 
              key={pokemon.name} 
              name={pokemon.name} 
              url={pokemon.url} 
            />
          ))}
        </div>
      </div>
    </div>
  )
}