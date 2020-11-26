import React, { useEffect, useState } from 'react';
import { ProductsResponse } from 'core/types/Product';
import { makeRequest } from 'core/utils/request';
import { useHistory } from 'react-router-dom';
import Card from '../Card';
import Pagination from 'core/components/Pagination';

const List = () => {

   const [productsResponse, setProductsResponse] = useState<ProductsResponse>();
   const [isLoading, setIsLoading] = useState(false);
   const [activePage, setActivePage] = useState(0);
   const history = useHistory();

   console.log(productsResponse)
   //useEffect react hook (funcao) para acessar ciclo de vida do componente. primeiro uma function(), que faz alguma coisa e uma lista [] de dependencias. 
   //Vazia para realizar alguma coisa assim que o componente iniciar, se tiver algo nos conchetes, ira executar sempre que esse algo for alterado
   useEffect(() => {
      const params = {
         page: activePage,
         linesPerPage: 3 //quantidade de items que mostra na tela
      }

      //Acessando a API: em package.json foi colocada a config "proxy": "http://localhost:8080", para evitar o problema de CORS ao fazer as requisicoes a API 
      //e aqui colocado o endereço de desenvolvimento do React. Isso vai montar o localhost:8080/products/...
      setIsLoading(true); //iniciando o loader
      makeRequest({ url: '/products', params })
         .then(response => setProductsResponse(response.data))
         .finally(() => {
            setIsLoading(false); //finalizando o loader
         })
   }, [activePage]);

   const handleCreate = () => {
      history.push('/admin/products/create');
   }

   return (
      <div className="admin-products-list">
         <button className="btn btn-primary btn-mid" onClick={handleCreate}>
            ADICIONAR
         </button>
         <div className="admin-list-container">
            {productsResponse?.content.map(product => (
               <Card product={product} key={product.id}/>
            ))}
                     {/* se houver productResponse, mostra paginacao */}
         {productsResponse && (
            <Pagination 
               totalPages={productsResponse.totalPages}
               activePage={activePage}
               onChange={page => setActivePage(page)}
            />
         )}
         </div>
      </div>
   )
}

export default List;
