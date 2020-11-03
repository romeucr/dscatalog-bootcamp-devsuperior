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

//recebe os dados que vieram na resposta do login e salva no localStorage do navegador
export const saveSessionData = (loginResponse: LoginResponse) => {
   localStorage.setItem('authData', JSON.stringify(loginResponse)); //stringfy transforma o objeto em string
}

export const getSessionData = () => {
   const sessionData = localStorage.getItem('authData') ?? '{}'; //se nao encontra no localstorage o authdata, retorna um objeto vazio. O operador de coalescencia ?? executa a direita quando o valor da esquerda for null ou undefined
   const parsedSessionData = JSON.parse(sessionData);

   return parsedSessionData as LoginResponse; //type casting. Transforma o objeto que era do tipo any para um LoginResponse
}