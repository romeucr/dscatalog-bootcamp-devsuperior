import ButtonIcon from 'core/components/ButtonIcon';
import React, { useState } from 'react'
import { Link, useHistory, useLocation } from 'react-router-dom';
import AuthCard from '../Card';
import { useForm } from 'react-hook-form';
import './styles.scss'
import { makeLogin } from 'core/utils/request';
import { saveSessionData } from 'core/utils/auth';

type FormData = {
   username: string;
   password: string;
}

type LocationState = { 
   from: string
}

const Login = () => {
   const { register, handleSubmit, errors } = useForm<FormData>(); // initialize the hook form
   const [hasError, setHasError] = useState(false);
   const history = useHistory();
   const location = useLocation<LocationState>();

   const { from } = location.state || { from: {pathname: "/admin"} };

   const onSubmit = (data: FormData) => {
      makeLogin(data)
         .then(response => { //promise tem dois estados, sucesso ou nao. Se sucesso cai no then, se falha cai no catch
            setHasError(false);
            saveSessionData(response.data);
            history.replace(from); //antes estava push. Alterado para replace(que desconsidera o historico imediatamente anterior e redireciona por segundo anterior (-2)
         })
         .catch(() => {
            setHasError(true);
         })
   }

   return (
      <AuthCard title="login">
         {/* //conteudo daqui será no {children} do componente */}
         {hasError && (
            <div className="alert alert-danger mt-5">
               Usuário ou senha inválidos!
            </div>
         )}

         <form className="login-form" onSubmit={handleSubmit(onSubmit)}>
            <div className="margin-bottom-20px">
               <input
                  type="email"
                  className= {`form-control input-base ${errors.username ?  'is-invalid' : '' }`} //se houver errors.username, vai inserir a classe is-invalid
                  placeholder="Email"
                  name="username"
                  ref={register({
                     required: "Campo obrigatório",
                     pattern: {
                       value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                       message: "Email inválido"
                     }
                   })}
               />
             {errors.username && (
                  <div className="invalid-feedback d-block">
                  {errors.username.message} {/* //mensagem de message do input email */}
               </div>
             )}
            </div>
            <div>
               <input
                  type="password"
                  className= {`form-control input-base ${errors.password ?  'is-invalid' : '' }`}
                  placeholder="Senha"
                  name="password"
                  ref={register({required: "Campo obrigatório" })}
               />
             {errors.password && (
                  <div className="invalid-feedback d-block">
                  {errors.password.message}
               </div>
             )}
            </div>
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