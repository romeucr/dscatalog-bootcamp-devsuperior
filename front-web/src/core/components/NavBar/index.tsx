import React, { useEffect, useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { getAccessTokenDecoded, logout } from 'core/utils/auth';
import './styles.scss';

const NavBar = () => {
   const [currentUser, setCurrentUser] = useState('');
   
   // hook do react-router-dom. Pega a localizacao "/admin/products" por exemplo. De onde o usuario esta.
   const location = useLocation();

   //sempre que mudar de pagina ira buscar o token decodificado, acessar o user_name e setar no currentUser (que é mostrado la embaixo)
   useEffect(() => {
      const currentUserData = getAccessTokenDecoded();
      setCurrentUser(currentUserData.user_name);
   }, [location])


   const handleLogout = (event: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
      event.preventDefault()
      logout()
   }

   return (
      <nav className="row bg-primary main-nav">
         <div className="col-3">
            <Link to="/" className="nav-logo-text">
               <h4>DS Catalog</h4>
            </Link>
         </div>
         <div className="col-6">
            <ul className="main-menu">
               <li> {/* //Navlink adiciona automaticamente a classe active quando un link é clicado. Assim basta estilizar com o css */}
                  <NavLink className="nav-link" to="/" exact>
                     HOME
                  </NavLink>
               </li>
               <li>
                  <NavLink className="nav-link" to="/products">
                     Catálogo
                  </NavLink>
               </li>
               <li>
                  <NavLink className="nav-link" to="/admin">
                     Admin
                  </NavLink>
               </li>
            </ul>
         </div>
         <div className="col-3 text-right">
            {currentUser && (
               <>
                  {currentUser}
                  <a
                     href="#logout"
                     className="nav-link active d-inline"
                     onClick={handleLogout}
                  >
                     LOGOUT
                 </a>
               </>
            )}
            {!currentUser && (
               <Link className="nav-link active" to="/auth/login">
                  LOGIN
               </Link>
            )}
         </div>
      </nav>
   )
};

export default NavBar;