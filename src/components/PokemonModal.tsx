import { useEffect, useState } from "react"
import { typeColors } from "../utils/typeColors"

interface PokemonModalProps {
  url: string;
  onClose: () => void;
}

interface PokemonFullDetails {
  name: string;
  id: number;
  height: number;
  weight: number;
  sprites: {
    front_default: string;
    other: {
      "official-artwork": {
        front_default: string;
      }
    }
  };
  stats: Array<{
    base_stat: number;
    stat: {
      name: string;
    }
  }>;
  types: Array<{
    type: {
      name: string;
    }
  }>;
  cries: {
    latest: string;
  };
}

export default function PokemonModal({ url, onClose }: PokemonModalProps) {
  const [data, setData] = useState<PokemonFullDetails | null>(null)

  useEffect(() => {
    async function fetchDetails() {
      const res = await fetch(url)
      const json = await res.json()
      setData(json)
    }
    fetchDetails()
  }, [url])

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose()
    }
    window.addEventListener("keydown", handleEsc)
    return () => window.removeEventListener("keydown", handleEsc)
  }, [onClose])

  if (!data) return null

  const mainType = data.types[0].type.name
  const colorClass = typeColors[mainType] || "bg-zinc-600"

  const playCry = () => {
    if (data.cries.latest) {
      const audio = new Audio(data.cries.latest)
      audio.volume = 0.2
      audio.play()
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in" onClick={onClose}>
      <div 
        className="bg-zinc-900 border border-zinc-700 w-full max-w-2xl rounded-2xl overflow-hidden shadow-2xl relative animate-scale-up"
        onClick={(e) => e.stopPropagation()} 
      >
        <div className={`${colorClass} p-4 flex justify-between items-center text-white`}>
          <div className="flex items-center gap-3">
            <h2 className="text-2xl font-bold capitalize">{data.name}</h2>
            <span className="bg-black/20 px-3 py-1 rounded-full font-mono text-sm">
              #{String(data.id).padStart(3, '0')}
            </span>
          </div>
          <button onClick={onClose} className="cursor-pointer hover:bg-black/20 p-2 rounded-full transition-colors">
            ✕
          </button>
        </div>

        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-8">

          <div className="flex flex-col items-center gap-4">
            <div className="relative group cursor-pointer" onClick={playCry}>
              <img 
                src={data.sprites.other["official-artwork"].front_default || data.sprites.front_default} 
                alt={data.name} 
                className="w-48 h-48 object-contain drop-shadow-xl hover:scale-105 transition-transform"
              />
              <span className="absolute bottom-0 right-0 bg-zinc-800 text-xs px-2 py-1 rounded-full text-zinc-400 group-hover:text-white transition-colors">
                🔊 Clique para ouvir
              </span>
            </div>

            <div className="flex gap-2">
              {data.types.map((t) => (
                <span key={t.type.name} className={`${typeColors[t.type.name]} select-none px-3 py-1 rounded-full text-white text-sm font-bold capitalize shadow-md`}>
                  {t.type.name}
                </span>
              ))}
            </div>

            <div className="grid grid-cols-2 gap-4 w-full text-center mt-2">
              <div className="bg-zinc-800 p-2 rounded-lg border border-zinc-700">
                <p className="text-zinc-400 text-xs uppercase font-bold">Altura</p>
                <p className="text-white font-mono">{data.height / 10} m</p>
              </div>
              <div className="bg-zinc-800 p-2 rounded-lg border border-zinc-700">
                <p className="text-zinc-400 text-xs uppercase font-bold">Peso</p>
                <p className="text-white font-mono">{data.weight / 10} kg</p>
              </div>
            </div>
          </div>

          <div className="flex flex-col justify-center gap-3">
            <h3 className="text-xl font-bold text-white mb-2 border-b border-zinc-700 pb-2">Estatísticas</h3>
            
            {data.stats.map((stat) => (
              <div key={stat.stat.name} className="flex flex-col gap-1">
                <div className="flex justify-between text-xs font-bold text-zinc-400 uppercase">
                  <span>{stat.stat.name.replace("-", " ")}</span>
                  <span className="text-white">{stat.base_stat}</span>
                </div>
                <div className="w-full bg-zinc-800 h-2 rounded-full overflow-hidden">
                  <div 
                    className={`${colorClass} h-full rounded-full transition-all duration-1000 ease-out`} 
                    style={{ width: `${Math.min(stat.base_stat, 150) / 1.5}%` }} 
                  />
                </div>
              </div>
            ))}
          </div>

        </div>
      </div>
    </div>
  )
}