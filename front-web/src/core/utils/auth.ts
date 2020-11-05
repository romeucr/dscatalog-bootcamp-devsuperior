import jwtDecode from 'jwt-decode';

//constantes que são utilizadas no projeto inteiro
export const CLIENT_ID = 'dscatalog';
export const CLIENT_SECRET = 'dscatalog123';

type LoginResponse = {
   access_token: string;
   token_type: string;
   expires_in: number;
   scope: string;
   userFirstName: string;
   userId: number;
}

export type Role = 'ROLE_OPERATOR' | 'ROLE_ADMIN'; 

type AccessToken = {
   exp: number;
   user_name: string;
   authorities: Role[];
}

//recebe os dados que vieram na resposta do login e salva no localStorage do navegador
export const saveSessionData = (loginResponse: LoginResponse) => {
   localStorage.setItem('authData', JSON.stringify(loginResponse)); //stringfy transforma o objeto em string
}

export const getSessionData = () => {
   const sessionData = localStorage.getItem('authData') ?? '{}'; //se nao encontra no localstorage o authdata, retorna um objeto vazio. O operador de coalescencia ?? executa a direita quando o valor da esquerda for null ou undefined
   const parsedSessionData = JSON.parse(sessionData);

   return parsedSessionData as LoginResponse; //type casting. Transforma o objeto que era do tipo any para um LoginResponse
}
export const getAccessTokenDecoded = () => {
   const sessionData = getSessionData();

   const tokenDecoded = jwtDecode(sessionData.access_token);

   return tokenDecoded as AccessToken;
}

export const isTokenValid = () => {
   const { exp } = getAccessTokenDecoded(); /* getAccessTokenDecoded retorna o AccessToken que contém o exp. Ele pode ser recuperado desta format, que se chama destruct */
   return Date.now() <= exp * 1000 /*multiplicado por mil porque o JS entrega em milisegundos e o token vem em segundos (Unix timestamp). Retorna true or false porque está usando a comparacao*/
   }

export const isAuthenticated = () => {
   const sessionData = getSessionData();
   return sessionData.access_token && isTokenValid();
}

export const isAllowedByRole = (routeRoles: Role[] = []) => {
   if (routeRoles.length === 0) {
      return true;
   }

   const { authorities } = getAccessTokenDecoded();
   return routeRoles.some(role => authorities.includes(role));
}