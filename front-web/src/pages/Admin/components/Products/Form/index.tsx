import React from 'react';
import { useForm } from 'react-hook-form';
import { makePrivateRequest } from 'core/utils/request';
import BaseForm from '../../BaseForm';
import './styles.scss';

type FormState = {
   name: string;
   price: string;
   description: string;
   imgUrl: string;
}

const Form = () => {

   const { register, handleSubmit, errors } = useForm<FormState>()

   const onSubmit = (data: FormState) => {
      //quando é feito o onSubmit do form, os dados vao para variavel data e é feito o submit ao backend. makeRequest é o feito em core/utils
      makePrivateRequest({ url: '/products', method: 'POST', data });
   }

   return (
      <form onSubmit={handleSubmit(onSubmit)}>
         <BaseForm title="CADASTRAR UM PRODUTO">
            <div className="row">
               <div className="col-6">
                  <div className="margin-bottom-20px">
                     <input
                        ref={register({
                           required: "Campo obrigatório",
                           minLength: { value: 5, message: "Nome do produto deve no mínimo 5 caracteres"},
                           maxLength: { value: 60, message: "Nome do produto deve ter no máximo 60 caracteres"}
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