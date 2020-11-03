import axios, { Method } from 'axios';
import qs from 'qs';
import { CLIENT_ID, CLIENT_SECRET, getSessionData } from './auth';
import history from './history';

//tipo javascript do que será composta a requisicao (montada no makeRequest(). 
// a interrogacao ? faz com que o atributo nao seja obrigatorio na hora de chamar o metodo.)
//method= metodo HTTP que será chamado. url=da applicacao(/product, /details, etc)
//data= em caso de PUT ou POST, o body da requisicao. params= no GET com mais opcoes como linesPerPage
type RequestParams = {
   method?: Method;
   url: string;
   data?: object | string; //pode receber objeto ou string
   params?: object;
   headers?: object;
}

type LoginData = {
   username: string;
   password: string;
}
//sem a configuracao de CORS, é necessario configurar un proxy no package.json "proxy": "http://localhost:8080" e mandar a requisicao na porta 3000 (react)
//uma vez configurado o CORS no backend, podemos faze ro base url direto pro endpoint da aplicacao na porta 8080
const BASE_URL = 'http://localhost:8080'


// Add a response interceptor
axios.interceptors.response.use(function (response) {
   // Any status code that lie within the range of 2xx cause this function to trigger
   // Do something with response data
   return response;
 }, function (error) {
   // Any status codes that falls outside the range of 2xx cause this function to trigger
   // Do something with response error
   if (error.response.status === 401) {
      history.push('/admin/auth/login');
   }

   return Promise.reject(error);
 });

//para fazer requisicoes dinamicas.
export const makeRequest = ({ method = 'GET', url, data, params, headers }:RequestParams) => {
   return axios({
      method, 
      url: `${BASE_URL}${url}`,
      data,
      params,
      headers
   });
}

//request para recursos que necessitam login como cadastro de produto, etc..
export const makePrivateRequest = ({ method = 'GET', url, data, params }: RequestParams) => {
   const sessionData = getSessionData();
   
   const headers = {
      'Authorization': `Bearer ${sessionData.access_token}`
   }

   return makeRequest({ method, url, data, params, headers });
}

export const makeLogin = (loginData: LoginData) => {
   const token = `${CLIENT_ID}:${CLIENT_SECRET}`;

   //header da requisicao. O Authorization é o CLIENT_ID+CLIENT_SECRET codificados em base64
   const headers = {
      Authorization: `Basic ${window.btoa(token)}`,
      'Content-Type': 'application/x-www-form-urlencoded' //Content-Type entre aspas para que o TS aceite o traço. Também usado se utilizado outro caracter especiao, espaço etc
   }

   const payload = qs.stringify({ ...loginData, grant_type: 'password' });
   
   return makeRequest ({ url: '/oauth/token', data: payload, method: 'POST', headers });
}