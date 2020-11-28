import React, { useEffect, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { toast } from 'react-toastify'; //importado o toastcontainer no App.tsx e o toast aqui, onde será exibido
import Select from 'react-select';
import { makePrivateRequest, makeRequest } from 'core/utils/request';
import BaseForm from '../../BaseForm';
import './styles.scss';
import { useHistory, useParams } from 'react-router-dom';
import { Category } from 'core/types/Product';

type FormState = {
   name: string;
   price: string;
   description: string;
   imgUrl: string;
   categories: Category[];
}

type ParamsType = {
   productId: string;
}

const Form = () => {

   const { register, handleSubmit, errors, setValue, control } = useForm<FormState>(); //através do setCalue é possivel setar os campos do formulario dinamicamente
   const history = useHistory();
   const { productId } = useParams<ParamsType>(); //atraves do useParams é possivel capturar o id da URL
   const [isLoadingCategories, setIsloadingCategories] = useState(false)
   const [categories, setCategories] = useState<Category[]>([]);
   const isEditing = productId !== 'create' //se o productid for um número e nao 'create', isEditing = true
   const formTitle = isEditing ? 'EDITAR PRODUTO' : 'CADASTRAR PRODUTO'

   useEffect(() => {
      if (isEditing) {
         makeRequest({ url: `/products/${productId}` })
            .then(response => { //set os valores dos campos através do atributo name de cada um
               setValue('name', response.data.name)
               setValue('price', response.data.price)
               setValue('description', response.data.description)
               setValue('imgUrl', response.data.imgUrl)
               setValue('categories', response.data.categories)
            })
      }
   }, [productId, isEditing, setValue]);

   useEffect(() => {
      setIsloadingCategories(true)
      makeRequest({ url: `/categories` })
         .then(response => setCategories(response.data.content))
         .finally(() => setIsloadingCategories(false))

   }, []);

   const onSubmit = (data: FormState) => {
      //quando é feito o onSubmit do form, os dados vao para variavel data e é feito o submit ao backend. makeRequest é o feito em core/utils
      makePrivateRequest({
         url: isEditing ? `/products/${productId}` : '/products', //se estiver editando, vai pra /productId, senao /product
         method: isEditing ? 'PUT' : 'POST',
         data
      })
         .then(() => {
            toast.info(isEditing ? 'Produto editado   com sucesso!' : 'Produto salvo com sucesso!')
            history.push('/admin/products')
         })
         .catch(() => {
            toast.error(isEditing ? 'Erro ao editar produto!' : 'Erro ao salvar produto!')
         })
   }

   return (
      <form onSubmit={handleSubmit(onSubmit)}>
         <BaseForm
            title={formTitle}
         >
            <div className="row">
               <div className="col-6">
                  <div className="margin-bottom-20px">
                     <input
                        ref={register({
                           required: "Campo obrigatório",
                           minLength: { value: 5, message: "Nome do produto deve no mínimo 5 caracteres" },
                           maxLength: { value: 60, message: "Nome do produto deve ter no máximo 60 caracteres" }
                        })}
                        name="name"
                        type="text"
                        className="form-control input-base"
                        placeholder="Nome do Produto"
                     />
                     {errors.name && (
                        <div className="invalid-feedback d-block">
                           {errors.name.message}
                        </div>
                     )}
                  </div>
                  <div className="margin-bottom-20px ">
                     <Controller //do react-hook-form para integrar o react-select abaixo
                        name="categories"
                        rules={{ required: true }} //para definir validacao
                        control={control}
                        isLoading={isLoadingCategories}
                        as={Select}  //componente do react-select. isMulti indica que pode selecionar varias opcoes, nao só uma (padrao) 
                        options={categories} //tem que se o mesmo nome do backend
                        getOptionLabel={(option: Category) => option.name} //para mostrar as informacoes o react-select precisa de um label e value(este é o enviado ao server). Setar esses dois gets para isso
                        getOptionValue={(option: Category) => String(option.id)} //transforma o id que é number para string.
                        isMulti
                        classNamePrefix="categories-select" //para poder estilizar com css. adiciona o prefixo inserido. Inspecionar o componente no browser para saber o nome completo da classe, por exemplo, categories-select__control
                        placeholder="Categorias"
                     />
                     {errors.categories && (
                        <div className="invalid-feedback d-block">
                           Campo Obrigatório {/* //como é a única coisa sendo tratada (campo required) a mensagem está hard coded */}
                        </div>
                     )}
                  </div>
                  <div className="margin-bottom-20px ">
                     <input
                        ref={register({ required: "Campo obrigatório" })}
                        name="price"
                        type="number"
                        className="form-control input-base"
                        placeholder="Preço"
                     />
                     {errors.price && (
                        <div className="invalid-feedback d-block">
                           {errors.price.message}
                        </div>
                     )}
                  </div>
                  <div className="margin-bottom-20px">
                     <input
                        ref={register({ required: "Campo obrigatório" })}
                        name="imgUrl"
                        type="text"
                        className="form-control input-base"
                        placeholder="imagem"
                     />
                     {errors.imgUrl && (
                        <div className="invalid-feedback d-block">
                           {errors.imgUrl.message}
                        </div>
                     )}
                  </div>
               </div>
               <div className="col-6">
                  <textarea
                     ref={register({ required: "Campo obrigatório" })}
                     name="description"
                     className="form-control input-base"
                     cols={30}
                     rows={10}
                     placeholder="Descrição"
                  />
                  {errors.description && (
                     <div className="invalid-feedback d-block">
                        {errors.description.message}
                     </div>
                  )}
               </div>
            </div>
         </BaseForm>
      </form>
   )
}

export default Form;