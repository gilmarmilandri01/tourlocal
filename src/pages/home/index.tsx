import { Container } from "../../components/container"

export function Home() {
  return (
    <Container>
      <section className="bg-white p-4 rounded-lg w-full max-w-3xl mx-auto flex justify-center items-center gap-2">
        <input 
            placeholder="Digite o nome do local..."
            className=" w-full border-2 rounded-lg h-9 px-3 outline-none"
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
        <section className="w-full bg-white rounded-lg">
            <img 
                className="w-full rounded-lg mb-2 max-h-72 hover:scale-105 transition-all"
                src="https://cdn6.campograndenews.com.br/uploads/noticias/2022/03/21/66fbc44f674c3e76b45b72c1923b24a05d51b76f.jpg"
                alt="Parque das Nações Indigenas em Campo Grande - MS."
            />
            <p className="font-bold mt-1 mb-2 px-2">Parque das Nações Indigenas</p>
            <div className="flex flex-col px-2">
                <span className="text-zinc-700 mb-6 ">Horário: 08:00 as 23:00</span>
                <strong className="text-black font-medium text-xl">Entrada Gratuita!</strong>
            </div>
            <div className="w-full h-px bg-slate-200 my-2"></div>
            <div className="px-2 pb-2">
                <span className="text-black">
                    Parque dos Poderes
                </span>
            </div>
        </section>
        
      </main>
    </Container>
  )
}
