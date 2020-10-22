import { makeRequest } from 'core/utils/request';
import React, { useState } from 'react';
import BaseForm from '../../BaseForm';
import './styles.scss';

type FormState = {
   name: string;
   price: string;
   category: string;
   description: string
}

const Form = () => {
   const [formData, setFormData] = useState<FormState>({
      name: '',
      price: '',
      category: '2',
      description: ''
   });

   type formEvent = React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>;

   const handleOnChange = (event: formEvent) => {
      const name = event.target.name;
      const value= event.target.value;
   
      setFormData(data => ({...data, [name]:value })); //pega os dados de todo o form e monta o payload
   }

   const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault(); //previne o default do evento que é dar reload na pagina

      const payload = {
         ...formData,
         imgUrl: 'https://imagens.canaltech.com.br/ofertas/o14307.1.jpg',
         categories: [{ id: formData.category }]
      }
      //submit ao backend. makeRequest é o feito em core/utils
      makeRequest({url: '/products', method: 'POST', data: payload})
         .then(() => {
            setFormData({name: '', category: '', price: '', description: ''})
         });
   }
   return (

      <form onSubmit={handleSubmit}>
         <BaseForm title="CADASTRAR UM PRODUTO">
            <div className="row">
               <div className="col-6">
                  <input
                     value={formData.name}
                     name="name"
                     type="text"
                     className="form-control mb-5"
                     onChange={handleOnChange}
                     placeholder="Nome do Produto"
                  />
                  <select
                     value={formData.category}
                     name="category"
                     className="form-control mb-5" 
                     onChange={handleOnChange}>
                        <option value="2">Eletronicos</option>
                        <option value="3">Computador</option>
                        <option value="1">Livros</option>
                  </select>
                  <input
                     value={formData.price}
                     name="price"
                     type="text"
                     className="form-control"
                     onChange={handleOnChange}
                     placeholder="Preço"
                  />
               </div>
               <div className="col-6">
                  <textarea
                     value={formData.description}
                     name="description" 
                     className="form-control"
                     onChange={handleOnChange}
                     cols={30} 
                     rows={10} 
                  />
               </div>
            </div>
         </BaseForm>
      </form>
   )
}

export default Form;