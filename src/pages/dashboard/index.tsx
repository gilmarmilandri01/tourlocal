import { Container } from "../../components/container"
import { DashboardHeader } from "../../components/panelheader"
import { FiTrash2 } from "react-icons/fi"
import { useState, useEffect, useContext } from "react"
import { collection, getDocs, where, query, doc, deleteDoc } from "firebase/firestore"
import { db } from "../../services/firebaseConnection"
import { AuthContext } from "../../contexts/AuthContext"

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


export function Dashboard() {
  const [locations, setLocations] = useState<LocationsProps[]>([]);
  const { user } = useContext(AuthContext);

  useEffect(() => {
    function loadLocations(){
      if(!user?.uid){
        return;
      }

      const locationsRef = collection(db, "locations")
      const queryRef = query (locationsRef, where("uid", "==", user.uid))
   
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
  }, [user])

  async function handleDeleteLocation(id: string){
    const docRef = doc(db, "locations", id)
    await deleteDoc(docRef);
    setLocations(locations.filter(location => location.id !== id))
  }

  return (
    <Container>
      <DashboardHeader />

      <main className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {locations.map(location => (
          <section key={location.id} className="w-full bg-white rounded-lg relative">
            <button 
              onClick={() => handleDeleteLocation(location.id)}
              className="absolute bg-white w-14 h-14 rounded-full flex items-center justify-center right-2 top-2 drop-shadow">
              <FiTrash2 size={26} color="#000" />
            </button>
            <img
              className="w-full rounded-lg mb-2 max-h-70"
              src={location.images[0].url}
            />
            <p className="font-bold mt-1 px-2 mb-2">{location.nome}</p>
            <div className="flex flex-col px-2">
              <span className="text-zinc-700">
                Horário: {location.horario}
              </span>
              <strong className="text-black font-bold mt-4">
                Entrada: {location.valor}
              </strong>
            </div>
            <div className="w-full h-px bg-slate-200 my-8">
              <div className="px-2 pb-2">
                <span className="text-black">
                  {location.bairro}
                </span>
              </div>
            </div>
          </section>
        ))}
      </main>
    </Container>
  )
}
