import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import ProductCard from './components/ProductCard';
import './styles.scss';
import { makeRequest } from 'core/utils/request';
import { ProductsResponse } from 'core/types/Product';
import ProductCardLoader from './components/Loaders/ProductCardLoader';

const Catalog = () => {
   //quando o componente iniciar, buscar lista de produtos

   //quando lista de produtos estiver disponivel, 
   //popular um estado do componenente e listar os produtos dinamicamente
   //para executar algo quando o componente iniciar (abrir pagina catalog).
   const [productsResponse, setProductsResponse] = useState<ProductsResponse>();

   const [isLoading, setIsLoading] = useState(false);

   //useEffect react hook (funcao) para acessar ciclo de vida do componente. primeiro uma function(), que faz alguma coisa e uma lista [] de dependencias. 
   //Vazia para realizar alguma coisa assim que o componente iniciar
   useEffect(() => {
      const params = {
         page: 0,
         linesPerPage: 8
      }

      //Acessando a API: em package.json foi colocada a config "proxy": "http://localhost:8080", para evitar o problema de CORS ao fazer as requisicoes a API 
      //e aqui colocado o endereço de desenvolvimento do React. Isso vai montar o localhost:8080/products/...
      setIsLoading(true); //iniciando o loader
      makeRequest({ url: '/products', params })
         .then(response => setProductsResponse(response.data))
         .finally(() => {
            setIsLoading(false); //finalizando o loader
         })
   }, []);

   return (
      <div className="catalog-container">
         <h1 className="catalog-title">
            Catálogo de Produtos
         </h1>
         <div className="catalog-products">
            {isLoading ? <ProductCardLoader /> : (
               productsResponse?.content.map(product => ( //.map é como um for e vai interagir com todos os elementos do content.
                  <Link to={`/products/${product.id}`} key={product.id}>
                     <ProductCard product={product} />
                  </Link>
               ))
            )}
         </div>
      </div>
   )
};

export default Catalog;