import { useEffect, useState } from "react"

export default function App() {
  const [pokemon, setPokemon] = useState<any>(null)

  useEffect(() => {
    async function carregarDados() {
      const resposta = await fetch("https://pokeapi.co/api/v2/pokemon/ditto")
      const dados = await resposta.json()
      
      setPokemon(dados)
    }

    carregarDados()
  }, [])

  return (
    <div className="flex flex-col h-screen items-center justify-center bg-zinc-900 text-white">
      {pokemon && (
        <>
          <h1 className="text-4xl font-bold capitalize">
            {pokemon.name}
          </h1>
          <img 
            src={pokemon.sprites.front_default} 
            alt={pokemon.name} 
            className="w-32 h-32"
          />
        </>
      )}
    </div>
  )
}