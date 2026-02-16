import { useEffect, useState } from "react"
import { typeColors } from "../utils/typeColors"

interface PokemonCardProps {
  name: string;
  url: string;
  onClick: () => void;
}

interface PokemonType {
  type: {
    name: string;
  }
}

interface PokemonDetails {
  types: PokemonType[];
  sprites: {
      front_default: string;
  }
}

export default function PokemonCard({ name, url, onClick }: PokemonCardProps) {
  const [detalhes, setDetalhes] = useState<PokemonDetails | null>(null)

  const partes = url.split('/')
  const id = partes[partes.length - 2]
  const image = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png`

  useEffect(() => {
    async function carregarDetalhes() {
      try {
        const resposta = await fetch(url)
        const dados = await resposta.json()
        setDetalhes(dados)
      } catch (err) {
        console.error("Erro card:", err)
      }
    }
    carregarDetalhes()
  }, [url])

  return (
    <div onClick={onClick} className="cursor-pointer select-none relative text-center p-3 border border-zinc-700 rounded-xl bg-zinc-800 hover:bg-zinc-700 transition-colors shadow-lg flex flex-col items-center group">
      
      <span className="absolute top-2 right-3 text-zinc-500 text-xs font-bold">
        #{id}
      </span>

      <img 
        src={image} 
        alt={name} 
        className="w-24 h-24 group-hover:scale-110 transition-transform" 
        loading="lazy" 
      />
      
      <h2 className="text-lg font-bold capitalize text-white mb-1">
        {name}
      </h2>

      <div className="flex gap-2 mt-1 justify-center">
        {detalhes && detalhes.types.map((item) => {
          const cor = typeColors[item.type.name] || "bg-zinc-600"
          
          return (
            <span 
              key={item.type.name}
              className={`${cor} text-white text-[10px] px-2 py-1 rounded-full capitalize font-semibold tracking-wide shadow-sm`}
            >
              {item.type.name}
            </span>
          )
        })}
      </div>
    </div>
  )
}