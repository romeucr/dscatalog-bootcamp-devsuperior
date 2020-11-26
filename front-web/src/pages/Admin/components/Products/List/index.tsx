import React, { useEffect, useState, useCallback } from 'react';
import { ProductsResponse } from 'core/types/Product';
import { makePrivateRequest, makeRequest } from 'core/utils/request';
import { toast } from 'react-toastify'; //importado o toastcontainer no App.tsx e o toast aqui, onde será exibido
import { useHistory } from 'react-router-dom';
import Card from '../Card';
import Pagination from 'core/components/Pagination';

const List = () => {

   const [productsResponse, setProductsResponse] = useState<ProductsResponse>();
   const [isLoading, setIsLoading] = useState(false);
   const [activePage, setActivePage] = useState(0);
   const history = useHistory();

   const getProducts = useCallback(() => {
      const params = {
         page: activePage,
         linesPerPage: 3, //quantidade de items que mostra na tela
         direction: 'DESC',
         orderBy: 'id'
      }

      //Acessando a API: em package.json foi colocada a config "proxy": "http://localhost:8080", para evitar o problema de CORS ao fazer as requisicoes a API 
      //e aqui colocado o endereço de desenvolvimento do React. Isso vai montar o localhost:8080/products/...
      setIsLoading(true); //iniciando o loader
      makeRequest({ url: '/products', params })
         .then(response => setProductsResponse(response.data))
         .finally(() => {
            setIsLoading(false); //finalizando o loader
         })
   }, [activePage])

   //useEffect react hook (funcao) para acessar ciclo de vida do componente. primeiro uma function(), que faz alguma coisa e uma lista [] de dependencias. 
   //Vazia para realizar alguma coisa assim que o componente iniciar, se tiver algo nos conchetes, ira executar sempre que esse algo for alterado
   useEffect(() => {
      getProducts()
   }, [getProducts]);

   const handleCreate = () => {
      history.push('/admin/products/create');
   }

   const onRemove = (productId: number) => {
      const confirm = window.confirm('Deseja realmente excluir o produto?') //nativo do JS, abre uma caixa de dialogo no navegador com aceitar(true) ou cancelar(false).
      if (confirm) {
         makePrivateRequest({ url: `/products/${productId}`, method: 'DELETE' })
            .then(() => {
               toast.info('Produto excluído com sucesso!')
               getProducts()
            })
            .catch(() => {
               toast.error('Erro ao excluir produto!')
            })
      }
   }

   return (
      <div className="admin-products-list">
         <button className="btn btn-primary btn-mid" onClick={handleCreate}>
            ADICIONAR
         </button>
         <div className="admin-list-container">
            {productsResponse?.content.map(product => (
               <Card product={product} key={product.id} onRemove={onRemove} />
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
