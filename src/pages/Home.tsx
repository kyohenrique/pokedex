import { useEffect, useState, useCallback } from "react"
import PokemonCard from "../components/PokemonCard"
import PokemonModal from "../components/PokemonModal"
import SearchBar from "../components/SearchBar"
import pikachu from "../assets/pikachu-icon.svg"

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
  const [error, setError] = useState(false) 
  const [selectedPokemonUrl, setSelectedPokemonUrl] = useState<string | null>(null)

  const INITIAL_URL = "https://pokeapi.co/api/v2/pokemon?limit=20"

  const fetchPokemons = useCallback(async (url: string, isLoadMore = false) => {
    setLoading(true)
    setError(false)
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
      console.error("Erro ao buscar pokémons:", error)
      setError(true)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchPokemons(INITIAL_URL)
  }, [fetchPokemons])

  function handleClearSearch() {
    setNextUrl(null)
    setError(false)
    setPokemons([])
    fetchPokemons(INITIAL_URL)
  }

  async function handleSearch(term: string) {
    if (!term.trim()) {
      handleClearSearch()
      return
    }

    setLoading(true)
    setError(false)
    setNextUrl(null)
    
    try {
      const termoFormatado = term.toLowerCase().trim()
      const resposta = await fetch(`https://pokeapi.co/api/v2/pokemon/${termoFormatado}`)
      
      if (!resposta.ok) {
        throw new Error("Pokémon não encontrado")
      }

      const dados = await resposta.json()
      
      const pokemonEncontrado = {
        name: dados.name,
        url: `https://pokeapi.co/api/v2/pokemon/${dados.id}/`
      }

      setPokemons([pokemonEncontrado])
    } catch (err) {
      setError(true)
      setPokemons([])
    } finally {
      setLoading(false)
    }
  }

  function handleLoadMore() {
    if (nextUrl) fetchPokemons(nextUrl, true)
  }

  return (
    <div className="min-h-screen bg-zinc-900 text-white p-4 pb-12">
      <div className="container mx-auto flex flex-col items-center">
        <h1 className="text-3xl font-bold text-center mb-8 flex items-center justify-center gap-2">
          Pokédex 
          <img src={pikachu} alt="Pokébola" className="w-8 h-8" />
        </h1>

        <SearchBar 
          onSearch={handleSearch} 
          onClear={handleClearSearch} 
        />

        {loading && (
          <p className="text-zinc-400 animate-pulse mt-4 mb-4">
            Carregando dados...
          </p>
        )}
        
        {error && (
          <div className="text-center mt-8 p-4 bg-red-900/20 border border-red-900 rounded-lg animate-fade-in">
            <p className="text-red-400 font-bold text-lg">Nenhum Pokémon encontrado 😢</p>
            <p className="text-zinc-400 text-sm mt-1">
              Verifique se digitou o nome corretamente.
            </p>
            <button 
              onClick={handleClearSearch} 
              className="mt-4 text-white underline hover:text-red-400 transition-colors"
            >
              Voltar para a lista completa
            </button>
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 w-full">
          {pokemons.map((pokemon) => (
            <PokemonCard 
              key={pokemon.name} 
              name={pokemon.name} 
              url={pokemon.url}
              onClick={() => setSelectedPokemonUrl(pokemon.url)}
            />
          ))}
        </div>

        {!loading && !error && nextUrl && (
          <button 
            onClick={handleLoadMore}
            disabled={loading}
            className="mt-8 px-6 py-3 bg-red-600 hover:bg-red-700 text-white font-bold rounded-lg transition-colors shadow-lg hover:shadow-red-900/20"
          >
            Carregar Mais
          </button>
        )}
      </div>

      {selectedPokemonUrl && (
        <PokemonModal 
          url={selectedPokemonUrl} 
          onClose={() => setSelectedPokemonUrl(null)} 
        />
      )}
    </div>
  )
}