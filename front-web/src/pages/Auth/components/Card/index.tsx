import React from 'react'
import './styles.scss'

type Props = {
   title: String
   children: React.ReactNode //pode ser uma div, componente, qualquer coisa
}

const AuthCard = ({ title, children }: Props) => {
   return (
      <div className="card-base auth-card">
         <h1 className="auth-card-title">
            {title}
         </h1>
         {children} {/* componente dinamico, será o formulario. Implementado no index do Login */}
      </div>
   )
}
export default AuthCard;