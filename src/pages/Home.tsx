import { useEffect, useState, useCallback } from "react"
import PokemonCard from "../components/PokemonCard"

interface Pokemon {
  name: string;
  url: string;
}

interface PokeApiResponse {
  next: string | null;
  results: Pokemon[];
}

export default function Home() {
  const [pokemons, setPokemons] = useState<Pokemon[]>([])
  const [nextUrl, setNextUrl] = useState<string | null>(null) 
  const [loading, setLoading] = useState(false) 
  const fetchPokemons = useCallback(async (url: string, isLoadMore = false) => {
    setLoading(true)
    try {
      const resposta = await fetch(url)
      const dados: PokeApiResponse = await resposta.json() 

      setNextUrl(dados.next) 

      if (isLoadMore) {
        setPokemons(prev => [...prev, ...dados.results])
      } else {
        setPokemons(dados.results)
      }
    } catch (error) {
      console.error("Erro ao buscar pokemons", error)
    } finally {
      setLoading(false)
    }
  }, []) 

  useEffect(() => {
    fetchPokemons("https://pokeapi.co/api/v2/pokemon?limit=20")
  }, [fetchPokemons]) 

  function handleLoadMore() {
    if (nextUrl) {
      fetchPokemons(nextUrl, true)
    }
  }

  return (
    <div className="min-h-screen bg-zinc-900 text-white p-4 pb-12">
      <div className="container mx-auto flex flex-col items-center">
        <h1 className="text-3xl font-bold text-center mb-8">Pokedex 🔴</h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 w-full">
          {pokemons.map((pokemon) => (
            <PokemonCard 
              key={pokemon.name} 
              name={pokemon.name} 
              url={pokemon.url} 
            />
          ))}
        </div>

        {nextUrl && (
          <button 
            onClick={handleLoadMore}
            disabled={loading}
            className="mt-8 px-6 py-3 bg-red-600 hover:bg-red-700 text-white font-bold rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Carregando..." : "Carregar Mais"}
          </button>
        )}
      </div>
    </div>
  )
}