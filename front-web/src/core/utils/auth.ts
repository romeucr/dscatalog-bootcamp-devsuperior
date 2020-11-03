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