import ButtonIcon from 'core/components/ButtonIcon';
import React, { useState } from 'react'
import { Link, useHistory } from 'react-router-dom';
import AuthCard from '../Card';
import { useForm } from 'react-hook-form';
import './styles.scss'
import { makeLogin } from 'core/utils/request';
import { saveSessionData } from 'core/utils/auth';

type FormData = {
   username: string;
   password: string;
}

const Login = () => {
   const { register, handleSubmit } = useForm<FormData>(); // initialize the hook form
   const [hasError, setHasError] = useState(false);
   const history = useHistory();

   const onSubmit = (data: FormData) => {
      makeLogin(data)
         .then(response => { //promise tem dois estados, sucesso ou nao. Se sucesso cai no then, se falha cai no catch
            setHasError(false);
            saveSessionData(response.data);
            history.push('/admin');
         }) 
         .catch(() => {
            setHasError(true);
         })
   }  

   return (
      <AuthCard title="login">
         {/* //conteudo daqui será o children do componente */}
         {hasError && (
            <div className="alert alert-danger mt-5">
               Usuário ou senha inválidos!
            </div>
         )}

         <form className="login-form" onSubmit={handleSubmit(onSubmit)}>
            <input
               type="email"
               className="form-control input-base margin-bottom-20px"
               placeholder="Email"
               name="username"
               ref={register ({ required: true })}
            />
            <input
               type="password"
               className="form-control input-base"
               placeholder="Senha"
               name="password"
               ref={register ({ required: true })}
            />
            <Link to="/admin/auth/recover" className="login-link-recover">
               Esqueci a senha
            </Link>
            <div className="login-submit">
               <ButtonIcon text="LOGAR" />
            </div>
            <div className="text-center">
               <span className="not-registered">
                  Não tem cadastro?
               </span>
               <Link to="/admin/auth/register" className="login-link-register">
                  CADASTRAR
               </Link>
            </div>
         </form>
      </AuthCard>
   )
}
export default Login;