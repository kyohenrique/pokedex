import { useState, useEffect, useRef } from "react"
import { Search, X } from "lucide-react"

interface SearchBarProps {
  onSearch: (term: string) => void;
  onClear: () => void;
}

export default function SearchBar({ onSearch, onClear }: SearchBarProps) {
  const [term, setTerm] = useState("")
  const [allPokemonNames, setAllPokemonNames] = useState<string[]>([])
  const [suggestions, setSuggestions] = useState<string[]>([])
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [hasActiveSearch, setHasActiveSearch] = useState(false)
  
  const wrapperRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    async function loadNames() {
      try {
        const res = await fetch("https://pokeapi.co/api/v2/pokemon?limit=2000")
        const data = await res.json()
        setAllPokemonNames(data.results.map((p: any) => p.name))
      } catch (error) {
        console.error("Erro ao carregar lista de nomes:", error)
      }
    }
    loadNames()

    function handleClickOutside(event: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setShowSuggestions(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  useEffect(() => {
    if (term.length >= 2) {
      const filtered = allPokemonNames
        .filter(name => name.includes(term.toLowerCase()))
        .slice(0, 8)
      setSuggestions(filtered)
      setShowSuggestions(true)
    } else {
      setSuggestions([])
      setShowSuggestions(false)
    }
  }, [term, allPokemonNames])

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (term) {
      onSearch(term)
      setHasActiveSearch(true)
      setShowSuggestions(false)
    }
  }

  function handleSuggestionClick(name: string) {
    setTerm(name)
    onSearch(name)
    setHasActiveSearch(true)
    setShowSuggestions(false)
  }

  function handleClear() {
    setTerm("")
    setSuggestions([])
    setHasActiveSearch(false)
    onClear()
  }

  return (
    <div ref={wrapperRef} className="w-full max-w-xl mb-8 relative z-20">
      <form onSubmit={handleSubmit} className="flex gap-2">
        <div className="relative flex-1">
          <input 
            type="text" 
            placeholder="Busque um Pokémon..." 
            value={term}
            onChange={(e) => setTerm(e.target.value)}
            onFocus={() => term.length >= 2 && setShowSuggestions(true)}
            className="w-full bg-zinc-800 border border-zinc-700 text-white pl-4 pr-10 py-3 rounded-lg focus:outline-none focus:border-red-500 transition-colors placeholder:text-zinc-500"
          />
          
          {(term || hasActiveSearch) && (
            <button
              type="button"
              onClick={handleClear}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-white transition-colors"
            >
              <X size={18} />
            </button>
          )}
        </div>

        <button 
          type="submit"
          className="bg-red-600 hover:bg-red-700 text-white px-4 sm:px-6 rounded-lg font-bold transition-colors flex items-center justify-center"
        >
          <Search size={20} />
        </button>
      </form>

      {showSuggestions && suggestions.length > 0 && (
        <ul className="absolute top-full left-0 right-0 mt-2 bg-zinc-800 border border-zinc-700 rounded-lg shadow-xl overflow-hidden animate-fade-in z-30">
          {suggestions.map((suggestion) => (
            <li 
              key={suggestion}
              onClick={() => handleSuggestionClick(suggestion)}
              className="px-4 py-2 hover:bg-zinc-700 cursor-pointer text-zinc-300 hover:text-white capitalize transition-colors border-b border-zinc-700/50 last:border-0 flex items-center gap-2"
            >
              <Search size={14} className="text-zinc-500" />
              {suggestion}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}