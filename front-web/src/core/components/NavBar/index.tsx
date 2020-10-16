import React from 'react';
import { Link, NavLink } from 'react-router-dom';
import './styles.scss';

const NavBar = () => (
   <nav className="row bg-primary main-nav">
      <div className="col-2">
         <Link to="/" className="nav-logo-text">
            <h4>DS Catalog</h4>
         </Link>
      </div>
      <div className="col-6 offset-4">
         <ul className="main-menu">
            <li> {/* //Navlink adiciona automaticamente a classe active quando un link é clicado. Assim basta estilizar com o css */}
               <NavLink to="/" exact> 
                  HOME
               </NavLink>
            </li>
            <li>
               <NavLink to="/products">
                  Catálogo
               </NavLink>
            </li>
            <li>
               <NavLink to="/admin">
                  Admin
               </NavLink>
            </li>
         </ul>
      </div>
   </nav>
);

export default NavBar;