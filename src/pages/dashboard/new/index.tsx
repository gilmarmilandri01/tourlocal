import { type ChangeEvent, useState, useContext } from "react";
import { Container } from "../../../components/container";
import { DashboardHeader } from "../../../components/panelheader";

import { FiUpload, FiTrash } from 'react-icons/fi'
import { useForm } from 'react-hook-form'
import { Input } from '../../../components/input'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { AuthContext } from '../../../contexts/AuthContext'
import { v4 as uuidV4 } from 'uuid'

import { storage, db } from '../../../services/firebaseConnection'
import {
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject
} from 'firebase/storage'
import { addDoc, collection } from "firebase/firestore";

const schema = z.object({
  nome: z.string().nonempty("O campo nome é obrigatório"),
  horario: z.string().nonempty("O campo horário é obrigatório"),
  valor: z.string().nonempty("O campo valor é obrigatório"),
  endereco: z.string().nonempty("O campo valor é obrigatório"),
  bairro: z.string().nonempty("O campo bairro é obrigatório"),
  contato: z.string(),
  descricao: z.string().nonempty("A descrição é obrigatória"),
})

type FormData = z.infer<typeof schema>;

interface ImageItemProps{
  uid: string;
  name: string;
  previewUrl: string;
  url: string;
}

export function New() {
  const { user } = useContext(AuthContext);
  const { register, handleSubmit, formState: { errors }, reset } = useForm<FormData>({
    resolver: zodResolver(schema),
    mode: "onChange"
  })

  const [localImages, setLocalImages] = useState<ImageItemProps[]>([])

  async function handleFile(e: ChangeEvent<HTMLInputElement>){
    if(e.target.files && e.target.files[0]){
      const image = e.target.files[0]

      if(image.type === 'image/jpeg' || image.type === 'image/png'){
        await handleUpload(image)
      }else{
        alert("Envie uma imagem jpeg ou png!")
        return;
      }

    }
  }
  
  
  async function handleUpload(image: File){
    if(!user?.uid){
      return;
    }

    const currentUid = user?.uid;
    const uidImage = uuidV4();

    const uploadRef = ref(storage, `images/${currentUid}/${uidImage}`)

    uploadBytes(uploadRef, image)
    .then((snapshot) => {
        getDownloadURL(snapshot.ref).then((downloadUrl) => {
          const imageItem = {
            name: uidImage,
            uid: currentUid,
            previewUrl: URL.createObjectURL(image),
            url: downloadUrl,
          }

          setLocalImages((images) => [...images, imageItem] )


        })
    })

  }

  function onSubmit(data: FormData){
    if(localImages.length === 0){
      alert("Envie alguma imagem do local")
      return;
    }

    const localListImages = localImages.map( local => {
      return{
        uid: local.uid,
        nome: local.name,
        url: local.url
      }
    })

    addDoc(collection(db, "locations"),{
      nome: data.nome,
      contato: data.contato,
      horario: data.horario,
      valor: data.valor,
      bairro: data.bairro,
      endereco: data.endereco,
      descricao: data.descricao,
      created: new Date(),
      owner: user?.name,
      uid: user?.uid,
      images: localListImages,
    })
    .then(() => {
      reset();
      setLocalImages([]);
      console.log("Cadastrado com sucesso")
    })
    .catch((error) => {
      console.log(error)
    })
  }

  async function handleDeleteImage(item: ImageItemProps){
    const imagePath = `images/${item.uid}/${item.name}`;

    const imageRef = ref(storage, imagePath);

    try{
      await deleteObject(imageRef)
      setLocalImages(localImages.filter((local) => local.url !== item.url))
    }catch(err){
      console.log("ERRO AO DELETAR")
    }
  }


  return (
    <Container>
      <DashboardHeader />
      <div className="w-full bg-white p-3 roudend-lg flex flex-col sm:flex-row items-center gap-2">
        <button className="border-2 w-48 rounded-lg flex items-center justify-center cursor-pointer border-gray-600 h-32 md:w-48">
          <div className="absolute cursor-pointer">
            <FiUpload size={30} color="#000"/>
          </div>
          <div className="cursor-pointer">
            <input 
              className="opacity-0 cursor-pointer" 
              type="file" 
              accept="image/*" 
              onChange={handleFile}
            />
          </div>
        </button>
        {localImages.map( item => ( 
          <div key={item.name} className="w-full h-32 flex items-center justify-center relative">
            <button className="absolute" onClick={ () => handleDeleteImage(item)}>
              <FiTrash size={28} color="#FFF" />
            </button>
            <img 
              src={item.previewUrl}
              className="rounded-lg w-full h-32 object-cover"
              alt="foto do local"
            />
          </div>
        ))}
      </div>

      <div className="w-full bg-white p-3 rounded-lg flex flex-col sm:flex-row items-center gap-2 mt-2">
        <form 
          className="w-full"
          onSubmit={handleSubmit(onSubmit)}
        >

          <div className="mb-3">
            <p className="mb-2 font-medium">Nome do Local</p>
            <Input 
              type="text"
              register={register}
              name="nome" 
              error={errors.nome?.message}
              placeholder="Ex: Parque das Nações Indigenas"
            />
          </div>

          <div className="flex w-full mb-3 flex-row items-center gap-4">
            <div className="mb-3">
              <p className="mb-2 font-medium">Contato</p>
              <Input 
                type="text"
                register={register}
                name="contato" 
                error={errors.contato?.message}
                placeholder="Ex: 67 6767-6767"
              />
            </div>
            <div className="mb-3">
              <p className="mb-2 font-medium">Horário de Funcionamento</p>
              <Input 
                type="text"
                register={register}
                name="horario" 
                error={errors.horario?.message}
                placeholder="Ex: 08:00 as 20:00"
              />
            </div>
            <div className="mb-3">
              <p className="mb-2 font-medium">Valor da Entrada</p>
              <Input 
                type="text"
                register={register}
                name="valor" 
                error={errors.valor?.message}
                placeholder="Ex: R$ 30,00 ou Gratuita"
              />
            </div>
            <div className="mb-3">
              <p className="mb-2 font-medium">Bairro</p>
              <Input 
                type="text"
                register={register}
                name="bairro" 
                error={errors.bairro?.message}
                placeholder="Ex: Parque dos Poderes"
              />
            </div>
          </div>
          <div className="mb-3">
              <p className="mb-2 font-medium">Endereço</p>
              <Input 
                type="text"
                register={register}
                name="endereco" 
                error={errors.endereco?.message}
                placeholder="Ex: Parque dos Poderes"
              />
          </div>
          <div className="mb-3">
              <p className="mb-2 font-medium">Descrição</p>
              <textarea 
                className="border-2 w-full roudend-md h-24 px-2"
                {...register("descricao")}
                name="descricao"
                id="descricao"
                placeholder="Digite uma breve explicação do local"
              />
              {errors.descricao?.message}
          </div>
          <button type="submit" className="w-full rounded-md bg-blue-500 text-white font-medium h-10 cursor-pointer">
            Cadastrar
          </button>
        </form>
      </div>
    </Container>
  )
}


