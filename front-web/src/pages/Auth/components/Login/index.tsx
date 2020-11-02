import ButtonIcon from 'core/components/ButtonIcon';
import React from 'react'
import { Link } from 'react-router-dom';
import AuthCard from '../Card';
import { useForm } from 'react-hook-form';
import './styles.scss'

type FormData = {
   email: string;
   password: string;
}

const Login = () => {
   const { register, handleSubmit } = useForm<FormData>(); // initialize the hook form
   const onSubmit = (data:FormData) => {
      console.log(data);
   }
   
   return (
      <AuthCard title="login">
         {/* //conteudo daqui será o children do componente */}
         <form className="login-form" onSubmit={handleSubmit(onSubmit)}>
            <input 
               type="email" 
               className="form-control input-base margin-bottom-20px"
               placeholder="Email"
               name="email"
               ref={register}
            />
            <input 
               type="password" 
               className="form-control input-base"
               placeholder="Senha"
               name="password"
               ref={register}
            />
            <Link to="/admin/auth/recover" className="login-link-recover">
               Esqueci a senha
            </Link>
            <div className="login-submit">
               <ButtonIcon text="LOGAR"/>
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