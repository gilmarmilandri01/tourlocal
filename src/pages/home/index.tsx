import { Container } from "../../components/container"
import { useState, useEffect } from "react"
import { collection, query, getDocs, orderBy } from "firebase/firestore"
import { db } from "../../services/firebaseConnection"
import { Link } from "react-router"

interface LocationsProps{
  id: string;
  nome: string;
  horario: string;
  valor: string;
  bairro: string;
  images: LocalImageProps[];
  uid: string;
}

interface LocalImageProps{
  nome: string;
  uid: string;
  url: string;
}


export function Home() {
  const [locations, setLocations] = useState<LocationsProps[]>([])
  const [loadImages, setLoadImages] = useState<string[]>([])

  useEffect(() => {
    function loadLocations(){
      const locationsRef = collection(db, "locations")
      const queryRef = query (locationsRef, orderBy("created", "desc"))
   
      getDocs(queryRef)
      .then((snapshot) => {
        let listlocations = [] as LocationsProps[];

        snapshot.forEach(doc => {
          listlocations.push({
            id: doc.id,
            bairro: doc.data().bairro,
            nome: doc.data().nome,
            horario: doc.data().horario,
            valor: doc.data().valor,
            images: doc.data().images,
            uid: doc.data().uid,
          })
        })

        setLocations(listlocations)
      })
    }

    loadLocations();
  }, [])

  function handleImageLoad(id: string){
    setLoadImages((prevImageLoaded) => [...prevImageLoaded, id])
  }

  return (
    <Container>
      <section className="bg-white p-4 rounded-lg w-full  max-w-3xl mx-auto flex justify-center items-center gap-2">
        <input 
            placeholder="Digite o nome do local..."
            className=" w-full border-2 rounded-lg h-9 border-gray-300 focus:border-blue-500 focus:ring-0 outline-none px-3"
        />
        <button
            className="bg-blue-600 h-9 px-8 rounded-lg text-white font-medium text-lg"
        >
            Buscar
        </button>
      </section>

      <h1 className="font-bold text-center mt-6 text-2xl mb-4">
        Campo Grande, de Mato Grosso do Sul para o Brasil!
      </h1>
      
      <main className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
      {locations.map( location => (
        <Link to={`/location/${location.id}`} key={location.id}>
          <section className="w-full bg-white rounded-lg">
            <div 
              className="w-full h-72 rounded-lg bg-slate-200" 
              style={{ display: loadImages.includes(location.id) ? "none" : "block"}}>
            </div>
            <img 
                className="w-full rounded-lg mb-2 max-h-72 hover:scale-105 transition-all"
                src={location.images[0].url}
                alt="Local"
                onLoad={() => handleImageLoad(location.id)}
                style={{ display: loadImages.includes(location.id) ? "block" : "none"}}
            />
            <p className="font-bold mt-1 mb-2 px-2">{location.nome}</p>
            <div className="flex flex-col px-2">
                <span className="text-zinc-700 mb-6 ">Horário: {location.horario}</span>
                <strong className="text-black font-medium text-xl">Entrada: {location.valor}</strong>
            </div>
            <div className="w-full h-px bg-slate-200 my-2"></div>
            <div className="px-2 pb-2">
                <span className="text-black">
                    {location.bairro}
                </span>
            </div>
          </section>
        </Link>
      ))}
        
      </main>
    </Container>
  )
}
