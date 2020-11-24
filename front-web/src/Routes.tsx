import React from 'react';
import { Router, Switch, Route, Redirect } from 'react-router-dom';
import NavBar from './core/components/NavBar';
import Admin from './pages/Admin';
import Catalog from './pages/Catalog';
import ProductDetails from './pages/Catalog/components/ProductDetails';
import Home from './pages/Home';
import Auth from './pages/Auth';
import history from './core/utils/history';

const Routes = () => (
   <Router history={history}>
   <NavBar />
      <Switch>
         <Route path="/" exact>
            <Home />
         </Route>

         <Route path="/products" exact>
            <Catalog />
         </Route>
         
         <Route path="/products/:productId">
            <ProductDetails />
         </Route>
         
         <Redirect from="/auth" to="/auth/login" exact/>
         <Route path="/auth">
            <Auth />
         </Route>
         
         <Redirect from="/admin" to="/admin/products" exact/>
         <Route path="/admin"> {/* PrivateRoute é um componente criado por nós. Usado para verificar se o usuário está autenticado ou nao. Se nao autenticado, redirect pra login */}
            <Admin />
         </Route>

      </Switch>
   </Router>
);

export default Routes;