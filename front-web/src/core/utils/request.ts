import axios, { Method } from 'axios';

//tipo javascript do que será composta a requisicao (montada no makeRequest(). 
// a interrogacao ? faz com que o atributo nao seja obrigatorio na hora de chamar o metodo.)
//method= metodo HTTP que será chamado. url=da applicacao(/product, /details, etc)
//data= em caso de PUT ou POST, o body da requisicao. params= no GET com mais opcoes como linesPerPage
type requestParams = {
   method?: Method;
   url: string;
   data?: object;
   params?: object;
}

const BASE_URL = 'http://localhost:3000';

//para fazer requisicoes dinamicas.
export const makeRequest = ({ method = 'GET', url, data, params }:requestParams) => {
   return axios({
      method, 
      url: `${BASE_URL}${url}`,
      data,
      params
   });
}